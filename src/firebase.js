// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAoxd-dB0-6VC3Z46RLnUJG7g_8ZWxyD2Q",
  authDomain: "vagva-3402d.firebaseapp.com",
  projectId: "vagva-3402d",
  storageBucket: "vagva-3402d.firebasestorage.app",
  messagingSenderId: "737767398167",
  appId: "1:737767398167:web:a83662a715e5896e653552",
  measurementId: "G-7XHVWWGZ8C"
};

// Safe singleton Firebase App initialization
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Safe service instances
let authInstance = null;
let googleProviderInstance = null;
let dbInstance = null;

try {
  authInstance = getAuth(app);
  googleProviderInstance = new GoogleAuthProvider();
  dbInstance = getFirestore(app);
} catch (e) {
  console.warn("Firebase service initialization notice:", e);
}

export const auth = authInstance;
export const googleProvider = googleProviderInstance;
export const db = dbInstance;

// Analytics (safely conditioned for browser environments)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}

export default app;
