import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AdviceFormData } from '../../types';

const AdviceForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<AdviceFormData>();
  
  return (
    <div className="space-y-6">
      <div className="input-group">
        <label htmlFor="nonPharmacologicalAdvice" className="input-label">
          Non-Pharmacological Advice
        </label>
        <textarea
          id="nonPharmacologicalAdvice"
          {...register('nonPharmacologicalAdvice', { 
            required: 'Please provide some non-pharmacological advice' 
          })}
          rows={4}
          placeholder="Rest for 3 days, hydrate well, avoid strenuous activity, etc."
          className="resize-none"
        ></textarea>
        {errors.nonPharmacologicalAdvice && (
          <p className="input-error">{errors.nonPharmacologicalAdvice.message}</p>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="labTests" className="input-label">
          Lab Tests (optional)
        </label>
        <textarea
          id="labTests"
          {...register('labTests')}
          rows={3}
          placeholder="Complete blood count (CBC), Liver function tests, etc."
          className="resize-none"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label htmlFor="followUpDate" className="input-label">
            Follow-up Date (optional)
          </label>
          <input
            id="followUpDate"
            type="date"
            {...register('followUpDate')}
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="notes" className="input-label">
          Additional Notes (optional)
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          placeholder="Any additional instructions or notes for the patient..."
          className="resize-none"
        ></textarea>
      </div>
    </div>
  );
};

export default AdviceForm;