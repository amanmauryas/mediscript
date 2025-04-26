import { Doctor, Patient, Prescription, Medication, LabTest } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Generate doctor profile
export const generateDoctorProfile = (userId: string): Doctor => {
  return {
    id: userId,
    name: 'Dr. Sarah Johnson',
    email: 'dr.sarah@mediscript.com',
    specialization: 'Internal Medicine',
    licenseNumber: 'MED123456',
    contact: '(555) 123-4567',
    clinicInfo: {
      name: 'HealthCare Medical Center',
      address: '123 Medical Avenue, Suite 100, Healthcare City, HC 12345',
      phone: '(555) 987-6543',
      email: 'info@healthcaremedical.com'
    },
    createdAt: new Date()
  };
};

// Generate sample patients
export const generateSamplePatients = (doctorId: string): Patient[] => {
  return [
    {
      id: uuidv4(),
      name: 'John Smith',
      age: 45,
      gender: 'male',
      contact: '(555) 111-2222',
      address: '456 Patient St, Anytown, AT 67890',
      medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
      allergies: ['Penicillin']
    },
    {
      id: uuidv4(),
      name: 'Emily Johnson',
      age: 32,
      gender: 'female',
      contact: '(555) 333-4444',
      address: '789 Wellness Ave, Healthville, HV 54321',
      medicalHistory: ['Asthma', 'Eczema'],
      allergies: ['Sulfa drugs', 'Peanuts']
    },
    {
      id: uuidv4(),
      name: 'Robert Williams',
      age: 58,
      gender: 'male',
      contact: '(555) 555-6666',
      address: '321 Senior Blvd, Elderton, EL 98765',
      medicalHistory: ['Coronary Artery Disease', 'GERD'],
      allergies: []
    },
    {
      id: uuidv4(),
      name: 'Sophia Martinez',
      age: 28,
      gender: 'female',
      contact: '(555) 777-8888',
      address: '654 Young St, Youngville, YV 12345',
      medicalHistory: [],
      allergies: ['Latex']
    }
  ];
};

// Generate medications
const generateMedications = (): Medication[] => {
  return [
    {
      id: uuidv4(),
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      route: 'Oral',
      duration: '7 days',
      instructions: 'Take with food to avoid stomach upset'
    },
    {
      id: uuidv4(),
      name: 'Ibuprofen',
      dosage: '400mg',
      frequency: 'Every 6 hours as needed',
      route: 'Oral',
      duration: '5 days',
      instructions: 'Take with food or milk to reduce stomach irritation'
    }
  ];
};

// Generate lab tests
const generateLabTests = (): LabTest[] => {
  return [
    {
      id: uuidv4(),
      name: 'Complete Blood Count (CBC)',
      instructions: 'Fasting not required'
    },
    {
      id: uuidv4(),
      name: 'Comprehensive Metabolic Panel (CMP)',
      instructions: 'Fast for 8 hours before the test'
    }
  ];
};

// Generate sample prescriptions
export const generateSamplePrescriptions = (doctorId: string, patients: Patient[]): Prescription[] => {
  return patients.map(patient => {
    return {
      id: uuidv4(),
      doctorId,
      patientId: patient.id,
      visitDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000), // Random date within past 30 days
      symptoms: ['Fever', 'Cough', 'Fatigue'],
      diagnosis: ['Upper Respiratory Infection'],
      medications: generateMedications(),
      nonPharmacologicalAdvice: ['Rest for 3 days', 'Increase fluid intake', 'Use humidifier'],
      labTests: generateLabTests(),
      followUpDate: new Date(Date.now() + 7 * 86400000), // 7 days from now
      notes: 'Call if symptoms worsen or fever persists more than 3 days',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });
};