import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getPrescriptionsByDoctor } from '../../services/firebase';
import { format } from 'date-fns';
import { FileText, Plus, Search, Edit } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';

const PrescriptionsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!currentUser) return;

      try {
        const prescriptionsData = await getPrescriptionsByDoctor(currentUser.uid);
        setPrescriptions(prescriptionsData);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [currentUser]);

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.diagnosis?.some((d: string) => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Prescriptions</h1>
          <Link
            to="/prescriptions/new"
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Prescription
          </Link>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all your prescriptions.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search prescriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-500">Loading prescriptions...</p>
          </div>
        ) : filteredPrescriptions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredPrescriptions.map((prescription) => (
              <li key={prescription.id}>
                <Link to={`/prescriptions/${prescription.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-primary-600">{prescription.patientName}</div>
                        <div className="text-sm text-gray-500">
                          {prescription.diagnosis?.join(', ')}
                        </div>
                      </div>
                      <div className="ml-auto flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          {format(prescription.visitDate.toDate(), 'MMM d, yyyy')}
                        </div>
                        <Link
                          to={`/prescriptions/${prescription.id}/edit`}
                          className="text-gray-400 hover:text-primary-600"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try a different search term.' : 'Get started by creating a new prescription.'}
            </p>
            {!searchQuery && (
              <div className="mt-6">
                <Link to="/prescriptions/new" className="btn-primary">
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  New Prescription
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PrescriptionsPage; 