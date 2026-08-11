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
import { registerUser } from "../services/authService";

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    educationLevel: "B.Tech",
    branch: "Computer Science & Engineering",
    college: "Saveetha Institute of Tech",
    graduationYear: "2027",
    cgpa: "8.6",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleRegister = async () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      setErrorMsg("Full name, email, and password are required.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const result = await registerUser(formData);
      if (result.success) {
        navigation.replace("MainDrawer");
      } else {
        setErrorMsg(result.message || "Registration failed.");
      }
    } catch (err) {
      setErrorMsg("Error creating account.");
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
          <Text style={styles.appTitle}>Join Pathfinder AI 🚀</Text>
          <Text style={styles.appSubtitle}>
            Create your student account to build your career path & evaluate your skills.
          </Text>
        </View>

        <View style={globalStyles.card}>
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="e.g. Kondreddy Mrudhula"
            placeholderTextColor="#94A3B8"
            value={formData.fullName}
            onChangeText={(val) => handleChange("fullName", val)}
          />

          <Text style={styles.inputLabel}>Email Address *</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="e.g. student@college.edu"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(val) => handleChange("email", val)}
          />

          <Text style={styles.inputLabel}>Password *</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Minimum 6 characters"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={formData.password}
            onChangeText={(val) => handleChange("password", val)}
          />

          <Text style={styles.inputLabel}>Degree / Education Level</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="e.g. B.Tech / B.E."
            placeholderTextColor="#94A3B8"
            value={formData.educationLevel}
            onChangeText={(val) => handleChange("educationLevel", val)}
          />

          <Text style={styles.inputLabel}>Branch / Stream</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="e.g. Computer Science & Engineering"
            placeholderTextColor="#94A3B8"
            value={formData.branch}
            onChangeText={(val) => handleChange("branch", val)}
          />

          <Text style={styles.inputLabel}>College / Institution</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="e.g. Saveetha Institute of Tech"
            placeholderTextColor="#94A3B8"
            value={formData.college}
            onChangeText={(val) => handleChange("college", val)}
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Grad Year</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="2027"
                placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={formData.cgpa}
                onChangeText={(val) => handleChange("cgpa", val)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[globalStyles.btnPrimary, { marginTop: 10 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={globalStyles.btnPrimaryText}>Create Free Account ➔</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingTop: 30,
    paddingBottom: 40,
  },
  brandHeader: {
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.textMain,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
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
