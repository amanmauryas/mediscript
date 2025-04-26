import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PatientFormData } from '../../types';

const PatientInfoForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<PatientFormData>();

  return (
    <div className="space-y-6 shadow-lg rounded-lg bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label htmlFor="name" className="input-label">Patient Name</label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Patient name is required' })}
            placeholder="John Doe"
          />
          {errors.name && <p className="input-error">{errors.name.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="age" className="input-label">Age</label>
          <input
            id="age"
            type="number"
            {...register('age', { 
              required: 'Age is required',
              min: { value: 0, message: 'Age must be a positive number' },
              max: { value: 120, message: 'Age must be less than 120' }
            })}
            placeholder="35"
          />
          {errors.age && <p className="input-error">{errors.age.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label htmlFor="gender" className="input-label">Gender</label>
          <select
            id="gender"
            {...register('gender', { required: 'Gender is required' })}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="input-error">{errors.gender.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="contact" className="input-label">Contact Number</label>
          <input
            id="contact"
            type="tel"
            {...register('contact', { 
              required: 'Contact number is required',
              pattern: { 
                value: /^[0-9+-\s()]+$/, 
                message: 'Please enter a valid phone number' 
              }
            })}
            placeholder="(123) 456-7890"
          />
          {errors.contact && <p className="input-error">{errors.contact.message}</p>}
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="address" className="input-label">Address (optional)</label>
        <input
          id="address"
          type="text"
          {...register('address')}
          placeholder="123 Main St, City, State, Zip"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label htmlFor="allergies" className="input-label">
            Known Allergies (optional)
          </label>
          <textarea
            id="allergies"
            {...register('allergies')}
            rows={3}
            placeholder="Penicillin, Sulfa drugs, etc."
            className="resize-none"
          ></textarea>
        </div>

        <div className="input-group">
          <label htmlFor="medicalHistory" className="input-label">
            Medical History (optional)
          </label>
          <textarea
            id="medicalHistory"
            {...register('medicalHistory')}
            rows={3}
            placeholder="Hypertension, Diabetes, etc."
            className="resize-none"
          ></textarea>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label htmlFor="visitDate" className="input-label">Visit Date</label>
          <input
            id="visitDate"
            type="date"
            {...register('visitDate', { required: 'Visit date is required' })}
          />
          {errors.visitDate && <p className="input-error">{errors.visitDate.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="input-group">
          <label htmlFor="symptoms" className="input-label">Presenting Symptoms</label>
          <textarea
            id="symptoms"
            {...register('symptoms', { required: 'Symptoms are required' })}
            rows={3}
            placeholder="Fever, cough, etc."
            className="resize-none"
          ></textarea>
          {errors.symptoms && <p className="input-error">{errors.symptoms.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="diagnosis" className="input-label">Diagnosis</label>
          <textarea
            id="diagnosis"
            {...register('diagnosis', { required: 'Diagnosis is required' })}
            rows={3}
            placeholder="Acute upper respiratory infection, etc."
            className="resize-none"
          ></textarea>
          {errors.diagnosis && <p className="input-error">{errors.diagnosis.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default PatientInfoForm;