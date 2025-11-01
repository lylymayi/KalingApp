import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

// FIX 1: Define the shape of your medicine data
interface MedicineReminder {
  id: string;
  medicineName: string;
  dateTime: FirebaseFirestoreTypes.Timestamp;
}

export default function MedicineScreen() {
  const [medicineName, setMedicineName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  // FIX 2: Tell useState this is an array of MedicineReminder objects
  const [records, setRecords] = useState<MedicineReminder[]>([]);

  const user = auth().currentUser;

  useEffect(() => {
    // This guard is correct for the effect
    if (!user) return;

    const unsubscribe = firestore()
      .collection("users")
      .doc(user.uid)
      .collection("medicine_reminders")
      .orderBy("dateTime", "asc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as MedicineReminder) // Assert the data type here
        );
        setRecords(data);
      });

    return unsubscribe;
  }, [user]); // Add user dependency

  const saveReminder = async () => {
    // FIX 3: Add a check for the user in functions that use it
    if (!user) {
      Alert.alert("Error", "You must be logged in to save reminders.");
      return;
    }

    if (!medicineName) {
      Alert.alert("Missing Info", "Please enter the medicine name.");
      return;
    }

    try {
      await firestore()
        .collection("users")
        .doc(user.uid) // This is now safe
        .collection("medicine_reminders")
        .add({
          medicineName,
          dateTime: selectedDate,
        });

      setMedicineName("");
      Alert.alert("Success", "Medicine reminder saved!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save reminder.");
    }
  };

  // FIX 4: Type the event handlers for the pickers
  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const onTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowTimePicker(false);
    if (date) setSelectedDate(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Medicine Schedule</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Medicine Name:</Text>
        <TextInput
          style={styles.input}
          value={medicineName}
          onChangeText={setMedicineName}
          placeholder="Enter medicine name"
        />

        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            📅 {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateText}>
            ⏰{" "}
            {selectedDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            onChange={onDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            display="clock"
            onChange={onTimeChange}
          />
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={saveReminder}>
          <Text style={styles.saveText}>Save Reminder</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.historyTitle}>Upcoming Medicines</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordCard}>
            <Text style={styles.recordText}>💊 {item.medicineName}</Text>
            {/* FIX 6: Use the renamed style here */}
            <Text style={styles.recordDateText}>
              {item.dateTime
                ? new Date(item.dateTime.toDate()).toLocaleString()
                : "No date"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1565C0",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  label: { fontSize: 16, color: "#333", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#90CAF9",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  dateBtn: {
    backgroundColor: "#BBDEFB",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: { fontSize: 16, color: "#0D47A1" }, // This is the first one (for buttons)
  saveBtn: {
    backgroundColor: "#1565C0",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  historyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1565C0",
    marginBottom: 10,
  },
  recordCard: {
    backgroundColor: "#F1F8E9",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  recordText: { fontSize: 16, color: "#333" },
  // FIX 5: Rename the duplicate style
  recordDateText: { fontSize: 13, color: "#666", marginTop: 4 },
});
