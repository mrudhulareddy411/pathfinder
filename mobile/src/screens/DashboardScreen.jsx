import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import Header from "../components/Header";
import api from "../services/api";

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [resumeData, setResumeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const meRes = await api.get("/auth/me");
      if (meRes.data) setUser(meRes.data);
      try { const perfRes = await api.get("/academic/performance"); if (perfRes.data?.performance) setPerformance(perfRes.data.performance); } catch (e) {}
      try { const resRes = await api.get("/resumes"); if (resRes.data && Array.isArray(resRes.data)) setResumeData(resRes.data); } catch (e) {}
    } catch (err) {
      console.log("Dashboard load error:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadDashboardData(); }, []);
  const onRefresh = () => { setRefreshing(true); loadDashboardData(); };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : "Student";
  const readinessScore = user?.jobReadiness?.score || 0;
  const totalSkills = user?.skills?.length || 0;
  const resumesCount = resumeData ? resumeData.length : 0;

  return (
    <View style={styles.container}>
      <Header user={user} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}>
        
        {/* HERO SECTION */}
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🚀 INTELLIGENT DASHBOARD</Text>
          </View>
          <Text style={styles.heroTitle}>Welcome, {firstName}</Text>
          <Text style={styles.heroSubtitle}>Your personal AI career intelligence hub. Let's build your future.</Text>
          <View style={styles.heroActionRow}>
            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => navigation.navigate("ResumeBuilder")}>
              <Text style={styles.primaryActionText}>📄 Build Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => navigation.navigate("CareerPathfinder")}>
              <Text style={styles.secondaryActionText}>🧭 Pathfinder</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* METRICS GRID */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricBox, { backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }]}>
            <Text style={[styles.metricLabel, { color: "#3b82f6" }]}>Readiness</Text>
            <Text style={[styles.metricValue, { color: "#1e3a8a" }]}>{readinessScore}%</Text>
          </View>
          <View style={[styles.metricBox, { backgroundColor: "#f3e8ff", borderColor: "#e9d5ff" }]}>
            <Text style={[styles.metricLabel, { color: "#8b5cf6" }]}>Skills</Text>
            <Text style={[styles.metricValue, { color: "#4c1d95" }]}>{totalSkills}</Text>
          </View>
          <View style={[styles.metricBox, { backgroundColor: "#fef3c7", borderColor: "#fde68a" }]}>
            <Text style={[styles.metricLabel, { color: "#d97706" }]}>Resumes</Text>
            <Text style={[styles.metricValue, { color: "#78350f" }]}>{resumesCount}</Text>
          </View>
        </View>

        {/* RESUME STUDIO BANNER */}
        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>✨ AI Resume Studio</Text>
          <Text style={styles.promoDesc}>Create stunning, ATS-friendly resumes tailored to your dream jobs.</Text>
          <TouchableOpacity style={styles.promoBtn} onPress={() => navigation.navigate("ResumeDashboard")}>
            <Text style={styles.promoBtnText}>Manage Resumes →</Text>
          </TouchableOpacity>
        </View>

        {/* RECENT PROJECTS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Active Projects</Text>
          {user?.projects && user.projects.length > 0 ? (
            user.projects.slice(0, 2).map((p, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.listTitle}>{p.title}</Text>
                <Text style={styles.listDesc} numberOfLines={1}>{p.description || "No description"}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No active projects added yet.</Text>
          )}
          <TouchableOpacity onPress={() => navigation.navigate("Projects")}>
            <Text style={styles.linkText}>View all projects</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  badge: {
    backgroundColor: "#e0f2fe",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: { color: "#0284c7", fontSize: 10, fontWeight: "bold", letterSpacing: 1 },
  heroTitle: { fontSize: 28, fontWeight: "bold", color: "#0f172a", marginBottom: 8 },
  heroSubtitle: { fontSize: 15, color: "#64748b", marginBottom: 24, lineHeight: 22 },
  heroActionRow: { flexDirection: "row", gap: 12 },
  primaryActionBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryActionText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
  secondaryActionBtn: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0"
  },
  secondaryActionText: { color: "#334155", fontWeight: "bold", fontSize: 14 },
  metricsGrid: { flexDirection: "row", gap: 12, marginBottom: 20 },
  metricBox: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  metricLabel: { fontSize: 12, textTransform: "uppercase", marginBottom: 8, fontWeight: "bold" },
  metricValue: { fontSize: 22, fontWeight: "bold" },
  promoCard: {
    backgroundColor: "#e0f2fe",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  promoTitle: { fontSize: 18, fontWeight: "bold", color: "#0369a1", marginBottom: 8 },
  promoDesc: { fontSize: 14, color: "#0c4a6e", marginBottom: 16, lineHeight: 20 },
  promoBtn: { backgroundColor: "#0284c7", alignSelf: "flex-start", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  promoBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#0f172a", marginBottom: 16 },
  listItem: { backgroundColor: "#f8fafc", padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0" },
  listTitle: { fontSize: 16, fontWeight: "bold", color: "#0f172a", marginBottom: 4 },
  listDesc: { fontSize: 13, color: "#64748b" },
  emptyText: { color: "#94a3b8", fontSize: 14, marginBottom: 12, fontStyle: "italic" },
  linkText: { color: "#2563eb", fontWeight: "bold", fontSize: 14, marginTop: 8 }
});
