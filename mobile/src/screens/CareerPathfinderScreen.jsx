import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { theme, globalStyles } from "../theme";
import Header from "../components/Header";
import api from "../services/api";

export default function CareerPathfinderScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const meRes = await api.get("/auth/me");
      if (meRes.data) setUser(meRes.data);

      const recRes = await api.get("/recommendations");
      if (recRes.data?.recommendations) {
        setRecommendations(recRes.data.recommendations);
      }
    } catch (err) {
      console.error("Fetch recommendations error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleSelectTargetCareer = async (careerTitle) => {
    try {
      await api.put("/auth/profile", {
        selectedCareer: careerTitle,
      });
      alert(`🎯 ${careerTitle} selected as your active target career!`);
      fetchRecommendations();
    } catch (e) {
      alert("Error setting target career.");
    }
  };

  const filteredRecs = recommendations.filter((rec) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      rec.title?.toLowerCase().includes(q) ||
      rec.description?.toLowerCase().includes(q) ||
      rec.matchingSkills?.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <View style={globalStyles.container}>
      <Header user={user} navigation={navigation} />

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        {/* HEADER BANNER */}
        <View style={globalStyles.card}>
          <View style={globalStyles.badgeBlue}>
            <Text style={globalStyles.badgeBlueText}>Career Recommendation Engine</Text>
          </View>
          <Text style={globalStyles.cardTitle}>Career Pathfinder 🎯</Text>
          <Text style={globalStyles.cardSubtitle}>
            AI & Random Forest O*NET recommendations calculated from your GPA, test scores, skills, and target goal.
          </Text>

          <TextInput
            style={globalStyles.input}
            placeholder="🔍 Search career titles or required skills..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* CAREER RECOMMENDATIONS CARDS */}
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 30 }} />
        ) : (
          filteredRecs.map((rec, idx) => {
            const isSelected = user?.selectedCareerDetails?.title === rec.title;
            const matches = rec.matchingSkills || ["Python", "SQL"];
            const needs = rec.missingSkills || ["Docker", "PyTorch"];

            return (
              <View key={rec._id || idx} style={globalStyles.card}>
                <View style={styles.recHeader}>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <View style={globalStyles.badgeGreen}>
                    <Text style={globalStyles.badgeGreenText}>{rec.matchPercentage}% Match</Text>
                  </View>
                </View>

                <Text style={styles.recDesc}>{rec.description}</Text>

                {/* MATCH REASONS EXPLANATION */}
                {rec.reasons && rec.reasons.length > 0 ? (
                  <View style={styles.reasonsBox}>
                    <Text style={styles.reasonsTitle}>Reasons for Match:</Text>
                    {rec.reasons.map((r, i) => (
                      <Text key={i} style={styles.reasonItem}>
                        • {r}
                      </Text>
                    ))}
                  </View>
                ) : null}

                {/* STRENGTHS */}
                <View style={styles.skillsSection}>
                  <Text style={styles.skillsLabelSuccess}>Your Strengths:</Text>
                  <View style={styles.badgeWrap}>
                    {matches.map((s, i) => (
                      <View key={i} style={globalStyles.badgeGreen}>
                        <Text style={globalStyles.badgeGreenText}>{s}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* SKILLS TO DEVELOP */}
                <View style={styles.skillsSection}>
                  <Text style={styles.skillsLabelAmber}>Skills to Develop:</Text>
                  <View style={styles.badgeWrap}>
                    {needs.map((s, i) => (
                      <View key={i} style={globalStyles.badgeAmber}>
                        <Text style={globalStyles.badgeAmberText}>{s}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                  <TouchableOpacity
                    style={[
                      isSelected ? globalStyles.badgeGreen : globalStyles.btnPrimary,
                      { flex: 1, alignItems: "center" },
                    ]}
                    onPress={() => handleSelectTargetCareer(rec.title)}
                  >
                    <Text
                      style={
                        isSelected ? globalStyles.badgeGreenText : globalStyles.btnPrimaryText
                      }
                    >
                      {isSelected ? "✓ Target Career" : "🎯 Select Target"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[globalStyles.btnOutline, { flex: 1, alignItems: "center" }]}
                    onPress={() =>
                      navigation.navigate("CareerDetails", {
                        onetCode: rec.onetCode || "15-1252.00",
                      })
                    }
                  >
                    <Text style={globalStyles.btnOutlineText}>📖 Roadmap ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  recHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textMain,
    flex: 1,
    marginRight: 8,
  },
  recDesc: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 18,
    marginBottom: 10,
  },
  reasonsBox: {
    backgroundColor: theme.colors.bg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reasonsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textMain,
    marginBottom: 4,
  },
  reasonItem: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  skillsSection: {
    marginBottom: 8,
  },
  skillsLabelSuccess: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.success,
    marginBottom: 4,
  },
  skillsLabelAmber: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.amber,
    marginBottom: 4,
  },
  badgeWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
});
