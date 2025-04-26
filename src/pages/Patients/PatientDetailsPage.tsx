import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getPatientById, getPrescriptionsByPatient } from '../../services/firebase';
import { format } from 'date-fns';
import { User, FileText, Plus } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [patient, setPatient] = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id || !currentUser) return;

      try {
        const patientData = await getPatientById(id);
        setPatient(patientData);

        const prescriptionsData = await getPrescriptionsByPatient(id);
        setPrescriptions(prescriptionsData);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
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

  if (!patient) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Patient not found</h2>
          <p className="mt-2 text-gray-600">The patient you're looking for doesn't exist or has been removed.</p>
          <Link to="/patients" className="mt-4 btn-primary inline-block">
            Back to Patients
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Patient Details</h1>
          <Link
            to={`/prescriptions/new?patientId=${patient.id}`}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Prescription
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient Information */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
                <p className="text-gray-600">{patient.age} years • {patient.gender}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                <p className="mt-1 text-gray-900">{patient.contact}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1 text-gray-900">{patient.address}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Blood Group</h3>
                <p className="mt-1 text-gray-900">{patient.bloodGroup}</p>
              </div>

              {patient.allergies && patient.allergies.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Allergies</h3>
                  <ul className="mt-1 list-disc list-inside text-gray-900">
                    {patient.allergies.map((allergy: string, index: number) => (
                      <li key={index}>{allergy}</li>
                    ))}
                  </ul>
                </div>
              )}

              {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Medical History</h3>
                  <ul className="mt-1 list-disc list-inside text-gray-900">
                    {patient.medicalHistory.map((history: string, index: number) => (
                      <li key={index}>{history}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prescriptions */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Prescriptions</h2>
            </div>

            {prescriptions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {prescriptions.map((prescription) => (
                  <li key={prescription.id}>
                    <Link to={`/prescriptions/${prescription.id}`} className="block hover:bg-gray-50">
                      <div className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-primary-600">
                              {format(prescription.visitDate.toDate(), 'MMMM d, yyyy')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {prescription.diagnosis.join(', ')}
                            </div>
                          </div>
                          <div className="ml-auto text-sm text-gray-500">
                            {prescription.medications.length} medications
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new prescription.</p>
                <div className="mt-6">
                  <Link
                    to={`/prescriptions/new?patientId=${patient.id}`}
                    className="btn-primary"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    New Prescription
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientDetailsPage; 