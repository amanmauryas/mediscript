import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMedicationsByDoctor, importMedicinesFromCSV } from '../../services/firebase';
import MainLayout from '../../components/Layout/MainLayout';
import { Plus, Search, Pill, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const MedicinesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      if (!currentUser) return;

      try {
        const medicinesData = await getMedicationsByDoctor(currentUser.uid);
        setMedicines(medicinesData);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [currentUser]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvData = e.target?.result as string;
        const count = await importMedicinesFromCSV(currentUser.uid, csvData);
        alert(`Successfully imported ${count} medicines`);
        // Refresh the medicines list
        const medicinesData = await getMedicationsByDoctor(currentUser.uid);
        setMedicines(medicinesData);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing medicines:', error);
      alert('Error importing medicines. Please check the CSV format.');
    } finally {
      setImporting(false);
    }
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Medicines</h1>
          <div className="flex space-x-3">
            <label className="btn-secondary flex items-center cursor-pointer">
              <Upload className="h-5 w-5 mr-2" />
              Import CSV
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
                disabled={importing}
              />
            </label>
            <Link
              to="/medicines/new"
              className="btn-primary flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Medicine
            </Link>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Manage your medicine database and prescriptions.
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
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-500">Loading medicines...</p>
          </div>
        ) : filteredMedicines.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredMedicines.map((medicine) => (
              <li key={medicine.id}>
                <Link to={`/medicines/${medicine.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Pill className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-primary-600">{medicine.name}</div>
                        <div className="text-sm text-gray-500">
                          {medicine.category} • {medicine.dosage}
                        </div>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">
                        Last used: {medicine.lastUsed ? new Date(medicine.lastUsed).toLocaleDateString() : 'Never'}
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No medicines found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try a different search term.' : 'Get started by importing medicines or adding a new one.'}
            </p>
            {!searchQuery && (
              <div className="mt-6 space-x-3">
                <label className="btn-secondary inline-flex items-center cursor-pointer">
                  <Upload className="h-5 w-5 mr-2" />
                  Import CSV
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={importing}
                  />
                </label>
                <Link to="/medicines/new" className="btn-primary inline-flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  New Medicine
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MedicinesPage; 