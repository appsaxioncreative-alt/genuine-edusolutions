"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, signOut, sendPasswordResetEmail, updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await getDoc(doc(db, "users", u.uid));
          setProfile(snap.exists() ? snap.data() : null);
        } catch (e) {
          console.error("[auth] could not load profile", e);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signUp = useCallback(async ({ name, email, password, phone }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const data = { name, email, phone: phone || "", createdAt: serverTimestamp() };
    await setDoc(doc(db, "users", cred.user.uid), data, { merge: true });
    setProfile({ name, email, phone: phone || "" });
    return cred.user;
  }, []);

  const logIn = useCallback((email, password) => signInWithEmailAndPassword(auth, email, password), []);

  const googleSignIn = useCallback(async () => {
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    const ref = doc(db, "users", cred.user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const data = {
        name: cred.user.displayName || "", email: cred.user.email || "",
        photoURL: cred.user.photoURL || "", createdAt: serverTimestamp(),
      };
      await setDoc(ref, data, { merge: true });
      setProfile(data);
    }
    return cred.user;
  }, []);

  const logOut = useCallback(() => signOut(auth), []);
  const resetPassword = useCallback((email) => sendPasswordResetEmail(auth, email), []);

  const saveProfile = useCallback(async (values) => {
    if (!auth.currentUser) throw new Error("You need to be logged in.");
    const data = { ...values, updatedAt: serverTimestamp() };
    await setDoc(doc(db, "users", auth.currentUser.uid), data, { merge: true });
    if (values.name && values.name !== auth.currentUser.displayName) {
      await updateProfile(auth.currentUser, { displayName: values.name });
    }
    setProfile((p) => ({ ...(p || {}), ...values }));
  }, []);

  const displayName =
    (profile && profile.name) || (user && user.displayName) || (user && user.email ? user.email.split("@")[0] : "");
  const firstName = displayName.trim().split(" ")[0] || "";
  const photoURL = (profile && profile.photoURL) || (user && user.photoURL) || "";

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, displayName, firstName, photoURL, signUp, logIn, googleSignIn, logOut, resetPassword, saveProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
