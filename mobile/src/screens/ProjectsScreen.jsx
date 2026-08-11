import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { theme, globalStyles } from "../theme";
import Header from "../components/Header";
import api from "../services/api";

export default function ProjectsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([
    {
      id: "proj_1",
      title: "Pathfinder AI Platform",
      skills: "React, Node.js, Express, MongoDB",
      description: "Full stack career guidance & resume builder web application built for students.",
      github: "https://github.com/pathfinder",
    },
    {
      id: "proj_2",
      title: "SQL Query Performance Analyzer",
      skills: "SQL, Python, PostgreSQL",
      description: "Database indexing, query planner optimization, and benchmark testing utility.",
      github: "https://github.com/sql-analyzer",
    },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newSkills, setNewSkills] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data) setUser(res.data);
      } catch (e) {}
    };
    fetchMe();
  }, []);

  const handleAddProject = () => {
    if (!newTitle) return;
    const newProj = {
      id: `proj_${Date.now()}`,
      title: newTitle,
      skills: newSkills || "React, Node.js",
      description: newDesc || "Student software project.",
    };
    setProjects([newProj, ...projects]);
    setNewTitle("");
    setNewSkills("");
    setNewDesc("");
    setAdding(false);
  };

  const handleDelete = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <View style={globalStyles.container}>
      <Header user={user} navigation={navigation} />

      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        <View style={globalStyles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={globalStyles.cardTitle}>Student Projects 🛠️</Text>
              <Text style={globalStyles.cardSubtitle}>
                Manage your technical portfolio projects for resume integration.
              </Text>
            </View>
            <TouchableOpacity
              style={globalStyles.btnPrimary}
              onPress={() => setAdding(!adding)}
            >
              <Text style={globalStyles.btnPrimaryText}>{adding ? "✕ Close" : "➕ Add"}</Text>
            </TouchableOpacity>
          </View>

          {adding ? (
            <View style={styles.addForm}>
              <Text style={styles.inputLabel}>Project Title *</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="e.g. AI Resume Parser"
                value={newTitle}
                onChangeText={setNewTitle}
              />
              <Text style={styles.inputLabel}>Technologies Used</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="React, Python, FastAPI"
                value={newSkills}
                onChangeText={setNewSkills}
              />
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Brief project details..."
                value={newDesc}
                onChangeText={setNewDesc}
              />
              <TouchableOpacity style={globalStyles.btnPrimary} onPress={handleAddProject}>
                <Text style={globalStyles.btnPrimaryText}>Save Project ➔</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {projects.map((proj) => (
          <View key={proj.id} style={globalStyles.card}>
            <View style={styles.headerRow}>
              <Text style={globalStyles.cardTitle}>{proj.title}</Text>
              <TouchableOpacity onPress={() => handleDelete(proj.id)}>
                <Text style={styles.deleteText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
            <View style={globalStyles.badgeBlue}>
              <Text style={globalStyles.badgeBlueText}>{proj.skills}</Text>
            </View>
            <Text style={[globalStyles.cardSubtitle, { marginTop: 8 }]}>
              {proj.description}
            </Text>
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
  addForm: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  deleteText: {
    fontSize: 12,
    color: theme.colors.danger,
    fontWeight: "600",
  },
});
