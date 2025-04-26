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
  serverTimestamp,
  deleteDoc,
  orderBy,
  limit,
  Timestamp,
  writeBatch
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
    
    // Create a user document
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role: 'doctor',
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      isActive: true
    });

    // Create a doctor profile
    await setDoc(doc(db, 'doctorProfiles', userCredential.user.uid), {
      name,
      email,
      specialization: '',
      phone: '',
      address: '',
      clinic: '',
      licenseNumber: '',
      updatedAt: Timestamp.now()
    });

    // Create default templates
    await createDefaultTemplates(userCredential.user.uid);
    
    return userCredential.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Login error:', error);
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
    const docSnap = await getDoc(doc(db, 'doctorProfiles', uid));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // If profile doesn't exist, create a default one
      const defaultProfile = {
        name: '',
        email: '',
        specialization: '',
        phone: '',
        address: '',
        clinic: {
          name: '',
          address: '',
          phone: '',
          email: '',
          license: '',
          logo: ''
        },
        licenseNumber: '',
        updatedAt: Timestamp.now()
      };
      
      await setDoc(doc(db, 'doctorProfiles', uid), defaultProfile);
      return { id: uid, ...defaultProfile };
    }
  } catch (error) {
    console.error('Error getting doctor profile:', error);
    throw error;
  }
};

