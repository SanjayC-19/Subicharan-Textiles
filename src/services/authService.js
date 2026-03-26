import { auth, db } from '../config/Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
  return { user: userData };
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
