import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { theme } from "../theme";
import { logoutUser } from "../services/authService";

import DashboardScreen from "../screens/DashboardScreen";
import AssessmentScreen from "../screens/AssessmentScreen";
import CareerPathfinderScreen from "../screens/CareerPathfinderScreen";
import ResumeDashboardScreen from "../screens/ResumeDashboardScreen";
import ResumeBuilderScreen from "../screens/ResumeBuilderScreen";
import LearningHubScreen from "../screens/LearningHubScreen";
import ResourcesScreen from "../screens/ResourcesScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ProjectsScreen from "../screens/ProjectsScreen";
import ChallengesScreen from "../screens/ChallengesScreen";
import SkillsScreen from "../screens/SkillsScreen";
import AcademicTrackerScreen from "../screens/AcademicTrackerScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";


const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const handleLogout = async () => {
    await logoutUser();
    props.navigation.replace("Login");
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      {/* DRAWER BRAND HEADER */}
      <View style={styles.drawerHeader}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>Pathfinder AI</Text>
            <Text style={styles.brandSub}>Career Intelligence Platform</Text>
          </View>
        </View>
      </View>

      {/* DRAWER ITEMS */}
      <View style={styles.itemList}>
        <DrawerItemList {...props} />
      </View>

      {/* LOGOUT ACTION */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: theme.colors.primaryLight,
        drawerActiveTintColor: theme.colors.primaryDark,
        drawerInactiveTintColor: theme.colors.textDark,
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: "600",
          marginLeft: -10,
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginVertical: 2,
          paddingHorizontal: 8,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ drawerIcon: () => <Text>📊</Text> }}
      />
      <Drawer.Screen
        name="Assessment"
        component={AssessmentScreen}
        options={{ drawerIcon: () => <Text>⚡</Text> }}
      />
      <Drawer.Screen
        name="CareerPathfinder"
        component={CareerPathfinderScreen}
        options={{ title: "Career Pathfinder", drawerIcon: () => <Text>🎯</Text> }}
      />
      <Drawer.Screen
        name="ResumeDashboard"
        component={ResumeDashboardScreen}
        options={{ title: "Resumes", drawerIcon: () => <Text>📄</Text> }}
      />
      <Drawer.Screen
        name="ResumeBuilder"
        component={ResumeBuilderScreen}
        options={{ title: "Resume Builder", drawerIcon: () => <Text>✏️</Text> }}
      />
      <Drawer.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: "Calendar", drawerIcon: () => <Text>📅</Text> }}
      />
      <Drawer.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{ title: "Resources", drawerIcon: () => <Text>📚</Text> }}
      />
      <Drawer.Screen
        name="LearningHub"
        component={LearningHubScreen}
        options={{ title: "Learning Hub", drawerIcon: () => <Text>📖</Text> }}
      />
      <Drawer.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{ drawerIcon: () => <Text>🛠️</Text> }}
      />
      <Drawer.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{ drawerIcon: () => <Text>🏆</Text> }}
      />
      <Drawer.Screen
        name="Skills"
        component={SkillsScreen}
        options={{ title: "Skills Gap", drawerIcon: () => <Text>📈</Text> }}
      />
      <Drawer.Screen
        name="AcademicTracker"
        component={AcademicTrackerScreen}
        options={{ title: "Academic Tracker", drawerIcon: () => <Text>🎓</Text> }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ drawerIcon: () => <Text>👤</Text> }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ drawerIcon: () => <Text>⚙️</Text> }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.textMain,
  },
  brandSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  itemList: {
    paddingHorizontal: 8,
  },
  logoutBtn: {
    margin: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.dangerBg,
  },
  logoutText: {
    color: theme.colors.danger,
    fontWeight: "700",
    fontSize: 14,
  },
});
