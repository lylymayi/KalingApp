import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, onSnapshot, getDoc } from "firebase/firestore";

/* --------------------  FIREBASE CONFIG  -------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyAiIJ0h6jjgBTbCR0aMjHlzULPecqTaEKw",
  authDomain: "kalingapp-18017.firebaseapp.com",
  projectId: "kalingapp-18017",
  storageBucket: "kalingapp-18017.appspot.com",
  messagingSenderId: "298762141975",
  appId: "1:298762141975:web:4b368165e4be2d8c1ef752",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/* --------------------  CONTEXT TYPES  -------------------- */
type EmergencyContact = {
  name: string;
  number: string;
};

type UserProfile = {
  name: string;
  email: string;
  reminders?: string[];
  emergencyContact?: EmergencyContact;
};

type UserContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  saveProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
};

/* --------------------  CREATE CONTEXT  -------------------- */
const UserContext = createContext<UserContextType | undefined>(undefined);

/* --------------------  PROVIDER  -------------------- */
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* 🧠 Listen to auth state changes */
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check local cache first
        const cached = await AsyncStorage.getItem("userProfile");
        if (cached) setProfile(JSON.parse(cached));

        // Subscribe to Firestore for live updates
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeDoc = onSnapshot(userRef, async (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            setProfile(data);
            await AsyncStorage.setItem("userProfile", JSON.stringify(data));
          }
        });

        return () => unsubscribeDoc();
      } else {
        setProfile(null);
        await AsyncStorage.removeItem("userProfile");
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  /* 💾 Save profile changes to Firestore */
  const saveProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await getDoc(userRef); // ensures existence before updating
    await AsyncStorage.setItem(
      "userProfile",
      JSON.stringify({ ...profile, ...data })
    );
  };

  /* 🚪 Logout user */
  const logout = async () => {
    await AsyncStorage.removeItem("userProfile");
    await auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <UserContext.Provider
      value={{ user, profile, loading, saveProfile, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

/* --------------------  CUSTOM HOOK  -------------------- */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
