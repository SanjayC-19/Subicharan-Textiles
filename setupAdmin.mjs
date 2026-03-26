import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
const auth = getAuth(app);
const db = getFirestore(app);

async function setup() {
  const email = "admin2@subicharantex.com";
  const password = "Admin@12345";
  
  try {
    console.log("Creating admin user in Firebase Auth...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("Saving admin details to Firestore...");
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: 'Subicharan Tex Admin',
      email: email,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    
    console.log("Successfully created Admin Account!");
    process.exit(0);
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
       console.log("Admin account already exists in Auth. Make sure Firestore has role='admin'");
       process.exit(0);
    }
    console.error(err);
    process.exit(1);
  }
}

setup();
