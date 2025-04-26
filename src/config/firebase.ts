import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmTMEtZk1oXY_Gb6DWdpFtlqHDQwd6lUc",
  authDomain: "mediscript-12345.firebaseapp.com",
  projectId: "mediscript-12345",
  storageBucket: "mediscript-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 