export const updateDoctorProfile = async (uid: string, data: any) => {
  try {
    await updateDoc(doc(db, 'doctorProfiles', uid), {
      ...data,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating doctor profile:', error);
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
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { id: patientRef.id, ...patientData };
  } catch (error) {
    throw error;
  }
};

export const getPatientsByDoctor = async (doctorId: string) => {
  try {
    const q = query(
      collection(db, 'patients'),
      where('doctorId', '==', doctorId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting patients:', error);
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
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { id: prescriptionRef.id, ...prescriptionData };
  } catch (error) {
    throw error;
  }
};

export const getPrescriptionsByDoctor = async (doctorId: string) => {
  try {
    const q = query(
      collection(db, 'prescriptions'),
      where('doctorId', '==', doctorId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting prescriptions:', error);
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

export const updatePrescription = async (prescriptionId: string, data: any) => {
  try {
    const prescriptionRef = doc(db, 'prescriptions', prescriptionId);
    await updateDoc(prescriptionRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    return { id: prescriptionId, ...data };
  } catch (error) {
    console.error('Error updating prescription:', error);
    throw error;
  }
};

// User functions
export const getUser = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Medication functions
export const getMedicationsByDoctor = async (doctorId: string) => {
  try {
    const q = query(
      collection(db, 'medications'),
      where('doctorId', '==', doctorId),
      where('isActive', '==', true),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting medications:', error);
    throw error;
  }
};

export const getMedication = async (medicationId: string) => {
  try {
    const medicationDoc = await getDoc(doc(db, 'medications', medicationId));
    return medicationDoc.exists() ? { id: medicationDoc.id, ...medicationDoc.data() } : null;
  } catch (error) {
    console.error('Error getting medication:', error);
    throw error;
  }
};

export const createMedication = async (data: any) => {
  try {
    const newMedicationRef = doc(collection(db, 'medications'));
    await setDoc(newMedicationRef, {
      ...data,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return newMedicationRef.id;
  } catch (error) {
    console.error('Error creating medication:', error);
    throw error;
  }
};

export const updateMedication = async (medicationId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'medications', medicationId), {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating medication:', error);
    throw error;
  }
};

// Template functions
export const getTemplatesByDoctor = async (doctorId: string) => {
  try {
    const q = query(
      collection(db, 'templates'),
      where('doctorId', '==', doctorId),
      orderBy('lastUsed', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting templates:', error);
    throw error;
  }
};

export const getTemplate = async (templateId: string) => {
  try {
    const templateDoc = await getDoc(doc(db, 'templates', templateId));
    return templateDoc.exists() ? { id: templateDoc.id, ...templateDoc.data() } : null;
  } catch (error) {
    console.error('Error getting template:', error);
    throw error;
  }
};

export const createTemplate = async (data: any) => {
  try {
    const newTemplateRef = doc(collection(db, 'templates'));
    await setDoc(newTemplateRef, {
      ...data,
      lastUsed: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return newTemplateRef.id;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

export const updateTemplate = async (templateId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'templates', templateId), {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating template:', error);
    throw error;
  }
};

// Settings functions
export const getSettings = async (userId: string) => {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', userId));
    return settingsDoc.exists() ? settingsDoc.data() : null;
  } catch (error) {
    console.error('Error getting settings:', error);
    throw error;
  }
};

export const updateSettings = async (userId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'settings', userId), {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

export const createDefaultTemplates = async (doctorId: string) => {
  try {
    const defaultTemplates = [
      {
        name: 'Common Cold',
        category: 'General Medicine',
        description: 'Template for treating common cold symptoms',
        medications: [
          {
            name: 'Paracetamol',
            dosage: '500mg',
            frequency: '1-0-1',
            route: 'Oral',
            duration: '3 days',
            instructions: 'After meals'
          },
          {
            name: 'Cetirizine',
            dosage: '10mg',
            frequency: '0-0-1',
            route: 'Oral',
            duration: '3 days',
            instructions: 'At night'
          }
        ],
        nonPharmacologicalAdvice: [
          'Take plenty of rest',
          'Stay hydrated',
          'Use steam inhalation',
          'Avoid cold drinks and foods'
        ],
        labTests: [],
        notes: 'Follow up if symptoms persist beyond 3 days'
      },
      {
        name: 'Hypertension Management',
        category: 'Cardiology',
        description: 'Template for managing hypertension',
        medications: [
          {
            name: 'Amlodipine',
            dosage: '5mg',
            frequency: '1-0-0',
            route: 'Oral',
            duration: '30 days',
            instructions: 'In the morning'
          },
          {
            name: 'Losartan',
            dosage: '50mg',
            frequency: '1-0-0',
            route: 'Oral',
            duration: '30 days',
            instructions: 'In the morning'
          }
        ],
        nonPharmacologicalAdvice: [
          'Reduce salt intake',
          'Regular exercise',
          'Maintain healthy weight',
          'Limit alcohol consumption',
          'Quit smoking'
        ],
        labTests: [
          'Complete Blood Count',
          'Lipid Profile',
          'Kidney Function Test',
          'Electrolytes'
        ],
        notes: 'Monitor blood pressure daily and maintain a log'
      },
      {
        name: 'Type 2 Diabetes',
        category: 'Endocrinology',
        description: 'Template for managing Type 2 Diabetes',
        medications: [
          {
            name: 'Metformin',
            dosage: '500mg',
            frequency: '1-0-1',
            route: 'Oral',
            duration: '30 days',
            instructions: 'After meals'
          },
          {
            name: 'Glimepiride',
            dosage: '2mg',
            frequency: '1-0-0',
            route: 'Oral',
            duration: '30 days',
            instructions: 'Before breakfast'
          }
        ],
        nonPharmacologicalAdvice: [
          'Follow diabetic diet',
          'Regular exercise',
          'Monitor blood sugar levels',
          'Maintain healthy weight',
          'Regular foot care'
        ],
        labTests: [
          'Fasting Blood Sugar',
          'HbA1c',
          'Lipid Profile',
          'Kidney Function Test'
        ],
        notes: 'Monitor blood sugar levels daily and maintain a log'
      }
    ];

    for (const template of defaultTemplates) {
      await createTemplate({
        doctorId,
        ...template,
        lastUsed: null
      });
    }
  } catch (error) {
    console.error('Error creating default templates:', error);
    throw error;
  }
};

export const importMedicinesFromCSV = async (doctorId: string, csvData: string) => {
  try {
    // Parse CSV data
    const rows = csvData.split('\n').map(row => row.split(','));
    const headers = rows[0];
    const medicines = rows.slice(1).map(row => {
      const medicine: any = {
        doctorId,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      headers.forEach((header, index) => {
        const value = row[index]?.trim();
        if (value) {
          switch (header.toLowerCase()) {
            case 'name':
              medicine.name = value;
              break;
            case 'manufacturer_name':
              medicine.manufacturer = value;
              break;
            case 'short_composition1':
              medicine.composition1 = value;
              break;
            case 'short_composition2':
              medicine.composition2 = value;
              break;
            case 'category':
              medicine.category = value;
              break;
          }
        }
      });
      
      return medicine;
    });

    // Batch write to Firestore
    const batch = writeBatch(db);
    medicines.forEach(medicine => {
      const docRef = doc(collection(db, 'medications'));
      batch.set(docRef, medicine);
    });

    await batch.commit();
    return medicines.length;
  } catch (error) {
    console.error('Error importing medicines:', error);
    throw error;
  }
};

export { app, auth, db, onAuthStateChanged };