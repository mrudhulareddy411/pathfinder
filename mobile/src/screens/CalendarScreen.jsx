import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { theme } from "../theme";
import { getEvents, createEvent, deleteEvent } from "../services/calendarService";

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState("Academic");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await getEvents();
    setEvents(data || []);
    setLoading(false);
  };

  const handleAddEvent = async () => {
    if (!title || !date) {
      Alert.alert("Required", "Please enter event title and date.");
      return;
    }
    try {
      await createEvent({ title, date, type, description });
      setModalVisible(false);
      setTitle("");
      setDescription("");
      loadEvents();
    } catch (e) {
      Alert.alert("Error", "Could not create event.");
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Event", "Remove this event from calendar?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteEvent(id);
          loadEvents();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Academic Calendar</Text>
          <Text style={styles.subtitle}>Track deadlines, exams, and career events</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Add Event</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {events.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No Events Scheduled</Text>
            <Text style={styles.emptySub}>Tap '+ Add Event' to schedule academic deadlines or exams.</Text>
          </View>
        ) : (
          events.map((item) => (
            <View key={item._id || Math.random().toString()} style={styles.eventCard}>
              <View style={styles.eventInfo}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{item.type || "Academic"}</Text>
                </View>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDate}>📅 {item.date}</Text>
                {item.description ? (
                  <Text style={styles.eventDesc}>{item.description}</Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* ADD EVENT MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Calendar Event</Text>

            <Text style={styles.label}>Event Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Midterm Exam / Project Deadline"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-09-15"
              value={date}
              onChangeText={setDate}
            />

            <Text style={styles.label}>Event Category</Text>
            <View style={styles.typeRow}>
              {["Academic", "Career", "Project", "Exam"].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeOption, type === t && styles.typeOptionActive]}
                  onPress={() => setType(t)}
                >
                  <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, { height: 70 }]}
              placeholder="Notes, links or reminders..."
              multiline
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddEvent}>
                <Text style={styles.saveBtnText}>Save Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.textMain,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  addBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginTop: 40,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.textMain,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    elevation: 1,
  },
  eventInfo: {
    flex: 1,
  },
  typeBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  typeBadgeText: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 11,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textMain,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: 13,
    color: "#4B5563",
  },
  deleteText: {
    fontSize: 18,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.textMain,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textMain,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#FAFAFA",
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 4,
  },
  typeOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  typeOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typeText: {
    fontSize: 12,
    color: theme.colors.textMain,
  },
  typeTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  cancelBtnText: {
    color: "#4B5563",
    fontWeight: "600",
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
