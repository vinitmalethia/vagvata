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

export const ADMIN_CONFIG = {
  uid: 'fOZcyquhHTUJJA7o5xiz4d7vBoB3',
  email: 'sachin@gmail.com',
  username: 'sachin'
};

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

    // 0. Immediate recognition for Vaidya administrator
    if (user.uid === ADMIN_CONFIG.uid || (user.email && user.email.trim().toLowerCase() === ADMIN_CONFIG.email)) {
      setUserRole('admin');
      try {
        localStorage.setItem(`vagvat_role_${user.uid}`, 'admin');
      } catch {}
      return 'admin';
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
      if (user) {
        setCurrentUser(user);
        if (user.uid === ADMIN_CONFIG.uid || user.email?.toLowerCase() === ADMIN_CONFIG.email) {
          setUserRole('admin');
          try {
            localStorage.setItem(`vagvat_role_${user.uid}`, 'admin');
          } catch {}
        } else {
          await resolveRole(user);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Customer Login
  const loginCustomer = async (email, password) => {
    if (!auth) throw new Error('Authentication service currently unavailable.');

    const clean = (email || '').trim().toLowerCase();
    const targetEmail = (clean === ADMIN_CONFIG.username || clean === ADMIN_CONFIG.email)
      ? ADMIN_CONFIG.email
      : clean;

    const cred = await signInWithEmailAndPassword(auth, targetEmail, password);
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

  // Admin Login with Firebase Authentication & UID Verification
  const loginAdmin = async (identifier, password) => {
    if (!auth) throw new Error('Authentication service currently unavailable.');

    const clean = (identifier || '').trim().toLowerCase();
    const targetEmail = (clean === ADMIN_CONFIG.username || clean === ADMIN_CONFIG.email)
      ? ADMIN_CONFIG.email
      : clean;

    const cred = await signInWithEmailAndPassword(auth, targetEmail, password);

    // Strictly enforce Firebase Admin UID
    if (cred.user.uid !== ADMIN_CONFIG.uid) {
      await signOut(auth);
      throw new Error('Access Denied: This account does not possess Vaidya/Dispensary Administrator privileges.');
    }

    setUserRole('admin');
    try {
      localStorage.setItem(`vagvat_role_${cred.user.uid}`, 'admin');
      localStorage.setItem('vagvat_admin_active_session', JSON.stringify({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || 'Vaidya Sachin (Administrator)',
        role: 'admin'
      }));
    } catch {}

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
    try {
      localStorage.removeItem('vagvat_admin_active_session');
    } catch {}
    if (auth && auth.currentUser) {
      try {
        await signOut(auth);
      } catch {}
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
