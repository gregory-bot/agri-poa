import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA9jh4Jf8zuhJv5AWome9-8iVRy-kvIu9I",
  authDomain: "agri-c.firebaseapp.com",
  projectId: "agri-c",
  storageBucket: "agri-c.firebasestorage.app",
  messagingSenderId: "456926063869",
  appId: "1:456926063869:web:47accdf164bc1ffee1e294",
  measurementId: "G-88JFLNQJGD"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);