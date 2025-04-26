import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../contexts/AuthContext';
import { createPrescription, addPatient } from '../../services/firebase';
import MainLayout from '../../components/Layout/MainLayout';
import PatientInfoForm from '../../components/Prescription/PatientInfoForm';
import MedicationForm from '../../components/Prescription/MedicationForm';
import AdviceForm from '../../components/Prescription/AdviceForm';
import ClinicInfoForm from '../../components/Prescription/ClinicInfoForm';
import PrescriptionPreview from '../../components/Prescription/PrescriptionPreview';
import { ChevronRight, ChevronLeft, Save, Printer, Eye } from 'lucide-react';

interface FormStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

const NewPrescriptionPage: React.FC = () => {
  const { currentUser, doctorProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const methods = useForm({
    defaultValues: {
      patientId: '',
      patientName: '',
      age: '',
      gender: '',
      contact: '',
      address: '',
      medicalHistory: '',
      allergies: '',
      visitDate: new Date().toISOString().split('T')[0],
      symptoms: '',
      diagnosis: '',
      medications: [
        {
          name: '',
          dosage: '',
          frequency: '',
          route: 'Oral',
          duration: '',
          instructions: ''
        }
      ],
      nonPharmacologicalAdvice: '',
      labTests: '',
      followUpDate: '',
      notes: '',
      clinicInfo: {
        name: doctorProfile?.clinicInfo?.name || '',
        address: doctorProfile?.clinicInfo?.address || '',
        phone: doctorProfile?.clinicInfo?.phone || '',
        email: doctorProfile?.clinicInfo?.email || ''
      },
      doctorInfo: {
        name: doctorProfile?.name || '',
        specialization: doctorProfile?.specialization || '',
        licenseNumber: doctorProfile?.licenseNumber || ''
      }
    }
  });

  const steps: FormStep[] = [
    {
      id: 'patient',
      title: 'Patient Information',
      description: 'Enter patient details and symptoms',
      component: <PatientInfoForm />
    },
    {
      id: 'medications',
      title: 'Medications',
      description: 'Add prescribed medications',
      component: <MedicationForm />
    },
    {
      id: 'advice',
      title: 'Advice & Follow-up',
      description: 'Add non-pharmacological advice and follow-up details',
      component: <AdviceForm />
    },
    {
      id: 'clinic',
      title: 'Clinic Information',
      description: 'Review and update clinic details',
      component: <ClinicInfoForm />
    }
  ];

  const nextStep = () => {
    methods.trigger().then((isValid) => {
      if (isValid) {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
          window.scrollTo(0, 0);
        } else {
          setShowPreview(true);
        }
      }
    });
  };

  const prevStep = () => {
    if (showPreview) {
      setShowPreview(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (data: any) => {
    if (!currentUser) return;
    
    setSaving(true);
    
    try {
      // Process form data
      const symptomsArray = data.symptoms.split('\n').filter((s: string) => s.trim() !== '');
      const diagnosisArray = data.diagnosis.split('\n').filter((d: string) => d.trim() !== '');
      const nonPharmacologicalAdviceArray = data.nonPharmacologicalAdvice.split('\n').filter((a: string) => a.trim() !== '');
      const labTestsArray = data.labTests ? data.labTests.split('\n').filter((t: string) => t.trim() !== '') : [];
      
      // Create patient if needed
      const patientData = {
        name: data.name,
        age: Number(data.age),
        gender: data.gender,
        contact: data.contact,
        address: data.address || '',
        medicalHistory: data.medicalHistory ? data.medicalHistory.split('\n').filter((h: string) => h.trim() !== '') : [],
        allergies: data.allergies ? data.allergies.split('\n').filter((a: string) => a.trim() !== '') : []
      };
      
      const patientResponse = await addPatient(currentUser.uid, patientData);
      
      // Create prescription
      const prescriptionData = {
        doctorId: currentUser.uid,
        patientId: patientResponse.id,
        patientName: patientData.name,
        visitDate: new Date(data.visitDate),
        symptoms: symptomsArray,
        diagnosis: diagnosisArray,
        medications: data.medications,
        nonPharmacologicalAdvice: nonPharmacologicalAdviceArray,
        labTests: labTestsArray,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        notes: data.notes || '',
        doctorInfo: {
          name: data.doctorInfo.name,
          specialization: data.doctorInfo.specialization,
          licenseNumber: data.doctorInfo.licenseNumber
        },
        clinicInfo: {
          name: data.clinicInfo.name,
          address: data.clinicInfo.address,
          phone: data.clinicInfo.phone,
          email: data.clinicInfo.email || ''
        }
      };
      
      await createPrescription(prescriptionData);
      
      // Navigate to prescriptions page
      navigate('/prescriptions');
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('An error occurred while saving the prescription. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderPreview = () => {
    const data = methods.getValues();
    
    // Transform form data for preview
    const symptoms = data.symptoms.split('\n').filter((s: string) => s.trim() !== '');
    const diagnosis = data.diagnosis.split('\n').filter((d: string) => d.trim() !== '');
    const nonPharmacologicalAdvice = data.nonPharmacologicalAdvice.split('\n').filter((a: string) => a.trim() !== '');
    const labTests = data.labTests ? data.labTests.split('\n').filter((t: string) => t.trim() !== '') : undefined;
    
    const doctor = {
      id: currentUser?.uid || '',
      name: data.doctorInfo.name,
      email: currentUser?.email || '',
      specialization: data.doctorInfo.specialization,
      licenseNumber: data.doctorInfo.licenseNumber,
      contact: '',
      clinicInfo: {
        name: data.clinicInfo.name,
        address: data.clinicInfo.address,
        phone: data.clinicInfo.phone,
        email: data.clinicInfo.email || ''
      },
      createdAt: new Date()
    };
    
    const patient = {
      id: uuidv4(),
      name: data.name,
      age: Number(data.age),
      gender: data.gender as 'male' | 'female' | 'other',
      contact: data.contact,
      address: data.address,
      medicalHistory: data.medicalHistory ? data.medicalHistory.split('\n').filter((h: string) => h.trim() !== '') : undefined,
      allergies: data.allergies ? data.allergies.split('\n').filter((a: string) => a.trim() !== '') : undefined
    };
    
    return (
      <PrescriptionPreview
        doctor={doctor}
        patient={patient}
        visitDate={new Date(data.visitDate)}
        symptoms={symptoms}
        diagnosis={diagnosis}
        medications={data.medications}
        nonPharmacologicalAdvice={nonPharmacologicalAdvice}
        labTests={labTests}
        followUpDate={data.followUpDate ? new Date(data.followUpDate) : undefined}
        notes={data.notes}
      />
    );
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">New Prescription</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new prescription for your patient
        </p>
      </div>
      
      {/* Progress Steps */}
      {!showPreview && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`flex items-center justify-center h-8 w-8 rounded-full ${
                      index < currentStep 
                        ? 'bg-primary-600 text-white' 
                        : index === currentStep 
                          ? 'bg-primary-100 text-primary-600 border-2 border-primary-600' 
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {index < currentStep ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    index <= currentStep ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    index < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-medium text-gray-900">{steps[currentStep].title}</h2>
            <p className="text-sm text-gray-500">{steps[currentStep].description}</p>
          </div>
        </div>
      )}
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {showPreview ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Prescription Preview</h2>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Edit
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`btn-primary ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {saving ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Save size={16} className="mr-1" />
                        Save Prescription
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {renderPreview()}
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                {steps[currentStep].component}
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`btn-secondary ${currentStep === 0 ? 'invisible' : ''}`}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </button>
                
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Eye size={16} className="mr-1" />
                      Preview
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight size={16} className="ml-1" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </FormProvider>
    </MainLayout>
  );
};

export default NewPrescriptionPage;