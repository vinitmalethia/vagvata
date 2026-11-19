// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Auth & Firestore
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Initialize Analytics if supported in the current environment
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
