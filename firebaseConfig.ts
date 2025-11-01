// firebase.ts
import auth from "@react-native-firebase/auth";
import app from "@react-native-firebase/app";

// Optional: check initialization
if (!app.apps.length) {
  console.warn("Firebase app not initialized automatically!");
} else {
  console.log("Firebase app initialized successfully!");
}

export { app, auth };
