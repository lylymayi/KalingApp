import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";

export default function NameScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");

  const handleContinue = async () => {
    if (firstName.trim() === "") {
      Alert.alert("Please enter your name.");
      return;
    }
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert("No authenticated user found.");
        return;
      }
      await firestore().collection("users").doc(user.uid).update({
        name: firstName.trim(),
      });
      router.replace("/emergency");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save name");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>What should we call you?</Text>
      <Text style={styles.subtitle}>
        This helps us personalize your experience.
      </Text>
      <TextInput
        placeholder="Your Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1976D2",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
