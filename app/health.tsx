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
import firestore, {
  FirebaseFirestoreTypes, // <-- FIX: Import Timestamp type
} from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

// <-- FIX: Define the shape of your health data
interface HealthRecord {
  id: string;
  bloodPressure: string;
  bloodSugar: string;
  timestamp: FirebaseFirestoreTypes.Timestamp;
}

export default function HealthScreen() {
  const [bloodPressure, setBloodPressure] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  // <-- FIX: Tell useState this is an array of HealthRecord objects
  const [records, setRecords] = useState<HealthRecord[]>([]);

  const user = auth().currentUser;

  // ✅ Fetch health records in real-time
  useEffect(() => {
    if (!user) return; // This correctly guards the user for the useEffect

    const unsubscribe = firestore()
      .collection("users")
      .doc(user.uid)
      .collection("health_records")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as HealthRecord) // <-- FIX: Assert the data shape
        );
        setRecords(data);
      });

    return unsubscribe;
  }, [user]); // <-- FIX: Add user as a dependency

  // ✅ Save health data to Firestore
  const saveRecord = async () => {
    // <-- FIX: Add a check for the user here
    if (!user) {
      Alert.alert("Error", "You must be logged in to save records.");
      return;
    }

    if (!bloodPressure && !bloodSugar) {
      Alert.alert("Missing Info", "Please enter at least one measurement.");
      return;
    }

    try {
      await firestore()
        .collection("users")
        .doc(user.uid) // <-- This is now safe
        .collection("health_records")
        .add({
          bloodPressure,
          bloodSugar,
          timestamp: new Date(), // Firestore converts this to a Timestamp
        });

      setBloodPressure("");
      setBloodSugar("");
      Alert.alert("Success", "Record saved!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save record.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Health Tracker</Text>

      <View style={styles.inputContainer}>
        {/* ... (No changes needed in the JSX) ... */}
        <Text style={styles.label}>Blood Pressure (e.g. 120/80):</Text>
        <TextInput
          style={styles.input}
          value={bloodPressure}
          onChangeText={setBloodPressure}
          placeholder="Enter BP"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Blood Sugar (mg/dL):</Text>
        <TextInput
          style={styles.input}
          value={bloodSugar}
          onChangeText={setBloodSugar}
          placeholder="Enter Sugar Level"
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={saveRecord}>
          <Text style={styles.saveText}>Save Record</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.historyTitle}>Recent Records</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordCard}>
            <Text style={styles.recordText}>
              🩺 BP: {item.bloodPressure || "N/A"} | 🍬 Sugar:{" "}
              {item.bloodSugar || "N/A"}
            </Text>
            <Text style={styles.dateText}>
              {/* <-- FIX: Check if timestamp exists before calling .toDate() */}
              {item.timestamp
                ? new Date(item.timestamp.toDate()).toLocaleString()
                : "No date"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (No changes needed in styles) ...
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1976D2",
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
  saveBtn: {
    backgroundColor: "#1976D2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  historyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1976D2",
    marginBottom: 10,
  },
  recordCard: {
    backgroundColor: "#F1F8E9",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  recordText: { fontSize: 16, color: "#333" },
  dateText: { fontSize: 13, color: "#666", marginTop: 4 },
});
