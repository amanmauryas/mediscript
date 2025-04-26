import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { MedicationFormData } from '../../types';

const MedicationForm: React.FC = () => {
  const { control, register, formState: { errors } } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications'
  });

  const addMedication = () => {
    append({
      name: '',
      dosage: '',
      frequency: '',
      route: 'Oral',
      duration: '',
      instructions: ''
    });
  };

  // Default routes of administration
  const routes = [
    'Oral',
    'Intravenous (IV)',
    'Intramuscular (IM)',
    'Subcutaneous (SC)',
    'Topical',
    'Inhalation',
    'Sublingual',
    'Rectal',
    'Ophthalmic',
    'Otic',
    'Nasal',
    'Transdermal'
  ];

  // Common frequencies
  const frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Before meals',
    'After meals',
    'At bedtime'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Medications</h3>
        <button 
          type="button" 
          onClick={addMedication}
          className="btn-primary flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Add Medication
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-md">
          <p className="text-gray-500">No medications added. Click 'Add Medication' to start.</p>
        </div>
      )}

      {fields.map((field, index) => (
        <div 
          key={field.id} 
          className="p-5 border border-gray-200 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow animate-slide-up"
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Medication #{index + 1}</h4>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-gray-400 hover:text-error-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">
                Medication Name
              </label>
              <input
                {...register(`medications.${index}.name`, { 
                  required: 'Medication name is required' 
                })}
                placeholder="e.g., Amoxicillin"
              />
              {errors.medications?.[index]?.name && (
                <p className="input-error">
                  {errors.medications[index]?.name?.message}
                </p>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">
                Dosage
              </label>
              <input
                {...register(`medications.${index}.dosage`, { 
                  required: 'Dosage is required' 
                })}
                placeholder="e.g., 500mg"
              />
              {errors.medications?.[index]?.dosage && (
                <p className="input-error">
                  {errors.medications[index]?.dosage?.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="input-group">
              <label className="input-label">
                Frequency
              </label>
              <input
                list={`frequency-list-${index}`}
                {...register(`medications.${index}.frequency`, { 
                  required: 'Frequency is required' 
                })}
                placeholder="e.g., Twice daily"
              />
              <datalist id={`frequency-list-${index}`}>
                {frequencies.map((freq) => (
                  <option key={freq} value={freq} />
                ))}
              </datalist>
              {errors.medications?.[index]?.frequency && (
                <p className="input-error">
                  {errors.medications[index]?.frequency?.message}
                </p>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">
                Route
              </label>
              <select
                {...register(`medications.${index}.route`, { 
                  required: 'Route is required' 
                })}
              >
                {routes.map((route) => (
                  <option key={route} value={route}>
                    {route}
                  </option>
                ))}
              </select>
              {errors.medications?.[index]?.route && (
                <p className="input-error">
                  {errors.medications[index]?.route?.message}
                </p>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">
                Duration
              </label>
              <input
                {...register(`medications.${index}.duration`, { 
                  required: 'Duration is required' 
                })}
                placeholder="e.g., 7 days"
              />
              {errors.medications?.[index]?.duration && (
                <p className="input-error">
                  {errors.medications[index]?.duration?.message}
                </p>
              )}
            </div>
          </div>

          <div className="input-group mb-0">
            <label className="input-label">
              Special Instructions (optional)
            </label>
            <textarea
              {...register(`medications.${index}.instructions`)}
              rows={2}
              placeholder="e.g., Take with food to avoid stomach upset"
              className="resize-none"
            ></textarea>
          </div>
        </div>
      ))}

      {fields.length > 0 && (
        <button 
          type="button" 
          onClick={addMedication}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
        >
          <Plus size={16} className="inline mr-1" />
          Add Another Medication
        </button>
      )}
    </div>
  );
};

export default MedicationForm;