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
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data) setUser(res.data);
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
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>Account Settings ⚙️</Text>
          <Text style={globalStyles.cardSubtitle}>
            Manage your account preferences, notifications, and security.
          </Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: theme.colors.primary }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Email Career Alerts</Text>
            <Switch
              value={emailAlerts}
              onValueChange={setEmailAlerts}
              trackColor={{ true: theme.colors.primary }}
            />
          </View>
        </View>

        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>Platform Info</Text>
          <Text style={styles.infoText}>Version: Pathfinder AI Mobile v1.0.0</Text>
          <Text style={styles.infoText}>Environment: Production / MongoDB Atlas</Text>
          <Text style={styles.infoText}>Architecture: React Native + Express API</Text>

          <TouchableOpacity
            style={[globalStyles.btnOutline, styles.logoutBtn]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutBtnText}>🚪 Log Out of Account</Text>
          </TouchableOpacity>
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
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textDark,
  },
  infoText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 6,
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
});
