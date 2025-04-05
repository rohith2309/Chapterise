// src/lib/Auth.js
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, googleProvider, signInWithPopup } from './firebase';
import { doc, setDoc } from "firebase/firestore";

async function storeUserInFirestore(user) {
  try {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: user.metadata.createdAt,
      provider: user.providerData[0].providerId
    }, { merge: true });
    console.log("User stored in Firestore:", user.uid);
  } catch (error) {
    console.error("Error storing user in Firestore:", error);
    throw error;
  }
}

export function registerUser(email, password) {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("User registered successfully:", user);
        await storeUserInFirestore(user);
        resolve(user);
      })
      .catch((error) => {
        console.error("Registration error:", error.code, error.message);
        reject(error);
      });
  });
}

export function signInUser(email, password) {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed in successfully:", user);
        resolve(user);
      })
      .catch((error) => {
        console.error("Sign-in error:", error.code, error.message);
        reject(error);
      });
  });
}

export function signInWithGoogle() {
  return new Promise((resolve, reject) => {
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const user = result.user;
        console.log("Signed in with Google:", user);
        await storeUserInFirestore(user);
        resolve(user);
      })
      .catch((error) => {
        console.error("Google sign-in error:", error.code, error.message);
        reject(error);
      });
  });
}