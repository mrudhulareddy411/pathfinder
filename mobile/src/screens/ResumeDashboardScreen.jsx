import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { theme } from "../theme";
import { getResumes, deleteResume } from "../services/resumeService";

export default function ResumeDashboardScreen({ navigation }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    const data = await getResumes();
    setResumes(data || []);
    setLoading(false);
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Resume", "Are you sure you want to delete this resume?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteResume(id);
          loadResumes();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Resume Builder</Text>
          <Text style={styles.subtitle}>Create & manage ATS-optimized resumes</Text>
        </View>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate("ResumeBuilder")}
        >
          <Text style={styles.createBtnText}>+ New Resume</Text>
        </TouchableOpacity>
      </View>

      {resumes.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyTitle}>No Resumes Found</Text>
          <Text style={styles.emptySub}>
            Build your first AI-tailored resume to highlight your skills and career targets.
          </Text>
          <TouchableOpacity
            style={[styles.createBtn, { marginTop: 16 }]}
            onPress={() => navigation.navigate("ResumeBuilder")}
          >
            <Text style={styles.createBtnText}>Create Resume Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={resumes}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.resumeCard}>
              <View style={styles.resumeInfo}>
                <Text style={styles.resumeTitle}>{item.title || "Untitled Resume"}</Text>
                <Text style={styles.resumeTarget}>
                  Target Role: {item.targetRole || item.personalInfo?.targetRole || "General"}
                </Text>
                <Text style={styles.resumeDate}>
                  Template: {item.template || "Modern"}
                </Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => navigation.navigate("ResumeBuilder", { resumeId: item._id })}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item._id)}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  createBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
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
  resumeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  resumeInfo: {
    flex: 1,
  },
  resumeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textMain,
    marginBottom: 2,
  },
  resumeTarget: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: "600",
    marginBottom: 2,
  },
  resumeDate: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  editBtn: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtnText: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 12,
  },
  deleteBtn: {
    backgroundColor: theme.colors.dangerBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: theme.colors.danger,
    fontWeight: "700",
    fontSize: 12,
  },
});
