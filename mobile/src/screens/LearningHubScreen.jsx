import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { theme, globalStyles } from "../theme";
import Header from "../components/Header";
import api from "../services/api";

export default function LearningHubScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const meRes = await api.get("/auth/me");
      if (meRes.data) setUser(meRes.data);

      const res = await api.get("/resources");
      if (res.data) setResources(Array.isArray(res.data) ? res.data : res.data.resources || []);
    } catch (err) {
      console.error("Fetch resources error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <View style={globalStyles.container}>
      <Header user={user} navigation={navigation} />

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        <View style={globalStyles.card}>
          <View style={globalStyles.badgeBlue}>
            <Text style={globalStyles.badgeBlueText}>Educational Courseware</Text>
          </View>
          <Text style={globalStyles.cardTitle}>Learning Hub 📚</Text>
          <Text style={globalStyles.cardSubtitle}>
            Verified learning resources, NPTEL modules, and documentation for technology skill gaps.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 30 }} />
        ) : (
          resources.map((item, idx) => (
            <View key={item._id || idx} style={globalStyles.card}>
              <View style={styles.resHeader}>
                <View style={globalStyles.badgeAmber}>
                  <Text style={globalStyles.badgeAmberText}>Skill: {item.skill}</Text>
                </View>
                <View style={globalStyles.badgeBlue}>
                  <Text style={globalStyles.badgeBlueText}>{item.category || "General"}</Text>
                </View>
              </View>

              <Text style={globalStyles.cardTitle}>{item.title}</Text>
              <Text style={styles.providerText}>Provider: {item.provider}</Text>
              <Text style={globalStyles.cardSubtitle}>{item.description}</Text>

              <TouchableOpacity
                style={globalStyles.btnOutline}
                onPress={() => alert(`Opening resource: ${item.title}`)}
              >
                <Text style={globalStyles.btnOutlineText}>Open Resource ↗</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  resHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  providerText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: 4,
  },
});
