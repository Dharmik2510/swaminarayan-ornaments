import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore, type Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;

const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || "default";

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  // Use long-polling instead of WebChannel — the default streaming transport
  // reports "Database not found" in this environment, causing writes to hang.
  // Explicitly specify the database ID instead of leaving it empty for "(default)"
  db = initializeFirestore(app, { experimentalForceLongPolling: true }, databaseId);
} else {
  app = getApp();
  db = getFirestore(app, databaseId);
}

export { db };
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
