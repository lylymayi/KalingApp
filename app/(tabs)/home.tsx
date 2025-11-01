import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "../_context/UserContext";

type AppPath =
  | "/health"
  | "/medicine"
  | "/wellness"
  | "/contacts"
  | "/schedule"
  | "/settings";

interface NavTile {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  screen: AppPath;
}

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useUser();
  const name = profile?.name ?? "User";

  const handleSOS = () => {
    Alert.alert("🚨 SOS", "Your emergency contact has been notified!", [
      { text: "OK" },
    ]);
  };

  const tiles: NavTile[] = [
    { title: "My Health", icon: "heart", screen: "/health" },
    { title: "My Medicine", icon: "medkit", screen: "/medicine" },
    { title: "Wellness", icon: "leaf", screen: "/wellness" },
    { title: "Contacts", icon: "people", screen: "/contacts" },
    { title: "Schedule", icon: "calendar", screen: "/schedule" },
    { title: "Settings", icon: "settings", screen: "/settings" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greeting}>Hello, {name}!</Text>

      <View style={styles.reminderSection}>
        <Text style={styles.reminderTitle}>Reminders</Text>
        <Text style={styles.noReminders}>No reminders yet.</Text>
      </View>

      <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
        <Text style={styles.sosText}>🚨 HELP SOS</Text>
      </TouchableOpacity>

      <View style={styles.tilesContainer}>
        {tiles.map((tile) => (
          <TouchableOpacity
            key={tile.title}
            style={styles.tile}
            onPress={() => router.push(tile.screen)}
          >
            <Ionicons name={tile.icon} size={28} color="#1976D2" />
            <Text style={styles.tileText}>{tile.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1976D2",
  },
  reminderSection: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  reminderTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  noReminders: { color: "#555", fontStyle: "italic" },
  sosButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  sosText: { color: "#fff", fontWeight: "bold", fontSize: 20 },
  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
  },
  tile: {
    width: "45%",
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  tileText: { marginTop: 8, fontSize: 16, fontWeight: "600", color: "#1976D2" },
});
