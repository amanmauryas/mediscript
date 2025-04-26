// Doctor Types
export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  contact: string;
  clinicInfo: ClinicInfo;
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
  address?: string;
  medicalHistory?: string[];
  allergies?: string[];
}

// Prescription Types
export interface Prescription {
  id: string;
  doctorId: string;
  patientId: string;
  visitDate: Date;
  symptoms: string[];
  diagnosis: string[];
  medications: Medication[];
  nonPharmacologicalAdvice?: string[];
  labTests?: LabTest[];
  followUpDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  instructions?: string;
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