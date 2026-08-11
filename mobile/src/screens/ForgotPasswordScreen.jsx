import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { theme } from "../theme";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Required", "Please enter your email address.");
      return;
    }
    setLoading(true);
    setMessage(null);
    const res = await forgotPassword(email);
    setLoading(false);
    if (res.success) {
      setMessage("Reset instructions have been sent to your email.");
    } else {
      Alert.alert("Error", res.message || "Failed to send reset email.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your registered email address below and we'll send you instructions to reset your password.
        </Text>

        {message && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>{message}</Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="student@university.edu"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backBtnText}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.textMain,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  successBanner: {
    backgroundColor: "#D1FAE5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: "#065F46",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textMain,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#FAFAFA",
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  backBtn: {
    marginTop: 20,
    alignItems: "center",
  },
  backBtnText: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
});
