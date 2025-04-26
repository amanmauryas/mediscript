import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import MedicineSuggestions from './MedicineSuggestions';
import { Medicine } from '../../types';

const MedicationForm: React.FC = () => {
  const { register, control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications'
  });

  const handleMedicineSelect = (medicine: Medicine, index: number) => {
    setValue(`medications.${index}.name`, medicine.name);
    setValue(`medications.${index}.dosage`, medicine.dosage);
    setValue(`medications.${index}.frequency`, medicine.frequency);
    setValue(`medications.${index}.instructions`, medicine.instructions);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Medications</h3>
        <button
          type="button"
          onClick={() => append({ name: '', dosage: '', frequency: '', route: 'Oral', duration: '', instructions: '' })}
          className="btn-secondary flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Medication
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field: any, index) => (
          <div key={field.id} className="relative p-4 border rounded-lg">
            <div className="absolute top-2 right-2">
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Medication Name
                </label>
                <input
                  type="text"
                  {...register(`medications.${index}.name`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="e.g., Paracetamol"
                />
                <MedicineSuggestions
                  searchQuery={field.name}
                  onSelect={(medicine) => handleMedicineSelect(medicine, index)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dosage
                </label>
                <input
                  type="text"
                  {...register(`medications.${index}.dosage`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="e.g., 500mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Frequency
                </label>
                <input
                  type="text"
                  {...register(`medications.${index}.frequency`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="e.g., 1-0-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <input
                  type="text"
                  {...register(`medications.${index}.duration`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="e.g., 5 days"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Instructions
                </label>
                <input
                  type="text"
                  {...register(`medications.${index}.instructions`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="e.g., After meals"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationForm;