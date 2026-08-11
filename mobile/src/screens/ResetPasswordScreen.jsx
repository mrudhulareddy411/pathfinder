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
import { resetPassword } from "../services/authService";

export default function ResetPasswordScreen({ route, navigation }) {
  const token = route.params?.token || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Required", "Please fill in all password fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await resetPassword(token, password);
    setLoading(false);
    if (res.success) {
      Alert.alert("Success", "Password updated successfully!", [
        { text: "Log In", onPress: () => navigation.navigate("Login") },
      ]);
    } else {
      Alert.alert("Error", res.message || "Failed to reset password.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter a new password for your account below.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Update Password</Text>
          )}
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
  },
  inputGroup: {
    marginBottom: 16,
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
    marginTop: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
