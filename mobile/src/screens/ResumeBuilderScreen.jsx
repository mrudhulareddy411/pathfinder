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

export default function ResumeBuilderScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("personal"); // personal, summary, education, skills, projects
  const [resumeData, setResumeData] = useState({
    fullName: "",
    email: "",
    phone: "",
    degree: "",
    college: "",
    summary: "",
    skills: "",
    projects: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data) {
          const u = res.data;
          setUser(u);
          setResumeData({
            fullName: u.fullName || "",
            email: u.email || "",
            phone: u.phone || "+91 98765 43210",
            degree: `${u.educationLevel || "B.Tech"} ${u.branch || "CSE"}`,
            college: u.college || "Saveetha Institute of Tech",
            summary: `Motivated student at ${u.college || "institution"} targeting software engineering roles.`,
            skills: Array.isArray(u.skills) ? u.skills.join(", ") : "JavaScript, React, Node.js, Python, SQL",
            projects: "Pathfinder AI Platform - Full stack career guidance application.",
          });
        }
      } catch (e) {}
    };
    fetchMe();
  }, []);

  const handleSaveResume = async () => {
    try {
      setSaving(true);
      await api.post("/resumes", {
        title: `${resumeData.fullName} - ATS Resume`,
        template: "CLASSIC",
        resumeData,
      });
      setSaveStatus("Resume saved successfully! 🎉");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (e) {
      setSaveStatus("Failed to save resume to cloud.");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header user={user} navigation={navigation} />

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        <View style={globalStyles.card}>
          <View style={globalStyles.badgeBlue}>
            <Text style={globalStyles.badgeBlueText}>ATS Resume Studio</Text>
          </View>
          <Text style={globalStyles.cardTitle}>Resume Builder 📄</Text>
          <Text style={globalStyles.cardSubtitle}>
            Build your ATS-optimized resume sharing profile data directly from MongoDB Atlas.
          </Text>
        </View>

        {saveStatus ? (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{saveStatus}</Text>
          </View>
        ) : null}

        {/* SECTION NAVIGATION TABS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {["personal", "summary", "education", "skills", "projects"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.navTab,
                  activeTab === tab && styles.navTabActive,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.navTabText,
                    activeTab === tab && styles.navTabTextActive,
                  ]}
                >
                  {tab.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* EDIT SECTION FORM */}
        <View style={globalStyles.card}>
          {activeTab === "personal" && (
            <View>
              <Text style={styles.sectionHeader}>Personal Information</Text>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={globalStyles.input}
                value={resumeData.fullName}
                onChangeText={(val) => setResumeData({ ...resumeData, fullName: val })}
              />
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={globalStyles.input}
                value={resumeData.email}
                onChangeText={(val) => setResumeData({ ...resumeData, email: val })}
              />
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={globalStyles.input}
                value={resumeData.phone}
                onChangeText={(val) => setResumeData({ ...resumeData, phone: val })}
              />
            </View>
          )}

          {activeTab === "summary" && (
            <View>
              <Text style={styles.sectionHeader}>Professional Summary</Text>
              <TextInput
                style={[globalStyles.input, { height: 90 }]}
                multiline
                value={resumeData.summary}
                onChangeText={(val) => setResumeData({ ...resumeData, summary: val })}
              />
            </View>
          )}

          {activeTab === "education" && (
            <View>
              <Text style={styles.sectionHeader}>Education Details</Text>
              <Text style={styles.inputLabel}>Degree & Major</Text>
              <TextInput
                style={globalStyles.input}
                value={resumeData.degree}
                onChangeText={(val) => setResumeData({ ...resumeData, degree: val })}
              />
              <Text style={styles.inputLabel}>College / University</Text>
              <TextInput
                style={globalStyles.input}
                value={resumeData.college}
                onChangeText={(val) => setResumeData({ ...resumeData, college: val })}
              />
            </View>
          )}

          {activeTab === "skills" && (
            <View>
              <Text style={styles.sectionHeader}>Technical Skills</Text>
              <TextInput
                style={globalStyles.input}
                value={resumeData.skills}
                onChangeText={(val) => setResumeData({ ...resumeData, skills: val })}
              />
            </View>
          )}

          {activeTab === "projects" && (
            <View>
              <Text style={styles.sectionHeader}>Projects</Text>
              <TextInput
                style={[globalStyles.input, { height: 80 }]}
                multiline
                value={resumeData.projects}
                onChangeText={(val) => setResumeData({ ...resumeData, projects: val })}
              />
            </View>
          )}

          <TouchableOpacity
            style={[globalStyles.btnPrimary, { marginTop: 10 }]}
            onPress={handleSaveResume}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={globalStyles.btnPrimaryText}>💾 Save Resume to Account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ATS LIVE PREVIEW CARD */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>ATS Resume Live Preview</Text>
          <View style={styles.previewBox}>
            <Text style={styles.prevName}>{resumeData.fullName}</Text>
            <Text style={styles.prevContact}>
              {resumeData.email} | {resumeData.phone}
            </Text>
            <Text style={styles.prevSectionTitle}>SUMMARY</Text>
            <Text style={styles.prevText}>{resumeData.summary}</Text>
            <Text style={styles.prevSectionTitle}>EDUCATION</Text>
            <Text style={styles.prevBold}>{resumeData.degree}</Text>
            <Text style={styles.prevText}>{resumeData.college}</Text>
            <Text style={styles.prevSectionTitle}>TECHNICAL SKILLS</Text>
            <Text style={styles.prevText}>{resumeData.skills}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBox: {
    backgroundColor: theme.colors.successBg,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.successBorder,
  },
  statusText: {
    color: theme.colors.success,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  navTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.grayBg,
  },
  navTabActive: {
    backgroundColor: theme.colors.primary,
  },
  navTabText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textMuted,
  },
  navTabTextActive: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textMain,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  previewBox: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 8,
  },
  prevName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
  },
  prevContact: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 10,
  },
  prevSectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2563EB",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 2,
    marginTop: 8,
    marginBottom: 4,
  },
  prevText: {
    fontSize: 12,
    color: "#334155",
    lineHeight: 16,
  },
  prevBold: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
});
