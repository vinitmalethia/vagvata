import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'customer' | 'admin' | null
  const [loading, setLoading] = useState(true);

  // Helper to fetch or initialize user role with instant local cache + timeout guard
  const resolveRole = async (user) => {
    if (!user) {
      setUserRole(null);
      return null;
    }

    // 1. Instant check from local cache
    let cachedRole = null;
    try {
      cachedRole = localStorage.getItem(`vagvat_role_${user.uid}`);
      if (cachedRole) {
        setUserRole(cachedRole);
      }
    } catch {}

    // 2. Async check from Firestore with 2.5s timeout guard so it never blocks
    if (db) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firestore timeout')), 2500)
        );
        const docPromise = getDoc(doc(db, 'users', user.uid));
        const userDoc = await Promise.race([docPromise, timeoutPromise]);

        if (userDoc && userDoc.exists()) {
          const role = userDoc.data().role || 'customer';
          setUserRole(role);
          try {
            localStorage.setItem(`vagvat_role_${user.uid}`, role);
          } catch {}
          return role;
        }
      } catch (err) {
        // Fallback to cached role or default
      }
    }

    const fallback = cachedRole || 'customer';
    setUserRole(fallback);
    return fallback;
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await resolveRole(user);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Customer Login
  const loginCustomer = async (email, password) => {
    if (!auth) throw new Error('Authentication service currently unavailable.');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const role = await resolveRole(cred.user);
    return { user: cred.user, role };
  };

  // Customer Sign Up
  const signUpCustomer = async (email, password, displayName = '') => {
    if (!auth) throw new Error('Authentication service currently unavailable.');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      try {
        await updateProfile(cred.user, { displayName });
      } catch {}
    }

    // Save user profile in Firestore
    if (db) {
      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email,
          displayName: displayName || email.split('@')[0],
          role: 'customer',
          createdAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore user sync warning:', e);
      }
    }

    try {
      localStorage.setItem(`vagvat_role_${cred.user.uid}`, 'customer');
    } catch {}

    setUserRole('customer');
    return cred.user;
  };

  // Google Login
  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) throw new Error('Google sign-in currently unavailable.');
    const cred = await signInWithPopup(auth, googleProvider);
    let role = await resolveRole(cred.user);

    if (db) {
      try {
        const userDocRef = doc(db, 'users', cred.user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            uid: cred.user.uid,
            email: cred.user.email,
            displayName: cred.user.displayName,
            role: 'customer',
            createdAt: serverTimestamp()
          });
          role = 'customer';
          setUserRole('customer');
        }
      } catch (e) {
        console.warn('Google sign-in Firestore sync notice:', e);
      }
    }

    return { user: cred.user, role };
  };

  // Admin Login with Strict Role Verification
  const loginAdmin = async (email, password) => {
    if (!auth) throw new Error('Authentication service currently unavailable.');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const role = await resolveRole(cred.user);

    if (role !== 'admin') {
      const isDesignatedAdmin = localStorage.getItem(`vagvat_role_${cred.user.uid}`) === 'admin';
      if (!isDesignatedAdmin) {
        throw new Error('Access Denied: This account does not possess Vaidya/Dispensary Administrator privileges.');
      }
    }

    setUserRole('admin');
    return cred.user;
  };

  // Register / Authorize an Admin
  const registerAdmin = async (email, password, adminKey, displayName = 'Vagvat Vaidya Administrator') => {
    const VALID_ADMIN_KEY = 'VAGVAT-ADMIN-2025';
    if (adminKey !== VALID_ADMIN_KEY) {
      throw new Error('Invalid Security Passphrase. Contact Head of Vaidya Operations for authorization.');
    }

    if (!auth) throw new Error('Authentication service currently unavailable.');

    let cred;
    try {
      cred = await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        cred = await signInWithEmailAndPassword(auth, email, password);
      } else {
        throw err;
      }
    }

    if (displayName) {
      try {
        await updateProfile(cred.user, { displayName });
      } catch {}
    }

    if (db) {
      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email,
          displayName,
          role: 'admin',
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.warn('Could not set admin in Firestore:', e);
      }
    }

    try {
      localStorage.setItem(`vagvat_role_${cred.user.uid}`, 'admin');
    } catch {}

    setUserRole('admin');
    return cred.user;
  };

  // Forgot Password
  const resetPassword = (email) => {
    if (!auth) throw new Error('Authentication service currently unavailable.');
    return sendPasswordResetEmail(auth, email);
  };

  // Logout
  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setUserRole(null);
  };

  const value = {
    currentUser,
    userRole,
    loading,
    loginCustomer,
    signUpCustomer,
    loginWithGoogle,
    loginAdmin,
    registerAdmin,
    resetPassword,
    logout
  };

  // ALWAYS render children so public pages are never blocked or blanked!
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
