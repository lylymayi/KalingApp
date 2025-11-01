import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "../_context/UserContext";

const SettingsScreen = () => {
  const router = useRouter();
  const { profile, logout } = useUser();
  const name = profile?.name ?? "Not set";
  const emergencyContact = profile?.emergencyContact;

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.info}>👤 Name: {name}</Text>
        <Text style={styles.info}>
          📞 Emergency Contact:{" "}
          {emergencyContact
            ? `${emergencyContact.name} (${emergencyContact.number})`
            : "None"}
        </Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 10 },
  logoutButton: {
    backgroundColor: "#D32F2F",
    padding: 16,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default SettingsScreen;
