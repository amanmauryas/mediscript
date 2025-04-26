import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getPrescriptionById, getPatientById } from '../../services/firebase';
import { format } from 'date-fns';
import { ArrowLeft, FileText } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import PrescriptionPreview from '../../components/Prescription/PrescriptionPreview';

const PrescriptionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, doctorProfile } = useAuth();
  const [prescription, setPrescription] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      if (!id || !currentUser) return;

      try {
        const prescriptionData = await getPrescriptionById(id);
        setPrescription(prescriptionData);

        if (prescriptionData.patientId) {
          const patientData = await getPatientById(prescriptionData.patientId);
          setPatient(patientData);
        }
      } catch (error) {
        console.error('Error fetching prescription data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptionData();
  }, [id, currentUser]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!prescription || !patient || !doctorProfile) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Prescription not found</h2>
          <p className="mt-2 text-gray-600">The prescription you're looking for doesn't exist or has been removed.</p>
          <Link to="/prescriptions" className="mt-4 btn-primary inline-block">
            Back to Prescriptions
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/prescriptions" className="mr-4 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Prescription Details</h1>
              <p className="mt-1 text-sm text-gray-500">
                {format(prescription.visitDate.toDate(), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <PrescriptionPreview
        doctor={doctorProfile}
        patient={patient}
        visitDate={prescription.visitDate.toDate()}
        symptoms={prescription.symptoms}
        diagnosis={prescription.diagnosis}
        medications={prescription.medications}
        nonPharmacologicalAdvice={prescription.nonPharmacologicalAdvice || []}
        labTests={prescription.labTests}
        followUpDate={prescription.followUpDate?.toDate()}
        notes={prescription.notes}
      />
    </MainLayout>
  );
};

export default PrescriptionDetailsPage; 