import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { theme } from "../theme";
import { getCareerByOnet, setTargetCareer } from "../services/careerService";
import { getStoredUser } from "../services/authService";
import api from "../services/api";

export default function CareerDetailsScreen({ route, navigation }) {
  const { onetCode } = route.params || {};
  const [career, setCareer] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    loadData();
  }, [onetCode]);

  const loadData = async () => {
    setLoading(true);
    const u = await getStoredUser();
    setUser(u);
    if (onetCode) {
      const data = await getCareerByOnet(onetCode);
      setCareer(data);
    }
    setLoading(false);
  };

  const handleSelectTarget = async () => {
    if (!career) return;
    try {
      const res = await setTargetCareer({
        onetCode: career.onetCode || onetCode,
        title: career.title,
      });
      setActionMsg(`Selected '${career.title}' as your target career path! 🎯`);
      setTimeout(() => setActionMsg(""), 3500);
    } catch (err) {
      Alert.alert("Error", "Could not set target career.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading career details & roadmap...</Text>
      </View>
    );
  }

  if (!career) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Career details not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userSkills = (user?.skills || ["JavaScript", "React", "Python", "SQL"]).map((s) => String(s).toLowerCase());
  const requiredSkills = career.requiredSkills || ["Python", "Data Structures", "SQL", "Git"];
  const strongSkills = requiredSkills.filter((s) => userSkills.includes(s.toLowerCase()));
  const missingSkills = requiredSkills.filter((s) => !userSkills.includes(s.toLowerCase()));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {actionMsg !== "" && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{actionMsg}</Text>
        </View>
      )}

      {/* HEADER CARD */}
      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <Text style={styles.onetBadge}>O*NET {career.onetCode || onetCode}</Text>
          {career.inDemand && <Text style={styles.demandBadge}>🔥 In Demand</Text>}
        </View>
        <Text style={styles.title}>{career.title}</Text>
        <Text style={styles.desc}>{career.description}</Text>

        <TouchableOpacity style={styles.targetBtn} onPress={handleSelectTarget}>
          <Text style={styles.targetBtnText}>🎯 Select as Target Career Path</Text>
        </TouchableOpacity>
      </View>

      {/* SALARY & SPECS */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Average Salary Potential</Text>
        <Text style={styles.salaryText}>
          {typeof career.salaryRange === "object"
            ? `₹${career.salaryRange.minLPA || 6}L - ₹${career.salaryRange.maxLPA || 24}L`
            : career.salaryRange || "₹6.0 LPA - ₹24.0 LPA"}
        </Text>
        <Text style={styles.subText}>Verified Entry & Senior Band</Text>
      </View>

      {/* SKILLS GAP MATRIX */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>⚡ Skills Gap Analysis</Text>

        <Text style={styles.sectionSubHeader}>✓ Strong Skills Matched:</Text>
        <View style={styles.tagWrap}>
          {strongSkills.length > 0 ? (
            strongSkills.map((s) => (
              <View key={s} style={styles.strongTag}>
                <Text style={styles.strongTagText}>✓ {s}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noneText}>No exact matches recorded.</Text>
          )}
        </View>

        <Text style={[styles.sectionSubHeader, { marginTop: 12 }]}>⚠ Missing & Developing Skills:</Text>
        <View style={styles.missingWrap}>
          {missingSkills.length > 0 ? (
            missingSkills.map((s) => (
              <View key={s} style={styles.missingRow}>
                <Text style={styles.missingText}>• {s}</Text>
                <TouchableOpacity
                  style={styles.learnBtn}
                  onPress={() => navigation.navigate("MainDrawer", { screen: "LearningHub" })}
                >
                  <Text style={styles.learnBtnText}>Learn ↗</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.successText}>🎉 You possess all required core skills!</Text>
          )}
        </View>
      </View>

      {/* ROADMAP */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>🗺️ Career progression Roadmap</Text>
        {(career.roadmap || []).map((lvl) => (
          <View key={lvl.level} style={styles.roadmapStep}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>{lvl.level}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{lvl.title}</Text>
              <Text style={styles.stepDesc}>{lvl.desc}</Text>
              <View style={styles.tagWrap}>
                {(lvl.topics || []).map((t) => (
                  <View key={t} style={styles.topicTag}>
                    <Text style={styles.topicTagText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.danger,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  banner: {
    backgroundColor: "#D1FAE5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  bannerText: {
    color: "#065F46",
    fontWeight: "700",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  onetBadge: {
    backgroundColor: "#1E293B",
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  demandBadge: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.textMain,
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    color: theme.colors.textMuted,
    lineHeight: 20,
    marginBottom: 14,
  },
  targetBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  targetBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  cardHeader: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.textMain,
    marginBottom: 8,
  },
  salaryText: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.primary,
    marginVertical: 4,
  },
  subText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  sectionSubHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textMain,
    marginBottom: 6,
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  strongTag: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  strongTagText: {
    color: "#065F46",
    fontSize: 12,
    fontWeight: "700",
  },
  noneText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  missingWrap: {
    gap: 8,
  },
  missingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 8,
  },
  missingText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textMain,
  },
  learnBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  learnBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  successText: {
    color: "#065F46",
    fontSize: 13,
    fontWeight: "600",
  },
  roadmapStep: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  stepBadgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textMain,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 6,
  },
  topicTag: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  topicTagText: {
    fontSize: 10,
    color: "#374151",
  },
});
