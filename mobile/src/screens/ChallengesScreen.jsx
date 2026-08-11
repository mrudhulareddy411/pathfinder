import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { theme, globalStyles } from "../theme";
import Header from "../components/Header";
import api from "../services/api";

export default function ChallengesScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [xp, setXp] = useState(450);

  const challenges = [
    {
      id: "ch_1",
      title: "Binary Tree Level Order Traversal",
      category: "Algorithms",
      difficulty: "Medium",
      xpReward: 100,
    },
    {
      id: "ch_2",
      title: "SQL Subqueries & Window Functions",
      category: "DBMS",
      difficulty: "Easy",
      xpReward: 50,
    },
    {
      id: "ch_3",
      title: "React Custom Hooks & Context API",
      category: "Web Dev",
      difficulty: "Medium",
      xpReward: 75,
    },
  ];

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data) setUser(res.data);
      } catch (e) {}
    };
    fetchMe();
  }, []);

  const handleStartChallenge = (ch) => {
    setXp((prev) => prev + ch.xpReward);
    alert(`🎉 Challenge Completed! Earned +${ch.xpReward} XP.`);
  };

  return (
    <View style={globalStyles.container}>
      <Header user={user} navigation={navigation} />

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        <View style={globalStyles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={globalStyles.cardTitle}>Career Challenges 🏆</Text>
              <Text style={globalStyles.cardSubtitle}>
                Solve coding puzzles, complete tasks & earn XP rewards.
              </Text>
            </View>
            <View style={globalStyles.badgeGreen}>
              <Text style={globalStyles.badgeGreenText}>⭐ {xp} XP</Text>
            </View>
          </View>
        </View>

        {challenges.map((ch) => (
          <View key={ch.id} style={globalStyles.card}>
            <View style={styles.headerRow}>
              <View style={globalStyles.badgeBlue}>
                <Text style={globalStyles.badgeBlueText}>{ch.category}</Text>
              </View>
              <View style={globalStyles.badgeGreen}>
                <Text style={globalStyles.badgeGreenText}>+{ch.xpReward} XP</Text>
              </View>
            </View>

            <Text style={[globalStyles.cardTitle, { marginTop: 6 }]}>{ch.title}</Text>
            <Text style={globalStyles.cardSubtitle}>Difficulty: {ch.difficulty}</Text>

            <TouchableOpacity
              style={globalStyles.btnPrimary}
              onPress={() => handleStartChallenge(ch)}
            >
              <Text style={globalStyles.btnPrimaryText}>Start Challenge ➔</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
