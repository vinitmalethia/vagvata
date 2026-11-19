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

  // Helper to fetch or initialize user role from Firestore or localStorage fallback
  const resolveRole = async (user) => {
    if (!user) {
      setUserRole(null);
      return null;
    }

    try {
      // 1. Check Firestore user document
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const role = data.role || 'customer';
        setUserRole(role);
        try {
          localStorage.setItem(`vagvat_role_${user.uid}`, role);
        } catch {}
        return role;
      }

      // 2. Fallback to localStorage cached role if offline/rules restrictive
      const cachedRole = localStorage.getItem(`vagvat_role_${user.uid}`);
      if (cachedRole) {
        setUserRole(cachedRole);
        return cachedRole;
      }

      // Default to customer
      setUserRole('customer');
      return 'customer';
    } catch (err) {
      console.warn('Firestore role check warning, falling back to cached role:', err);
      const cachedRole = localStorage.getItem(`vagvat_role_${user.uid}`) || 'customer';
      setUserRole(cachedRole);
      return cachedRole;
    }
  };

  useEffect(() => {
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
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const role = await resolveRole(cred.user);
    return { user: cred.user, role };
  };

  // Customer Sign Up
  const signUpCustomer = async (email, password, displayName = '') => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    // Save user profile in Firestore
    try {
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email,
        displayName: displayName || email.split('@')[0],
        role: 'customer',
        createdAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn('Could not write user to Firestore:', e);
    }

    try {
      localStorage.setItem(`vagvat_role_${cred.user.uid}`, 'customer');
    } catch {}

    setUserRole('customer');
    return cred.user;
  };

  // Google Login
  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    let role = await resolveRole(cred.user);

    // If new user, create customer record
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

    return { user: cred.user, role };
  };

  // Admin Login with Strict Role Verification
  const loginAdmin = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const role = await resolveRole(cred.user);

    // If account is not marked as admin, deny access
    if (role !== 'admin') {
      // Check if user has admin key in localStorage or designated admin list
      const isDesignatedAdmin = localStorage.getItem(`vagvat_role_${cred.user.uid}`) === 'admin';
      if (!isDesignatedAdmin) {
        throw new Error('Access Denied: This account does not possess Vaidya/Dispensary Administrator privileges.');
      }
    }

    setUserRole('admin');
    return cred.user;
  };

  // Register or Promote an Admin (Protected with secret security passphrase or initialization)
  const registerAdmin = async (email, password, adminKey, displayName = 'Vagvat Vaidya Administrator') => {
    // Required security passphrase to prevent arbitrary users from becoming admins
    const VALID_ADMIN_KEY = 'VAGVAT-ADMIN-2025';
    if (adminKey !== VALID_ADMIN_KEY) {
      throw new Error('Invalid Security Passphrase. Contact Head of Vaidya Operations for authorization.');
    }

    let cred;
    try {
      cred = await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      // If user already exists, sign in and upgrade role
      if (err.code === 'auth/email-already-in-use') {
        cred = await signInWithEmailAndPassword(auth, email, password);
      } else {
        throw err;
      }
    }

    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

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

    try {
      localStorage.setItem(`vagvat_role_${cred.user.uid}`, 'admin');
    } catch {}

    setUserRole('admin');
    return cred.user;
  };

  // Forgot Password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
