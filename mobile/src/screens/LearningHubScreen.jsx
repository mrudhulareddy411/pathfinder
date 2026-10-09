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

export default function LearningHubScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Resources");
  const [completedItems, setCompletedItems] = useState({});

  const categories = [
    "All Resources",
    "Recommended for You",
    "Programming",
    "Web Development",
    "Data Science",
    "AI/ML",
    "Databases",
    "Career Preparation"
  ];

  const fetchResources = async () => {
    try {
      setLoading(true);
      const meRes = await api.get("/auth/me");
      if (meRes.data) setUser(meRes.data);

      const res = await api.get("/resources");
      if (res.data) setResources(Array.isArray(res.data) ? res.data : res.data.resources || []);
    } catch (err) {
      console.error("Fetch resources error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

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

  const filteredList = (activeCategory === "All Resources" || activeCategory === "Recommended for You")
    ? resources
    : resources.filter((r) => {
        const cat = (r.category || r.skill || "").toLowerCase();
        return cat.includes(activeCategory.toLowerCase()) || activeCategory.toLowerCase().includes(cat);
      });

  return (
    <View style={globalStyles.container}>
      <Header user={user} navigation={navigation} />

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        <View style={globalStyles.card}>
          <View style={[globalStyles.badgeBlue, { alignSelf: "flex-start", marginBottom: 8 }]}>
            <Text style={globalStyles.badgeBlueText}>Learning Hub</Text>
          </View>
          <Text style={[globalStyles.cardTitle, { fontSize: 24 }]}>Learning Resources & Skill Courses</Text>
          <Text style={globalStyles.cardSubtitle}>
            Explore curated learning materials, documentation portals, and interactive courses to bridge your career skill gaps.
          </Text>
        </View>

        {/* CATEGORY FILTER TABS */}
        <View style={{ marginBottom: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={[
                    styles.catPill,
                    isSelected ? styles.catPillSelected : null
                  ]}
                >
                  <Text style={[
                    styles.catPillText,
                    isSelected ? styles.catPillTextSelected : null
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 30 }} />
        ) : (
        ) : (
          filteredList.map((item, idx) => {
            const itemId = item._id || item.url || item.title || idx;
            const isDone = completedActSet.has(String(itemId)) || completedItems[itemId] === "done";
            const isCompleting = completedItems[itemId] === "completing";

            return (
              <View key={itemId} style={globalStyles.card}>
                <View style={styles.resHeader}>
                  <View style={globalStyles.badgeBlue}>
                    <Text style={globalStyles.badgeBlueText}>{item.skill || "General"}</Text>
                  </View>
                  <View style={[globalStyles.badgeAmber, { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" }]}>
                    <Text style={[globalStyles.badgeAmberText, { color: "#4B5563" }]}>{item.difficulty || "Intermediate"}</Text>
                  </View>
                </View>

                <Text style={globalStyles.cardTitle}>{item.title}</Text>
                <Text style={styles.providerText}>Provider: {item.provider || "Official Documentation"}</Text>

                <View style={styles.statusBox}>
                  <View style={styles.statusHeader}>
                    <Text style={styles.statusLabel}>Status</Text>
                    <Text style={styles.statusVal}>{isDone ? "100% Completed" : "In Progress"}</Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: isDone ? "100%" : "35%", backgroundColor: isDone ? "#16A34A" : "#2563EB" }]} />
                  </View>
                </View>

                <View style={{ gap: 8, marginTop: 12 }}>
                  <TouchableOpacity
                    style={globalStyles.btnOutline}
                    onPress={() => alert(`Opening resource: ${item.title}`)}
                  >
                    <Text style={globalStyles.btnOutlineText}>Open Resource ↗</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      globalStyles.btnPrimary,
                      isDone && { backgroundColor: theme.colors.success }
                    ]}
                    onPress={() => handleCompleteActivity(itemId, item.title, item.skill)}
                    disabled={isDone || isCompleting}
                  >
                    {isCompleting ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={globalStyles.btnPrimaryText}>
                        {isDone ? "✓ Completed (+50 XP)" : "Start Learning (+50 XP)"}
                      </Text>
                    )}
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
  resHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  providerText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textMuted,
    marginBottom: 12,
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
  statusBox: {
    marginBottom: 8,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statusLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  statusVal: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textDark,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  }
});
