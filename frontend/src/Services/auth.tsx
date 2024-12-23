import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

// Sign up
export const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in
export const logIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out
export const logOut = () => {
  return signOut(auth);
};