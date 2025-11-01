import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

const screenWidth = Dimensions.get("window").width;

export default function WellnessScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🌿 Wellness & Relaxation</Text>
      <Text style={styles.subtitle}>
        Watch simple exercises, breathing techniques, and relaxing videos for
        your health and peace of mind.
      </Text>

      <View style={styles.videoContainer}>
        <Text style={styles.videoTitle}>Gentle Morning Exercise</Text>
        <WebView
          style={styles.video}
          source={{ uri: "https://www.youtube.com/embed/4f8eMNtV7aY" }}
          allowsFullscreenVideo
        />
      </View>

      <View style={styles.videoContainer}>
        <Text style={styles.videoTitle}>Stretching for Seniors</Text>
        <WebView
          style={styles.video}
          source={{ uri: "https://www.youtube.com/embed/R8ZJxDxnF0Y" }}
          allowsFullscreenVideo
        />
      </View>

      <View style={styles.videoContainer}>
        <Text style={styles.videoTitle}>Relaxation & Breathing</Text>
        <WebView
          style={styles.video}
          source={{ uri: "https://www.youtube.com/embed/c1Ndym-IsQg" }}
          allowsFullscreenVideo
        />
      </View>

      <View style={styles.videoContainer}>
        <Text style={styles.videoTitle}>Evening Calm Yoga</Text>
        <WebView
          style={styles.video}
          source={{ uri: "https://www.youtube.com/embed/Yzm3fA2HhkQ" }}
          allowsFullscreenVideo
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#4CAF50",
    marginBottom: 20,
  },
  videoContainer: {
    marginBottom: 20,
    backgroundColor: "#C8E6C9",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 8,
  },
  video: {
    width: screenWidth - 40,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
});
