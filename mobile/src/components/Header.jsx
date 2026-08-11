import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { theme } from "../theme";
import { logoutUser } from "../services/authService";

export default function Header({ user, navigation }) {
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const fullName = user?.fullName || "Student Profile";
  const firstInitial = (fullName.trim()[0] || "S").toUpperCase();
  const rawPhoto = user?.profileImage || user?.profilePhoto || null;
  const userPhoto = rawPhoto
    ? /^https?:\/\//i.test(rawPhoto)
      ? rawPhoto
      : `http://localhost:5000${rawPhoto.startsWith("/") ? "" : "/"}${rawPhoto}`
    : null;

  const userEmail = user?.email || "";
  const education = user?.educationLevel || user?.education || "Degree";
  const course = user?.branch || user?.course || "";
  const college = user?.college || "Not provided";
  const graduationYear = user?.graduationYear || "Not provided";
  const gpa = user?.cgpa ? `${user.cgpa}` : "Not provided";

  const handleLogout = async () => {
    setProfileModalVisible(false);
    await logoutUser();
    navigation.replace("Login");
  };

  return (
    <View style={styles.headerBar}>
      {/* BRAND LOGO */}
      <TouchableOpacity
        style={styles.brandContainer}
        onPress={() => navigation.navigate("Dashboard")}
        activeOpacity={0.7}
      >
        <View style={styles.brandIcon}>
          <Text style={styles.brandIconText}>P</Text>
        </View>
        <Text style={styles.brandTitle}>Pathfinder AI</Text>
      </TouchableOpacity>

      {/* RIGHT ACTION BUTTONS: AVATAR & HAMBURGER */}
      <View style={styles.rightActions}>
        {/* PROFILE AVATAR BUTTON */}
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => setProfileModalVisible(true)}
          activeOpacity={0.8}
        >
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{firstInitial}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* HAMBURGER DRAWER BUTTON */}
        <TouchableOpacity
          style={styles.hamburgerBtn}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.7}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* PROFILE DETAILS POPUP MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setProfileModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={styles.profileRow}>
                {userPhoto ? (
                  <Image source={{ uri: userPhoto }} style={styles.modalAvatarImg} />
                ) : (
                  <View style={styles.modalAvatarFallback}>
                    <Text style={styles.modalAvatarText}>{firstInitial}</Text>
                  </View>
                )}
                <View style={styles.profileTextCol}>
                  <Text style={styles.modalName} numberOfLines={1}>
                    {fullName}
                  </Text>
                  <Text style={styles.modalSub} numberOfLines={1}>
                    {education} {course}
                  </Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Profile Completion</Text>
                  <Text style={styles.progressVal}>80%</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: "80%" }]} />
                </View>
              </View>
            </View>

            {/* DETAILS LIST */}
            <View style={styles.detailsBox}>
              <Text style={styles.detailText} numberOfLines={1}>
                <Text style={styles.detailBold}>Email: </Text>
                {userEmail}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailBold}>GPA / CGPA: </Text>
                {gpa}
              </Text>
              <Text style={styles.detailText} numberOfLines={1}>
                <Text style={styles.detailBold}>College: </Text>
                {college}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailBold}>Graduation: </Text>
                {graduationYear}
              </Text>
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.actionCol}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setProfileModalVisible(false);
                  navigation.navigate("Profile");
                }}
              >
                <Text style={styles.modalBtnText}>👤 View Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setProfileModalVisible(false);
                  navigation.navigate("Profile");
                }}
              >
                <Text style={styles.modalBtnText}>✏️ Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setProfileModalVisible(false);
                  navigation.navigate("Settings");
                }}
              >
                <Text style={styles.modalBtnText}>⚙️ Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutBtnText}>🚪 Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    height: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 100,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  brandIconText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textMain,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarBtn: {
    marginRight: 10,
  },
  avatarImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarFallback: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  hamburgerBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "#FFFFFF",
  },
  hamburgerIcon: {
    fontSize: 18,
    color: theme.colors.textDark,
  },

  /* MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: theme.borderRadius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 12,
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  modalAvatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: 12,
  },
  modalAvatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  modalAvatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
  profileTextCol: {
    flex: 1,
  },
  modalName: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textMain,
  },
  modalSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  progressVal: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.textDark,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: theme.colors.grayBg,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  detailsBox: {
    backgroundColor: theme.colors.bg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  detailBold: {
    fontWeight: "700",
    color: theme.colors.textDark,
  },
  actionCol: {
    gap: 6,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.grayBg,
  },
  modalBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textDark,
  },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.dangerBg,
    marginTop: 4,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.danger,
  },
});
