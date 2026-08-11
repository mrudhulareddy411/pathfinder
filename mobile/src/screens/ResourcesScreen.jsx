import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  FlatList,
} from "react-native";
import { theme } from "../theme";
import { getResources } from "../services/resourceService";

const CATEGORIES = ["All", "Software Development", "Data Science", "Design & UX", "AI & Machine Learning", "Career Prep"];

export default function ResourcesScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    const data = await getResources(selectedCategory);
    setResources(data || []);
    setLoading(false);
  };

  const handleOpenLink = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error("Could not open link:", err));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Resources</Text>
        <Text style={styles.subtitle}>Curated documentation, courses, and skill roadmaps</Text>
      </View>

      {/* CATEGORY FILTER TABS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catBadge, selectedCategory === cat && styles.catBadgeActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : resources.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No Resources Found</Text>
          <Text style={styles.emptySub}>No resources available for {selectedCategory} at this time.</Text>
        </View>
      ) : (
        <FlatList
          data={resources}
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.tagRow}>
                <Text style={styles.categoryTag}>{item.category || "General"}</Text>
                {item.level && <Text style={styles.levelTag}>{item.level}</Text>}
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>

              <TouchableOpacity
                style={styles.linkBtn}
                onPress={() => handleOpenLink(item.url || item.link)}
              >
                <Text style={styles.linkBtnText}>Open Resource ↗</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 12,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.textMain,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  categoryScroll: {
    maxHeight: 44,
    marginBottom: 16,
  },
  catBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },
  catBadgeActive: {
    backgroundColor: theme.colors.primary,
  },
  catText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  catTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginTop: 40,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.textMain,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: theme.colors.primaryLight,
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelTag: {
    backgroundColor: "#F3F4F6",
    color: "#4B5563",
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textMain,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  linkBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  linkBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
});
