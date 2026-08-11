import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { theme, globalStyles } from "../theme";
import Header from "../components/Header";
import api from "../services/api";

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const meRes = await api.get("/auth/me");
      if (meRes.data) setUser(meRes.data);

      try {
        const perfRes = await api.get("/academic/performance");
        if (perfRes.data?.performance) setPerformance(perfRes.data.performance);
      } catch (e) {}

      try {
        const recRes = await api.get("/recommendations");
        if (recRes.data?.recommendations) setRecommendations(recRes.data.recommendations);
      } catch (e) {}
    } catch (err) {
      console.log("Dashboard load info:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const fullName = user?.fullName || "Student";
  const gpa = user?.cgpa || performance?.gpa || "Not provided";
  const completedCount = performance?.assessmentsCompletedCount || 0;
  const avgScore = performance?.averageScore || "No assessments yet";
  const topSkill = performance?.topSkill || "No test data yet";
  const targetRole = user?.selectedCareerDetails?.title || recommendations[0]?.title || "Software Developer";

  return (
    <View style={globalStyles.container}>
      <Header user={user} navigation={navigation} />

      <ScrollView
        contentContainerStyle={globalStyles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* HEADER GREETING BANNER */}
        <View style={globalStyles.card}>
          <Text style={styles.badgeText}>STUDENT CAREER COMMAND CENTER</Text>
          <Text style={globalStyles.cardTitle}>Good day, {fullName}</Text>
          <Text style={styles.degreeSub}>
            {user?.educationLevel || "Degree"} {user?.branch || ""} {user?.college ? `• ${user.college}` : ""}
          </Text>

          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={globalStyles.btnOutline}
              onPress={() => navigation.navigate("Profile")}
            >
              <Text style={globalStyles.btnOutlineText}>✏️ Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.btnPrimary}
              onPress={() => navigation.navigate("ResumeBuilder")}
            >
              <Text style={globalStyles.btnPrimaryText}>📄 Build Resume</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ACADEMIC & ASSESSMENT SUMMARY WIDGET */}
        <View style={globalStyles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={globalStyles.cardTitle}>Academic & Assessment</Text>
              <Text style={globalStyles.cardSubtitle}>Direct GPA & test scores</Text>
            </View>
            <TouchableOpacity
              style={globalStyles.badgeBlue}
              onPress={() => navigation.navigate("Assessment")}
            >
              <Text style={globalStyles.badgeBlueText}>⚡ Test</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>GPA / CGPA</Text>
              <Text style={styles.metricValPrimary}>{gpa}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>AVG TEST SCORE</Text>
              <Text style={styles.metricValSuccess}>{avgScore}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>COMPLETED</Text>
              <Text style={styles.metricValDark}>{completedCount}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>TOP SKILL</Text>
              <Text style={styles.metricValDark} numberOfLines={1}>
                {topSkill}
              </Text>
            </View>
          </View>
        </View>

        {/* CAREER OVERVIEW */}
        <View style={globalStyles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={globalStyles.cardTitle}>Career Overview</Text>
            <View style={globalStyles.badgeBlue}>
              <Text style={globalStyles.badgeBlueText}>Target Role</Text>
            </View>
          </View>

          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.metricLabel}>Target Career</Text>
              <Text style={styles.overviewVal}>{targetRole}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.metricLabel}>Career Match</Text>
              <Text style={styles.metricValPrimary}>
                {recommendations[0]?.matchPercentage || 92}%
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.metricLabel}>Job Readiness</Text>
              <Text style={styles.metricValSuccess}>85%</Text>
            </View>
          </View>
        </View>

        {/* TOP CAREER RECOMMENDATIONS */}
        <View style={globalStyles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={globalStyles.cardTitle}>Recommended Career Paths</Text>
            <TouchableOpacity onPress={() => navigation.navigate("CareerPathfinder")}>
              <Text style={styles.linkText}>Explore All ➔</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            recommendations.slice(0, 3).map((rec, idx) => (
              <View key={rec._id || idx} style={styles.recCard}>
                <View style={styles.recHeader}>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <View style={globalStyles.badgeGreen}>
                    <Text style={globalStyles.badgeGreenText}>{rec.matchPercentage}% Match</Text>
                  </View>
                </View>
                <Text style={styles.recDesc}>{rec.description}</Text>
                <TouchableOpacity
                  style={[globalStyles.btnOutline, { marginTop: 8 }]}
                  onPress={() => navigation.navigate("CareerPathfinder")}
                >
                  <Text style={globalStyles.btnOutlineText}>View Career Path ➔</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  degreeSub: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 14,
  },
  ctaRow: {
    flexDirection: "row",
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
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
  overviewGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.bg,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  overviewItem: {
    alignItems: "center",
  },
  overviewVal: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textMain,
  },
  recCard: {
    backgroundColor: theme.colors.bg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  recTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textMain,
  },
  recDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.primary,
  },
});
