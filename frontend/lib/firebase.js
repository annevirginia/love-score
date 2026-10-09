/**
 * Firebase Realtime Database Client Initialization
 * Synchronizes room game states across different phones over the internet.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.databaseURL &&
    firebaseConfig.projectId
  );
}

let dbInstance = null;

export function getFirebaseDatabase() {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured()) return null;

  if (!dbInstance) {
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      dbInstance = getDatabase(app);
    } catch (err) {
      console.warn("Firebase initialization notice:", err);
      return null;
    }
  }

  return dbInstance;
}
