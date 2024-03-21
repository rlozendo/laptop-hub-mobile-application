/**
 * FireBase Config
 */
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyByfYttLZW2iQngddDSE4Y05FcL7uoM0YE",
  authDomain: "laptop-hub-5745a.firebaseapp.com",
  databaseURL: "https://laptop-hub-5745a-default-rtdb.firebaseio.com",
  projectId: "laptop-hub-5745a",
  storageBucket: "laptop-hub-5745a.appspot.com",
  messagingSenderId: "626295207088",
  appId: "1:626295207088:web:e7e5f0ffe5c2ce52cc7775"
};


let app;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app, getReactNativePersistence(ReactNativeAsyncStorage));
const db = getDatabase(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, db, firestore, storage };



