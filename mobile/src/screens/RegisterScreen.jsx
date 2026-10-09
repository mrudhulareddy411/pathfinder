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
  Dimensions,
} from "react-native";
import { registerUser } from "../services/authService";

const { width, height } = Dimensions.get("window");

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
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Soft Light Ambient Orbs matching the Web Frontend */}
      <View style={[styles.ambientOrb, { top: -100, right: -50, backgroundColor: "rgba(37, 99, 235, 0.15)" }]} />
      <View style={[styles.ambientOrb, { bottom: -100, left: -150, backgroundColor: "rgba(139, 92, 246, 0.1)", width: 400, height: 400 }]} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandHeader}>
          <Text style={styles.appTitle}>Join Pathfinder AI 🚀</Text>
          <Text style={styles.appSubtitle}>
            Create your student account to build your career path & evaluate your skills.
          </Text>
        </View>

        <View style={styles.lightCard}>
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Kondreddy Mrudhula"
            placeholderTextColor="#94A3B8"
            value={formData.fullName}
            onChangeText={(val) => handleChange("fullName", val)}
          />

          <Text style={styles.inputLabel}>Email Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. student@college.edu"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(val) => handleChange("email", val)}
          />

          <Text style={styles.inputLabel}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Minimum 8 characters"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={formData.password}
            onChangeText={(val) => handleChange("password", val)}
          />

          <Text style={styles.inputLabel}>Degree / Education Level</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. B.Tech / B.E."
            placeholderTextColor="#94A3B8"
            value={formData.educationLevel}
            onChangeText={(val) => handleChange("educationLevel", val)}
          />

          <Text style={styles.inputLabel}>Branch / Stream</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Computer Science & Engineering"
            placeholderTextColor="#94A3B8"
            value={formData.branch}
            onChangeText={(val) => handleChange("branch", val)}
          />

          <Text style={styles.inputLabel}>College / Institution</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Saveetha Institute of Tech"
            placeholderTextColor="#94A3B8"
            value={formData.college}
            onChangeText={(val) => handleChange("college", val)}
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Grad Year</Text>
              <TextInput
                style={styles.input}
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
                style={styles.input}
                placeholder="8.6"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={formData.cgpa}
                onChangeText={(val) => handleChange("cgpa", val)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btnPrimary, { marginTop: 10 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.btnPrimaryText}>Create Free Account ➔</Text>
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
  ambientOrb: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  brandHeader: {
    marginBottom: 24,
    zIndex: 2,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  lightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 24,
    marginBottom: 16,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
  },
  btnPrimary: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
  },
});
