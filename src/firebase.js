// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAmRd8zJ5ZdC6DyVQWbu7_axuG0f9UqGbw",
  authDomain: "vagvat-98c70.firebaseapp.com",
  projectId: "vagvat-98c70",
  storageBucket: "vagvat-98c70.firebasestorage.app",
  messagingSenderId: "35326892014",
  appId: "1:35326892014:web:24bf50096cffff043ea0ff",
  measurementId: "G-KG0LNNNQ82"
};

// Safe singleton Firebase App initialization
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let appCheckInstance = null;
const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY;
if (typeof window !== "undefined" && appCheckSiteKey) {
  try {
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true
    });
  } catch (e) {
    console.warn("Firebase App Check initialization notice:", e);
  }
}
export const appCheck = appCheckInstance;

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
export const functions = getFunctions(app, "asia-south1");

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
