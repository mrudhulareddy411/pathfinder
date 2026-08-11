import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { theme, globalStyles } from "../theme";
import { loginUser } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("mrudhula@saveetha.ac.in");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const result = await loginUser(email, password);
      if (result.success) {
        navigation.replace("MainDrawer");
      } else {
        setErrorMsg(result.message || "Invalid credentials.");
      }
    } catch (err) {
      setErrorMsg("Error signing in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <Text style={styles.appTitle}>Pathfinder AI</Text>
          <Text style={styles.appSubtitle}>
            AI-Powered Student Career Intelligence Platform
          </Text>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.cardHeader}>Sign In to Your Account</Text>
          <Text style={styles.cardDesc}>
            Access your career match analytics, skill evaluation tests, and job readiness profile.
          </Text>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="e.g. student@college.edu"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Enter password"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={globalStyles.btnPrimary}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={globalStyles.btnPrimaryText}>Sign In ➔</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.linkText}>Create Free Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    justifyContent: "center",
    minHeight: "100%",
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.textMain,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textMain,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  errorBox: {
    backgroundColor: theme.colors.dangerBg,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.primary,
  },
});
