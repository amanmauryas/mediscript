import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { createTemplate } from '../../services/firebase';
import MainLayout from '../../components/Layout/MainLayout';
import { Plus, X } from 'lucide-react';

const NewTemplatePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      category: '',
      description: '',
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
      notes: ''
    }
  });

  const onSubmit = async (data: any) => {
    if (!currentUser) return;
    
    setSaving(true);
    
    try {
      const templateData = {
        doctorId: currentUser.uid,
        name: data.name,
        category: data.category,
        description: data.description,
        medications: data.medications,
        nonPharmacologicalAdvice: data.nonPharmacologicalAdvice.split('\n').filter((a: string) => a.trim() !== ''),
        labTests: data.labTests ? data.labTests.split('\n').filter((t: string) => t.trim() !== '') : [],
        notes: data.notes || '',
        lastUsed: null
      };
      
      await createTemplate(templateData);
      navigate('/templates');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('An error occurred while saving the template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">New Template</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new prescription template for common conditions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Template Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Template name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="e.g., Common Cold, Diabetes Management"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                id="category"
                {...register('category', { required: 'Category is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="e.g., General Medicine, Pediatrics"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Brief description of when to use this template"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Medications</h2>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Medication Name
                  </label>
                  <input
                    type="text"
                    {...register(`medications.${index}.name`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="e.g., Paracetamol"
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
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="nonPharmacologicalAdvice" className="block text-sm font-medium text-gray-700">
                Non-Pharmacological Advice
              </label>
              <textarea
                id="nonPharmacologicalAdvice"
                {...register('nonPharmacologicalAdvice')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Enter advice points (one per line)"
              />
            </div>

            <div>
              <label htmlFor="labTests" className="block text-sm font-medium text-gray-700">
                Laboratory Tests
              </label>
              <textarea
                id="labTests"
                {...register('labTests')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Enter lab tests (one per line)"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                {...register('notes')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Additional notes or instructions"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/templates')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </form>
    </MainLayout>
  );
};

export default NewTemplatePage; 