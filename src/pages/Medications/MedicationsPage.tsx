import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMedicationsByDoctor } from '../../services/firebase';
import { Plus, Search, Pill } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';

const MedicationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMedications = async () => {
      if (!currentUser) return;

      try {
        const medicationsData = await getMedicationsByDoctor(currentUser.uid);
        setMedications(medicationsData);
      } catch (error) {
        console.error('Error fetching medications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [currentUser]);

  const filteredMedications = medications.filter(medication =>
    medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medication.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Medications</h1>
          <Link
            to="/medications/new"
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Medication
          </Link>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Manage your medication database and frequently prescribed drugs.
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
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-500">Loading medications...</p>
          </div>
        ) : filteredMedications.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredMedications.map((medication) => (
              <li key={medication.id}>
                <Link to={`/medications/${medication.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Pill className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-primary-600">{medication.name}</div>
                        <div className="text-sm text-gray-500">
                          {medication.category} • {medication.dosage}
                        </div>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">
                        {medication.frequency}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-10 text-center">
            <Pill className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No medications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try a different search term.' : 'Get started by adding a new medication.'}
            </p>
            {!searchQuery && (
              <div className="mt-6">
                <Link to="/medications/new" className="btn-primary">
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  New Medication
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MedicationsPage; 