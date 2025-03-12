import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
  getRedirectResult,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 🔹 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Setup Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🔹 Inisialisasi Firestore
const db = getFirestore(app); // 🔥 Firestore ditambahkan di sini

// 🔹 Set bahasa autentikasi ke bahasa perangkat pengguna
auth.useDeviceLanguage();

// 🔹 Gunakan persistensi agar sesi login tetap ada setelah reload
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Firebase auth persistence set to local"))
  .catch((error) => console.error("Failed to set auth persistence:", error));

export { auth, provider, signInWithPopup, getRedirectResult, signOut, db }; // 🔹 Ekspor `db`
