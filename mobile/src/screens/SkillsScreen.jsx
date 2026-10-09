import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { theme, globalStyles } from "../theme";
import Header from "../components/Header";
import api from "../services/api";

export default function SkillsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState("Software Developer");
  const [skillGapData, setSkillGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedItems, setCompletedItems] = useState({});

  const availableCareers = [
    "Software Developer",
    "Data Analyst",
    "Machine Learning Engineer",
    "Data Engineer",
    "Cloud Architect",
    "Cybersecurity Specialist"
  ];

  const fetchSkillGap = async () => {
    try {
      setLoading(true);
      const meRes = await api.get("/auth/me");
      if (meRes.data) setUser(meRes.data);

      const res = await api.get(`/skill-gap?career=${encodeURIComponent(selectedCareer)}`);
      if (res.data) setSkillGapData(res.data);
    } catch (err) {
      console.error("Fetch skill gap error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGap();
  }, [selectedCareer]);

  const completedActSet = new Set((user?.completedActivities || []).map((a) => String(a.activityId || a.title)));

  const handleCompleteActivity = async (itemId, itemTitle, itemSkill) => {
    try {
      setCompletedItems((prev) => ({ ...prev, [itemId]: "completing" }));
      const res = await api.post("/activity/complete", {
        activityId: String(itemId),
        activityType: "RESOURCE_COMPLETED",
        title: `Completed ${itemTitle} (${itemSkill})`,
        xpEarned: 50,
      });

      if (res.data?.user) {
        setUser(res.data.user);
      }
      setCompletedItems((prev) => ({ ...prev, [itemId]: "done" }));
    } catch (err) {
      console.error("Activity complete error:", err);
      setCompletedItems((prev) => ({ ...prev, [itemId]: "done" }));
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header user={user} navigation={navigation} />

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        {/* HEADER */}
        <View style={globalStyles.card}>
          <View style={globalStyles.badgeBlue}>
            <Text style={globalStyles.badgeBlueText}>Competency Profiler</Text>
          </View>
          <Text style={globalStyles.cardTitle}>Skills Gap Analysis 📈</Text>
          <Text style={globalStyles.cardSubtitle}>
            Compare your current technical skills against industry benchmarks for target career roles.
          </Text>
        </View>

        {/* TARGET CAREER SELECTOR */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: theme.colors.textDark, marginLeft: 16, marginBottom: 8 }}>
            Select Target Occupation:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
            {availableCareers.map((c) => {
              const isSelected = selectedCareer === c;
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => setSelectedCareer(c)}
                  style={[
                    styles.catPill,
                    isSelected ? styles.catPillSelected : null
                  ]}
                >
                  <Text style={[
                    styles.catPillText,
                    isSelected ? styles.catPillTextSelected : null
                  ]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 30 }} />
        ) : !skillGapData?.hasData ? (
          /* NO ASSESSMENT DATA PROMPT */
          <View style={[globalStyles.card, { alignItems: "center", paddingVertical: 30 }]}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🧭</Text>
            <Text style={globalStyles.cardTitle}>No Assessment Data Yet</Text>
            <Text style={[globalStyles.cardSubtitle, { textAlign: "center", marginBottom: 20 }]}>
              Complete more assessments to generate your skill analysis.
            </Text>
            <TouchableOpacity
              style={globalStyles.btnPrimary}
              onPress={() => navigation.navigate("Assessment")}
            >
              <Text style={globalStyles.btnPrimaryText}>⚡ Take Skill Assessment Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* COMPETENCY MATRIX & BENCHMARK */
          <View>
            <View style={globalStyles.card}>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.roleLabel}>Active Target Role</Text>
                  <Text style={globalStyles.cardTitle}>🎯 {skillGapData.career || selectedCareer}</Text>
                </View>
                <View style={styles.matchBadgeBox}>
                  <Text style={styles.matchLabel}>Match Score</Text>
                  <Text style={styles.matchVal}>{skillGapData.overallMatch || 85}%</Text>
                </View>
              </View>
            </View>

            {/* SKILLS COMPARISON CARDS */}
            <View style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>Competency Comparison Matrix</Text>
              <Text style={globalStyles.cardSubtitle}>Target Benchmark: 70/100</Text>

              {skillGapData.skills?.map((item, idx) => {
                const level = item.currentLevel || 0;
                const isStrong = level >= 70;

                return (
                  <View key={idx} style={styles.skillItemRow}>
                    <View style={styles.skillItemHeader}>
                      <Text style={styles.skillName}>{item.skill}</Text>
                      <View style={isStrong ? globalStyles.badgeGreen : globalStyles.badgeAmber}>
                        <Text
                          style={
                            isStrong
                              ? globalStyles.badgeGreenText
                              : globalStyles.badgeAmberText
                          }
                        >
                          {isStrong ? "✓ Strong" : "Needs Improvement"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.progressRow}>
                      <Text style={styles.progressVal}>{level}%</Text>
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(100, level)}%`,
                              backgroundColor: isStrong ? theme.colors.success : theme.colors.amber,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.benchmarkVal}>Target: 70</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* RECOMMENDED LEARNING RESOURCES */}
            {skillGapData.learningResources && skillGapData.learningResources.length > 0 ? (
              <View style={globalStyles.card}>
                <Text style={globalStyles.cardTitle}>Recommended Learning for {selectedCareer}</Text>
                <Text style={globalStyles.cardSubtitle}>
                  Targeted resources selected to bridge identified gaps.
                </Text>

                {skillGapData.learningResources.map((res, i) => {
                  const itemId = res._id || res.url || res.title || i;
                  const isDone = completedActSet.has(String(itemId)) || completedItems[itemId] === "done";
                  const isCompleting = completedItems[itemId] === "completing";

                  return (
                    <View key={i} style={styles.resCard}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={globalStyles.badgeAmber}>
                          <Text style={globalStyles.badgeAmberText}>Gap: {res.skill}</Text>
                        </View>
                        <View style={[globalStyles.badgeBlue, { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" }]}>
                          <Text style={[globalStyles.badgeBlueText, { color: "#4B5563" }]}>{res.difficulty || "Intermediate"}</Text>
                        </View>
                      </View>
                      
                      <Text style={styles.resTitle}>{res.title}</Text>
                      <Text style={styles.resProvider}>Provider: {res.provider}</Text>

                      <View style={{ gap: 8, marginTop: 12 }}>
                        <TouchableOpacity
                          style={globalStyles.btnOutline}
                          onPress={() => alert(`Opening resource: ${res.title}`)}
                        >
                          <Text style={globalStyles.btnOutlineText}>Open Resource ↗</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[
                            globalStyles.btnPrimary,
                            isDone && { backgroundColor: theme.colors.success }
                          ]}
                          onPress={() => handleCompleteActivity(itemId, res.title, res.skill)}
                          disabled={isDone || isCompleting}
                        >
                          {isCompleting ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                          ) : (
                            <Text style={globalStyles.btnPrimaryText}>
                              {isDone ? "✓ Completed (+50 XP)" : "Complete & Earn (+50 XP)"}
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  matchBadgeBox: {
    backgroundColor: theme.colors.bg,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  matchLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  matchVal: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  skillItemRow: {
    backgroundColor: theme.colors.bg,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  skillItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textMain,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressVal: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textDark,
    width: 32,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  benchmarkVal: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  resCard: {
    backgroundColor: theme.colors.bg,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textMain,
    marginTop: 4,
  },
  resProvider: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "#FFFFFF",
  },
  catPillSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  catPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
  catPillTextSelected: {
    color: theme.colors.primaryDark,
  },
});
