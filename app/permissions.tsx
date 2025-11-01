import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

export default function PermissionsScreen() {
  const router = useRouter();
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);

  const askLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      setLocationGranted(true);
      Alert.alert("Location Access Granted");
    } else {
      Alert.alert("Location permission denied");
    }
  };

  const askNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      setNotificationsGranted(true);
      Alert.alert("Notifications Enabled");
    } else {
      Alert.alert("Notification permission denied");
    }
  };

  const handleContinue = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Permission Needed</Text>
      <Text style={styles.info}>
        To ensure your safety and timely reminders, we need a few permissions.
      </Text>
      <TouchableOpacity style={styles.permissionBtn} onPress={askLocation}>
        <Text style={styles.permissionText}>
          {locationGranted
            ? "✅ Location Access Granted"
            : "Grant Location Access"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.permissionBtn} onPress={askNotifications}>
        <Text style={styles.permissionText}>
          {notificationsGranted
            ? "✅ Notifications Enabled"
            : "Enable Notifications"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.continueBtn,
          {
            backgroundColor:
              locationGranted && notificationsGranted ? "#1976D2" : "#bbb",
          },
        ]}
        onPress={handleContinue}
        disabled={!(locationGranted && notificationsGranted)}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  info: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 24 },
  permissionBtn: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 14,
  },
  permissionText: { color: "#1976D2", fontWeight: "bold", fontSize: 16 },
  continueBtn: {
    padding: 16,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  continueText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
