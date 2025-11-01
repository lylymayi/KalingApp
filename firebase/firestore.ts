// firebase/firestore.ts
import firestore from "@react-native-firebase/firestore";

// FIX: Add types to parameters
export const addHealthRecord = async (
  uid: string,
  bloodSugar: string,
  bloodPressure: string
) => {
  // FIX: Call firestore() as a function
  await firestore().collection("healthRecords").add({
    uid,
    bloodSugar,
    bloodPressure,
    timestamp: firestore.FieldValue.serverTimestamp(), // Use server time
  });
};

// FIX: Add types
export const getHealthHistory = async (uid: string) => {
  // FIX: Call firestore() as a function
  const q = firestore()
    .collection("healthRecords")
    .where("uid", "==", uid)
    .orderBy("timestamp", "desc");

  const snapshot = await q.get();
  // Define the return type
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
