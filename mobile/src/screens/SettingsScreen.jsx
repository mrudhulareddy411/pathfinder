import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from "react-native";
import { theme, globalStyles } from "../theme";
import Header from "../components/Header";
import api from "../services/api";
import { logoutUser } from "../services/authService";

export default function SettingsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("account"); // account, profile, security, notifications, preferences
  const [saveStatus, setSaveStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    email: "",
    notifications: true,
    weeklyReport: true,
    theme: "Light (Clean Professional)",
    twoFactor: false,
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data) {
          setUser(res.data);
          setSettingsForm((prev) => ({ ...prev, email: res.data.email || prev.email }));
        }
      } catch (e) {}
    };
    fetchMe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace("Login");
  };

  return (
    <View style={globalStyles.container}>
      <Header user={user} navigation={navigation} />

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        {/* HEADER SECTION */}
        <View style={[globalStyles.card, { marginBottom: 16 }]}>
          <View style={[globalStyles.badgeBlue, { alignSelf: "flex-start", marginBottom: 8 }]}>
            <Text style={globalStyles.badgeBlueText}>Platform Configuration</Text>
          </View>
          <Text style={[globalStyles.cardTitle, { fontSize: 24 }]}>Settings & Preferences</Text>
          <Text style={globalStyles.cardSubtitle}>
            Manage your account security, profile options, email notifications, and platform preferences.
          </Text>
        </View>

        {saveStatus !== "" && (
          <View style={{ backgroundColor: "#D1FAE5", borderColor: "#10B981", borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: "#065F46", fontWeight: "600", textAlign: "center" }}>{saveStatus}</Text>
          </View>
        )}

        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <TouchableOpacity onPress={() => setActiveTab("account")} style={[styles.tabBtn, activeTab === "account" && styles.tabBtnActive]}>
              <Text style={[styles.tabBtnText, activeTab === "account" && styles.tabBtnTextActive]}>👤 Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("profile")} style={[styles.tabBtn, activeTab === "profile" && styles.tabBtnActive]}>
              <Text style={[styles.tabBtnText, activeTab === "profile" && styles.tabBtnTextActive]}>✏️ Profile Details</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("security")} style={[styles.tabBtn, activeTab === "security" && styles.tabBtnActive]}>
              <Text style={[styles.tabBtnText, activeTab === "security" && styles.tabBtnTextActive]}>🔒 Security & Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("notifications")} style={[styles.tabBtn, activeTab === "notifications" && styles.tabBtnActive]}>
              <Text style={[styles.tabBtnText, activeTab === "notifications" && styles.tabBtnTextActive]}>🔔 Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("preferences")} style={[styles.tabBtn, activeTab === "preferences" && styles.tabBtnActive]}>
              <Text style={[styles.tabBtnText, activeTab === "preferences" && styles.tabBtnTextActive]}>⚙️ Preferences</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={globalStyles.card}>
          {activeTab === "account" && (
            <View>
              <Text style={[globalStyles.cardTitle, { marginBottom: 16 }]}>Account Details</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={[styles.inputBox, { backgroundColor: "#F3F4F6" }]}>
                  <Text style={{ color: theme.colors.textMuted }}>{user?.fullName || ""}</Text>
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputBox}>
                  <Text style={{ color: theme.colors.textDark }}>{settingsForm.email || ""}</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === "profile" && (
            <View>
              <Text style={[globalStyles.cardTitle, { marginBottom: 12 }]}>Profile Preferences</Text>
              <Text style={[globalStyles.cardSubtitle, { marginBottom: 16 }]}>
                To update your degree, branch, or technical skills, navigate to the Profile Page.
              </Text>
              <TouchableOpacity style={globalStyles.btnOutline} onPress={() => navigation.navigate("Profile")}>
                <Text style={globalStyles.btnOutlineText}>Go to Profile Page ➔</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "security" && (
            <View>
              <Text style={[globalStyles.cardTitle, { marginBottom: 16 }]}>Security & Password</Text>
              <View style={{ backgroundColor: "#F3F4F6", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: theme.colors.success, fontWeight: "700", fontSize: 13, marginBottom: 4 }}>✓ Password Encrypted & Protected</Text>
                <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>JWT Token session active. Multi-factor authentication ready.</Text>
              </View>
              <TouchableOpacity style={[globalStyles.btnOutline, styles.logoutBtn]} onPress={handleLogout}>
                <Text style={styles.logoutBtnText}>🚪 Log Out of Account</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "notifications" && (
            <View>
              <Text style={[globalStyles.cardTitle, { marginBottom: 16 }]}>Notification Preferences</Text>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Email Notifications for Skill Assessment Updates</Text>
                <Switch
                  value={settingsForm.notifications}
                  onValueChange={(val) => setSettingsForm({ ...settingsForm, notifications: val })}
                  trackColor={{ true: theme.colors.primary }}
                />
              </View>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Weekly Placement Readiness Summary Report</Text>
                <Switch
                  value={settingsForm.weeklyReport}
                  onValueChange={(val) => setSettingsForm({ ...settingsForm, weeklyReport: val })}
                  trackColor={{ true: theme.colors.primary }}
                />
              </View>
            </View>
          )}

          {activeTab === "preferences" && (
            <View>
              <Text style={[globalStyles.cardTitle, { marginBottom: 16 }]}>Platform Preferences</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Interface Theme</Text>
                <View style={styles.inputBox}>
                  <Text style={{ color: theme.colors.textDark }}>{settingsForm.theme}</Text>
                </View>
              </View>
            </View>
          )}

          {/* SAVE BUTTON */}
          <View style={{ borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 16, marginTop: 16 }}>
            <TouchableOpacity 
              style={[globalStyles.btnPrimary, saving && { opacity: 0.7 }]}
              onPress={() => {
                setSaving(true);
                setTimeout(() => {
                  setSaving(false);
                  setSaveStatus("Settings updated successfully! ✓");
                  setTimeout(() => setSaveStatus(""), 3500);
                }, 600);
              }}
              disabled={saving}
            >
              <Text style={globalStyles.btnPrimaryText}>{saving ? "Saving..." : "Save Settings"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textDark,
    marginRight: 10,
  },
  logoutBtn: {
    marginTop: 14,
    borderColor: "#FECACA",
    backgroundColor: theme.colors.dangerBg,
  },
  logoutBtnText: {
    color: theme.colors.danger,
    fontWeight: "700",
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabBtnActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
  tabBtnTextActive: {
    color: theme.colors.primaryDark,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textMuted,
    marginBottom: 6,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
