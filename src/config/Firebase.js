import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCd_ex_zdWQf8HHFI95SgDCro2JcAW0XP0",
  authDomain: "subicharan-tex.firebaseapp.com",
  projectId: "subicharan-tex",
  storageBucket: "subicharan-tex.firebasestorage.app",
  messagingSenderId: "719459745649",
  appId: "1:719459745649:web:a235ea44b533c5d73b80d0",
  measurementId: "G-SL1RKNQEQW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { signInWithPopup, signOut };
export default app;