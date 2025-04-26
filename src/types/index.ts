// Doctor Types
export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
  address: string;
  clinic: {
    name: string;
    address: string;
    phone: string;
    email: string;
    license: string;
    logo?: string;
    headerImage?: string;
  };
  licenseNumber: string;
  contact: string;
  clinicInfo: {
    name: string;
    address: string;
    phone: string;
    email?: string;
    logo?: string;
  };
  updatedAt: Date;
  createdAt: Date;
}

export interface ClinicInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}

// Patient Types
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contact: string;
  address: string;
  bloodGroup: string;
  allergies: string[];
  medicalHistory: string[];
  doctorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Prescription Types
export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  visitDate: Date;
  symptoms: string[];
  diagnosis: string[];
  medications: {
    id: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  notes: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  id: string;
  name: string;
  category: string;
  dosage: string;
  frequency: string;
  instructions: string;
  sideEffects: string[];
  contraindications: string[];
  doctorId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LabTest {
  id: string;
  name: string;
  instructions?: string;
}

// Form Types
export interface PatientFormData {
  name: string;
  age: number | '';
  gender: 'male' | 'female' | 'other';
  contact: string;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  visitDate: string;
  symptoms: string;
  diagnosis: string;
}

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  instructions?: string;
}

export interface AdviceFormData {
  nonPharmacologicalAdvice: string;
  labTests: string;
  followUpDate?: string;
  notes?: string;
}

// Authentication Types
export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
}

// UI Types
export interface FormStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  doctorId: string;
  medications: {
    id: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  symptoms: string[];
  diagnosis: string[];
  notes: string;
  lastUsed: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  prescriptionFormat: 'standard' | 'compact' | 'detailed';
  autoSave: boolean;
  updatedAt: Date;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  dosage: string;
  frequency: string;
  instructions: string;
  sideEffects: string[];
  contraindications: string[];
  doctorId: string;
  isActive: boolean;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}