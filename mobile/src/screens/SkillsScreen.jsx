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
                <Text style={globalStyles.cardTitle}>Recommended Learning</Text>
                {skillGapData.learningResources.map((res, i) => (
                  <View key={i} style={styles.resCard}>
                    <View style={globalStyles.badgeAmber}>
                      <Text style={globalStyles.badgeAmberText}>Gap: {res.skill}</Text>
                    </View>
                    <Text style={styles.resTitle}>{res.title}</Text>
                    <Text style={styles.resProvider}>Provider: {res.provider}</Text>
                  </View>
                ))}
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
});
