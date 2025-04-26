import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  updateProfile 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

// Firebase config - replace with your own config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const registerUser = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    
    // Create a doctor document
    await setDoc(doc(db, 'doctors', userCredential.user.uid), {
      name,
      email,
      specialization: '', // Empty initially, to be filled later
      licenseNumber: '', // Empty initially, to be filled later
      contact: '',
      clinicInfo: {
        name: '',
        address: '',
        phone: '',
        email: ''
      },
      createdAt: serverTimestamp()
    });
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};

// Doctor functions
export const getDoctorProfile = async (uid: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'doctors', uid));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Doctor not found');
    }
  } catch (error) {
    throw error;
  }
};

export const updateDoctorProfile = async (uid: string, data: any) => {
  try {
    await updateDoc(doc(db, 'doctors', uid), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Patient functions
export const addPatient = async (doctorId: string, patientData: any) => {
  try {
    const patientRef = doc(collection(db, 'patients'));
    await setDoc(patientRef, {
      ...patientData,
      doctorId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: patientRef.id, ...patientData };
  } catch (error) {
    throw error;
  }
};

export const getPatientsByDoctor = async (doctorId: string) => {
  try {
    const q = query(collection(db, 'patients'), where('doctorId', '==', doctorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const getPatientById = async (patientId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'patients', patientId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Patient not found');
    }
  } catch (error) {
    throw error;
  }
};

// Prescription functions
export const createPrescription = async (prescriptionData: any) => {
  try {
    const prescriptionRef = doc(collection(db, 'prescriptions'));
    await setDoc(prescriptionRef, {
      ...prescriptionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: prescriptionRef.id, ...prescriptionData };
  } catch (error) {
    throw error;
  }
};

export const getPrescriptionsByDoctor = async (doctorId: string) => {
  try {
    const q = query(collection(db, 'prescriptions'), where('doctorId', '==', doctorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const getPrescriptionsByPatient = async (patientId: string) => {
  try {
    const q = query(collection(db, 'prescriptions'), where('patientId', '==', patientId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const getPrescriptionById = async (prescriptionId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'prescriptions', prescriptionId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Prescription not found');
    }
  } catch (error) {
    throw error;
  }
};

export { app, auth, db, onAuthStateChanged };