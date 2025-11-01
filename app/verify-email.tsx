import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [emailVerified, setEmailVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  // Poll for verification status
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth().currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setEmailVerified(true);
          clearInterval(interval);
        }
      }
    }, 3000); // check every 3s

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    if (!emailVerified) {
      Alert.alert(
        "Not verified",
        "Please verify your email before continuing."
      );
      return;
    }
    router.replace("/name");
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const user = auth().currentUser;
      if (user) await user.sendEmailVerification();
      Alert.alert("Verification sent", "Check your email for a new link.");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Verify Your Email</Text>
      <Text style={styles.info}>
        We've sent a verification link to your email. Please check your inbox
        and click the link, then return here.
      </Text>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        {checking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueText}>Continue</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.resendButton}
        onPress={handleResend}
        disabled={resending}
      >
        {resending ? (
          <ActivityIndicator color="#1976D2" />
        ) : (
          <Text style={styles.resendText}>Resend Email</Text>
        )}
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
  header: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 18,
  },
  info: { fontSize: 16, color: "#555", marginBottom: 24, textAlign: "center" },
  continueButton: {
    backgroundColor: "#1976D2",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  continueText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  resendButton: {
    padding: 12,
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
  },
  resendText: { color: "#1976D2", fontWeight: "bold", fontSize: 16 },
});
