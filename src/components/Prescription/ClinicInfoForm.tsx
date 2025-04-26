import React from 'react';
import { useFormContext } from 'react-hook-form';

const ClinicInfoForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 ">
      <div className="input-group">
        <label htmlFor="clinicName" className="input-label">Clinic/Hospital Name</label>
        <input
          id="clinicName"
          type="text"
          {...register('clinicInfo.name', { required: 'Clinic name is required' })}
          placeholder="City Medical Center"
        />
        {errors.clinicInfo?.name && <p className="input-error">{errors.clinicInfo.name.message}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="clinicAddress" className="input-label">Address</label>
        <textarea
          id="clinicAddress"
          {...register('clinicInfo.address', { required: 'Address is required' })}
          rows={3}
          placeholder="123 Healthcare Avenue, Medical District, City, ZIP"
          className="resize-none"
        ></textarea>
        {errors.clinicInfo?.address && <p className="input-error">{errors.clinicInfo.address.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label htmlFor="clinicPhone" className="input-label">Phone Number</label>
          <input
            id="clinicPhone"
            type="tel"
            {...register('clinicInfo.phone', { 
              required: 'Phone number is required',
              pattern: { 
                value: /^[0-9+-\s()]+$/, 
                message: 'Please enter a valid phone number' 
              }
            })}
            placeholder="(123) 456-7890"
          />
          {errors.clinicInfo?.phone && <p className="input-error">{errors.clinicInfo.phone.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="clinicEmail" className="input-label">Email (optional)</label>
          <input
            id="clinicEmail"
            type="email"
            {...register('clinicInfo.email', {
              pattern: { 
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                message: 'Invalid email address' 
              }
            })}
            placeholder="info@citymedical.com"
          />
          {errors.clinicInfo?.email && <p className="input-error">{errors.clinicInfo.email.message}</p>}
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="doctorName" className="input-label">Doctor's Name</label>
        <input
          id="doctorName"
          type="text"
          {...register('doctorInfo.name', { required: 'Doctor name is required' })}
          placeholder="Dr. John Smith"
        />
        {errors.doctorInfo?.name && <p className="input-error">{errors.doctorInfo.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label htmlFor="doctorSpecialization" className="input-label">Specialization</label>
          <input
            id="doctorSpecialization"
            type="text"
            {...register('doctorInfo.specialization', { required: 'Specialization is required' })}
            placeholder="Cardiology, Family Medicine, etc."
          />
          {errors.doctorInfo?.specialization && <p className="input-error">{errors.doctorInfo.specialization.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="doctorLicense" className="input-label">License Number</label>
          <input
            id="doctorLicense"
            type="text"
            {...register('doctorInfo.licenseNumber', { required: 'License number is required' })}
            placeholder="MED12345678"
          />
          {errors.doctorInfo?.licenseNumber && <p className="input-error">{errors.doctorInfo.licenseNumber.message}</p>}
        </div>
      </div>

      <div className="input-group">
        <label className="input-label mb-2">Logo (optional)</label>
        <div className="flex items-center">
          <label className="block cursor-pointer">
            <span className="btn-secondary">Upload Logo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              {...register('logo')}
            />
          </label>
          <span className="ml-3 text-sm text-gray-500">Max size: 2MB, Formats: JPG, PNG</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">Logo will appear in the header of the prescription</p>
      </div>
    </div>
  );
};

export default ClinicInfoForm;