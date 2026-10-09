import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { theme, globalStyles } from "../theme";
import Header from "../components/Header";
import api from "../services/api";

export default function ProfileScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("view"); // view vs edit
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    educationLevel: "B.Tech",
    branch: "",
    college: "",
    graduationYear: "",
    cgpa: "",
    skills: "",
    github: "",
    linkedin: "",
    portfolio: "",
    selectedCareerTitle: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/me");
      if (res.data) {
        const u = res.data;
        setUser(u);
        setFormData({
          fullName: u.fullName || "",
          email: u.email || "",
          phone: u.phone || "",
          educationLevel: u.educationLevel || "B.Tech",
          branch: u.branch || u.course || "",
          college: u.college || "",
          graduationYear: u.graduationYear ? String(u.graduationYear) : "",
          cgpa: u.cgpa ? String(u.cgpa) : "",
          skills: Array.isArray(u.skills) ? u.skills.join(", ") : u.skills || "",
          github: u.github || u.githubUrl || "",
          linkedin: u.linkedin || u.linkedinUrl || "",
          portfolio: u.portfolio || "",
          selectedCareerTitle: u.selectedCareerDetails?.title || "",
        });
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setStatusMsg("");
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        educationLevel: formData.educationLevel,
        branch: formData.branch,
        college: formData.college,
        graduationYear: formData.graduationYear,
        cgpa: formData.cgpa,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],
        github: formData.github,
        linkedin: formData.linkedin,
        portfolio: formData.portfolio,
      };

      const res = await api.put("/auth/profile", payload);
      if (res.data && res.data.user) {
        setUser(res.data.user);
        setStatusMsg("Profile updated successfully! ✓");
        setTimeout(() => setStatusMsg(""), 3000);
        setActiveTab("view");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      setStatusMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const fullName = user?.fullName || "Student Profile";
  const firstInitial = (fullName.trim()[0] || "S").toUpperCase();
  const rawPhoto = user?.profileImage || user?.profilePhoto || null;
  const userPhoto = rawPhoto
    ? /^https?:\/\//i.test(rawPhoto)
      ? rawPhoto
      : `http://10.248.189.208:5000${rawPhoto.startsWith("/") ? "" : "/"}${rawPhoto}`
    : null;

  return (
    <View style={globalStyles.container}>
      <Header user={user} navigation={navigation} />

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        {/* HEADER BAR & TAB SWITCHER */}
        <View style={globalStyles.card}>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "view" && styles.tabBtnActive]}
              onPress={() => setActiveTab("view")}
            >
              <Text style={[styles.tabBtnText, activeTab === "view" && styles.tabBtnTextActive]}>
                👤 View Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "edit" && styles.tabBtnActive]}
              onPress={() => setActiveTab("edit")}
            >
              <Text style={[styles.tabBtnText, activeTab === "edit" && styles.tabBtnTextActive]}>
                ✏️ Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {statusMsg ? (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{statusMsg}</Text>
          </View>
        ) : null}

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 30 }} />
        ) : activeTab === "view" ? (
          /* VIEW PROFILE MODE */
          <View style={globalStyles.card}>
            <View style={styles.profileHeaderCenter}>
              {userPhoto ? (
                <Image source={{ uri: userPhoto }} style={styles.largeAvatarImg} />
              ) : (
                <View style={styles.largeAvatarFallback}>
                  <Text style={styles.largeAvatarText}>{firstInitial}</Text>
                </View>
              )}
              <Text style={styles.profileName}>{fullName}</Text>
              <Text style={styles.profileRole}>
                {user?.educationLevel || "Degree"} {user?.branch || ""}
              </Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Academic Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>College / Institution:</Text>
                <Text style={styles.infoVal}>{user?.college || "Not provided"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Graduation Year:</Text>
                <Text style={styles.infoVal}>{user?.graduationYear || "Not provided"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>GPA / CGPA:</Text>
                <Text style={styles.infoValPrimary}>{user?.cgpa ? `${user.cgpa}` : "Not provided"}</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Contact & Profiles</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoVal}>{user?.email || "Not provided"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoVal}>{user?.phone || "Not provided"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>GitHub:</Text>
                <Text style={styles.infoVal}>{user?.github || user?.githubUrl || "Not provided"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>LinkedIn:</Text>
                <Text style={styles.infoVal}>{user?.linkedin || user?.linkedinUrl || "Not provided"}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[globalStyles.btnPrimary, { marginTop: 10 }]}
              onPress={() => setActiveTab("edit")}
            >
              <Text style={globalStyles.btnPrimaryText}>Edit Profile Information ➔</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* EDIT PROFILE MODE */
          <View style={globalStyles.card}>
            <Text style={globalStyles.cardTitle}>Edit Student Profile</Text>
            <Text style={globalStyles.cardSubtitle}>
              Update your degree, college, GPA, and contact details stored in MongoDB Atlas.
            </Text>

            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.fullName}
              onChangeText={(val) => handleChange("fullName", val)}
            />

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={[globalStyles.input, { backgroundColor: "#F1F5F9" }]}
              editable={false}
              value={formData.email}
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(val) => handleChange("phone", val)}
            />

            <Text style={styles.inputLabel}>Degree / Education Level</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="e.g. B.Tech / B.E."
              value={formData.educationLevel}
              onChangeText={(val) => handleChange("educationLevel", val)}
            />

            <Text style={styles.inputLabel}>Branch / Major Stream</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="e.g. Computer Science & Engineering"
              value={formData.branch}
              onChangeText={(val) => handleChange("branch", val)}
            />

            <Text style={styles.inputLabel}>College / University</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="e.g. Saveetha Institute of Tech"
              value={formData.college}
              onChangeText={(val) => handleChange("college", val)}
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Grad Year</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="2027"
                  keyboardType="numeric"
                  value={formData.graduationYear}
                  onChangeText={(val) => handleChange("graduationYear", val)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>GPA / CGPA</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="8.6"
                  keyboardType="numeric"
                  value={formData.cgpa}
                  onChangeText={(val) => handleChange("cgpa", val)}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Technical Skills (comma-separated)</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Python, Java, SQL, React"
              value={formData.skills}
              onChangeText={(val) => handleChange("skills", val)}
            />

            <Text style={styles.inputLabel}>GitHub Profile URL</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="https://github.com/username"
              autoCapitalize="none"
              value={formData.github}
              onChangeText={(val) => handleChange("github", val)}
            />

            <Text style={styles.inputLabel}>LinkedIn Profile URL</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="https://linkedin.com/in/username"
              autoCapitalize="none"
              value={formData.linkedin}
              onChangeText={(val) => handleChange("linkedin", val)}
            />

            <TouchableOpacity
              style={[globalStyles.btnPrimary, { marginTop: 10 }]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={globalStyles.btnPrimaryText}>✓ Save Profile Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.bg,
    alignItems: "center",
  },
  tabBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textDark,
  },
  tabBtnTextActive: {
    color: "#FFFFFF",
  },
  statusBox: {
    backgroundColor: theme.colors.successBg,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.successBorder,
  },
  statusText: {
    color: theme.colors.success,
    fontSize: 13,
    fontWeight: "700",
  },
  profileHeaderCenter: {
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 16,
  },
  largeAvatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    marginBottom: 10,
  },
  largeAvatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  largeAvatarText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.textMain,
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  infoSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textMain,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textDark,
  },
  infoValPrimary: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textDark,
    marginBottom: 4,
  },
});
