import { auth, db } from '../config/Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const sendWelcomeEmail = async ({ name, email }) => {
  const response = await fetch(`${API_BASE_URL}/auth/welcome`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    throw new Error(payload?.error || 'Failed to send welcome email');
  }
};

export const signupUser = async ({ name, email, password, role }) => {
  // Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Set display name
  await updateProfile(userCredential.user, { displayName: name });
  // Store user info in Firestore
  const userData = {
    uid: userCredential.user.uid,
    name,
    email,
    role: role || 'user',
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, 'users', userCredential.user.uid), userData);

  let welcomeEmailSent = true;
  try {
    await sendWelcomeEmail({ name, email });
  } catch {
    welcomeEmailSent = false;
  }

  return { user: userData, welcomeEmailSent };
};

export const loginUser = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  // Fetch user info from Firestore
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  let userData = {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
  };
  if (userDoc.exists()) {
    userData = { ...userData, ...userDoc.data() };
  }
  return {
    user: userData,
    token: await user.getIdToken(),
  };
};
