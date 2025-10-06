import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLQk5e_KUDOkrQXO55Xr3Nmegc7xlOfzg",
  authDomain: "low-369.firebaseapp.com",
  projectId: "low-369",
  storageBucket: "low-369.firebasestorage.app",
  messagingSenderId: "469286712573",
  appId: "1:469286712573:web:d025da705cbac344e83a94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);


