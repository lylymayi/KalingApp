import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import * as Contacts from "expo-contacts";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";

export default function EmergencyContactScreen() {
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    if (!contactName.trim() || !contactNumber.trim()) {
      Alert.alert("Please fill in both fields.");
      return;
    }

    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert("No authenticated user found.");
        return;
      }

      await firestore()
        .collection("users")
        .doc(user.uid)
        .update({
          emergencyContact: {
            name: contactName.trim(),
            phone: contactNumber.trim(),
          },
        });

      Alert.alert("Success", "Emergency contact saved!");
      router.replace("/permissions");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleImportContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow contact access.");
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    if (data.length > 0) {
      const contact = data[0]; // Later, show picker UI
      setContactName(contact.name || "");
      setContactNumber(contact.phoneNumbers?.[0]?.number || "");
      Alert.alert("Contact imported", `${contact.name}`);
    } else {
      Alert.alert("No contacts found");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Set up Emergency Contact</Text>
      <Text style={styles.subtitle}>
        This contact will be notified if you tap the Help button.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={contactName}
        onChangeText={setContactName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={contactNumber}
        onChangeText={setContactNumber}
      />

      <TouchableOpacity style={styles.importBtn} onPress={handleImportContact}>
        <Text style={styles.importText}>Add from Contacts</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Add Contact</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  importBtn: {
    backgroundColor: "#E3F2FD",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  importText: { color: "#1976D2", fontWeight: "bold", fontSize: 16 },
  saveBtn: {
    backgroundColor: "#1976D2",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
