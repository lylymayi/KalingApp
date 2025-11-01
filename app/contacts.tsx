import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import * as Contacts from "expo-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Contact {
  id: string;
  name: string;
  phone: string;
  isEmergency?: boolean;
}

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Load saved contacts from local storage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("contacts");
      if (saved) setContacts(JSON.parse(saved));
    })();
  }, []);

  // Save to local storage when contacts update
  useEffect(() => {
    AsyncStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  // Import from device
  const importFromPhone = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Cannot access contacts.");
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    if (data.length > 0) {
      const imported = data
        .filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
        .map((c) => ({
          id: c.id,
          name: c.name,
          phone: c.phoneNumbers?.[0]?.number || "",
        }));

      setContacts((prev) => [...prev, ...imported]);
    }
  };

  // Add new contact manually
  const addManualContact = () => {
    if (!newName || !newPhone) {
      Alert.alert("Missing Info", "Please enter both name and phone number.");
      return;
    }
    const newContact: Contact = {
      id: Date.now().toString(),
      name: newName,
      phone: newPhone,
    };
    setContacts((prev) => [...prev, newContact]);
    setNewName("");
    setNewPhone("");
  };

  // Pin as emergency contact
  const setEmergency = (id: string) => {
    const updated = contacts.map((c) => ({
      ...c,
      isEmergency: c.id === id,
    }));
    setContacts(updated);
    Alert.alert(
      "Emergency Contact Set",
      "This person is now your emergency contact."
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 My Contacts</Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Add a Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={newName}
          onChangeText={setNewName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={newPhone}
          onChangeText={setNewPhone}
        />
        <TouchableOpacity style={styles.addButton} onPress={addManualContact}>
          <Text style={styles.addText}>Add Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.importButton} onPress={importFromPhone}>
          <Text style={styles.importText}>📲 Import from Phone</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.contactItem,
              item.isEmergency ? styles.emergencyItem : null,
            ]}
          >
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.phone}</Text>
            {!item.isEmergency && (
              <TouchableOpacity onPress={() => setEmergency(item.id)}>
                <Text style={styles.emergencyButton}>Set as Emergency</Text>
              </TouchableOpacity>
            )}
            {item.isEmergency && (
              <Text style={styles.emergencyLabel}>🚨 Emergency Contact</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0D47A1",
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    backgroundColor: "#BBDEFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1565C0",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#90CAF9",
  },
  addButton: {
    backgroundColor: "#1976D2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 6,
  },
  addText: { color: "white", fontWeight: "bold" },
  importButton: {
    borderColor: "#1976D2",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  importText: { color: "#1976D2", fontWeight: "bold" },
  contactItem: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  contactName: { fontSize: 16, fontWeight: "bold" },
  contactPhone: { fontSize: 14, color: "#555" },
  emergencyItem: {
    borderColor: "#D32F2F",
    backgroundColor: "#FFEBEE",
  },
  emergencyButton: {
    color: "#D32F2F",
    marginTop: 5,
    fontWeight: "bold",
  },
  emergencyLabel: {
    color: "#B71C1C",
    fontWeight: "bold",
    marginTop: 5,
  },
});
