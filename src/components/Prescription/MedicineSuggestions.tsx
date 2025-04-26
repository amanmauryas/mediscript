import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMedicationsByDoctor } from '../../services/firebase';
import { Pill } from 'lucide-react';
import { Medicine } from '../../types';

interface MedicineSuggestionsProps {
  onSelect: (medicine: Medicine) => void;
  searchQuery: string;
}

const MedicineSuggestions: React.FC<MedicineSuggestionsProps> = ({ onSelect, searchQuery }) => {
  const { currentUser } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      if (!currentUser || !searchQuery) return;

      setLoading(true);
      try {
        const medicinesData = await getMedicationsByDoctor(currentUser.uid);
        const filteredMedicines = medicinesData.filter(medicine =>
          medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setMedicines(filteredMedicines);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchMedicines, 300);
    return () => clearTimeout(debounceTimer);
  }, [currentUser, searchQuery]);

  const handleSelect = (medicine: Medicine) => {
    onSelect(medicine);
    setShowSuggestions(false);
  };

  if (!showSuggestions || !searchQuery) return null;

  return (
    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
      {loading ? (
        <div className="p-2 text-center text-sm text-gray-500">Loading...</div>
      ) : medicines.length > 0 ? (
        <ul className="py-1">
          {medicines.map((medicine) => (
            <li
              key={medicine.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleSelect(medicine)}
            >
              <Pill className="h-4 w-4 text-primary-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                <div className="text-xs text-gray-500">
                  {medicine.category} • {medicine.dosage}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-2 text-center text-sm text-gray-500">No medicines found</div>
      )}
    </div>
  );
};

export default MedicineSuggestions; 