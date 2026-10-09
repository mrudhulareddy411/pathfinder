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

export default function AcademicTrackerScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      const meRes = await api.get("/auth/me");
      if (meRes.data) setUser(meRes.data);

      const perfRes = await api.get("/academic/performance");
      if (perfRes.data?.performance) setPerformance(perfRes.data.performance);
    } catch (err) {
      console.error("Fetch academic performance error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const gpa = user?.cgpa || performance?.gpa || "Not provided";
  const completedCount = performance?.assessmentsCompletedCount || 0;
  const avgScore = performance?.averageScore || "No assessments yet";
  const topSkill = performance?.topSkill || "No test data yet";
  const recentAttempts = performance?.recentAttempts || [];
  const strongestSkills = performance?.strongestSkills || [];
  const skillsToImprove = performance?.skillsToImprove || [];
  const recommendedAssessments = performance?.recommendedAssessments || [];

  return (
    <View style={globalStyles.container}>
      <Header user={user} navigation={navigation} />

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        {/* HEADER BANNER */}
        <View style={globalStyles.card}>
          <View style={globalStyles.badgeBlue}>
            <Text style={globalStyles.badgeBlueText}>Assessment & Academic Performance</Text>
          </View>
          <Text style={globalStyles.cardTitle}>Academic Dashboard 🎓</Text>
          <Text style={globalStyles.cardSubtitle}>
            Direct GPA profile records combined with real-time test attempts and skill performance analytics.
          </Text>

          <TouchableOpacity
            style={globalStyles.btnOutline}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={globalStyles.btnOutlineText}>✏️ Update Profile GPA</Text>
          </TouchableOpacity>
        </View>

        {/* METRICS GRID */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>Academic & Test Summary</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Student GPA</Text>
              <Text style={styles.metricValPrimary}>{gpa}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Assessments</Text>
              <Text style={styles.metricValDark}>{completedCount}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Avg Score</Text>
              <Text style={styles.metricValSuccess}>{avgScore}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Top Skill</Text>
              <Text style={styles.metricValDark} numberOfLines={1}>
                {topSkill}
              </Text>
            </View>
          </View>
        </View>

        {/* SKILL PERFORMANCE ANALYSIS */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>Skill Performance Analysis</Text>

          {strongestSkills.length > 0 ? (
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.sectionHeaderSuccess}>💪 Strongest Skills (≥ 70%)</Text>
              <View style={styles.badgeWrap}>
                {strongestSkills.map((s, i) => (
                  <View key={i} style={globalStyles.badgeGreen}>
                    <Text style={globalStyles.badgeGreenText}>
                      {s.name} — {s.score}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {skillsToImprove.length > 0 ? (
            <View>
              <Text style={styles.sectionHeaderAmber}>⚠️ Skills Needing Improvement (&lt; 70%)</Text>
              <View style={styles.badgeWrap}>
                {skillsToImprove.map((s, i) => (
                  <View key={i} style={globalStyles.badgeAmber}>
                    <Text style={globalStyles.badgeAmberText}>
                      {s.name} — {s.score}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {strongestSkills.length === 0 && skillsToImprove.length === 0 ? (
            <Text style={globalStyles.cardSubtitle}>
              Complete assessments to build your real skill score breakdown.
            </Text>
          ) : null}
        </View>

        {/* RECENT ATTEMPTS */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>Recent Assessment Attempts</Text>

          {recentAttempts.length > 0 ? (
            recentAttempts.map((att) => (
              <View key={att.id} style={styles.attemptRow}>
                <View>
                  <Text style={styles.attTitle}>{att.title}</Text>
                  <Text style={styles.attSub}>{att.category}</Text>
                </View>
                <View style={globalStyles.badgeBlue}>
                  <Text style={globalStyles.badgeBlueText}>
                    {att.percentage}% ({att.score}/{att.totalQuestions})
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={globalStyles.cardSubtitle}>No test attempts recorded yet.</Text>
          )}
        </View>

        {/* RECOMMENDED ASSESSMENTS CATALOG */}
        <View style={globalStyles.card}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.cardTitle}>Recommended Skill Assessments</Text>
              <Text style={globalStyles.cardSubtitle}>
                Choose a domain or career path assessment to test your knowledge.
              </Text>
            </View>
            <TouchableOpacity 
              style={[globalStyles.btnOutline, { paddingHorizontal: 12, paddingVertical: 6, marginLeft: 8 }]}
              onPress={() => navigation.navigate("Assessment")}
            >
              <Text style={[globalStyles.btnOutlineText, { fontSize: 11 }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {recommendedAssessments.length > 0 ? (
            recommendedAssessments.map((asm) => (
              <View key={asm.id} style={styles.recommendedCard}>
                <View style={styles.recHeader}>
                  <View style={globalStyles.badgeBlue}>
                    <Text style={globalStyles.badgeBlueText}>{asm.category}</Text>
                  </View>
                  <Text style={styles.durationText}>{asm.durationMinutes || 15} mins</Text>
                </View>
                <Text style={styles.attTitle}>{asm.title}</Text>
                
                <View style={{ alignItems: "flex-end", marginTop: 10 }}>
                  <TouchableOpacity 
                    style={[globalStyles.btnOutline, { paddingVertical: 6, paddingHorizontal: 12 }]}
                    onPress={() => navigation.navigate("Assessment")}
                  >
                    <Text style={[globalStyles.btnOutlineText, { fontSize: 11 }]}>Start Test ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={{ padding: 16, backgroundColor: theme.colors.bg, borderRadius: 8, alignItems: "center" }}>
              <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>Loading recommended assessments...</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  metricBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: theme.colors.bg,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  metricValPrimary: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  metricValSuccess: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.success,
  },
  metricValDark: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.textMain,
  },
  sectionHeaderSuccess: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.success,
    marginBottom: 6,
  },
  sectionHeaderAmber: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.amber,
    marginBottom: 6,
  },
  badgeWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  attemptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.bg,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  attTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textMain,
  },
  attSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  recommendedCard: {
    backgroundColor: theme.colors.bg,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  durationText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  }
});
