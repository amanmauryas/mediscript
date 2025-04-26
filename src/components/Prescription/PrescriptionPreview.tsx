import React from 'react';
import { format } from 'date-fns';
import { Printer, Download, Copy } from 'lucide-react';
import { Doctor, Patient, Medication } from '../../types';
import { generatePDF } from '../../utils/pdfGenerator';

interface PrescriptionPreviewProps {
  doctor: Doctor;
  patient: Patient;
  visitDate: Date;
  symptoms: string[];
  diagnosis: string[];
  medications: Medication[];
  nonPharmacologicalAdvice: string[];
  labTests?: string[];
  followUpDate?: Date;
  notes?: string;
}

const PrescriptionPreview: React.FC<PrescriptionPreviewProps> = ({
  doctor,
  patient,
  visitDate,
  symptoms,
  diagnosis,
  medications,
  nonPharmacologicalAdvice,
  labTests,
  followUpDate,
  notes
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      const pdfData = await generatePDF({
        doctor,
        patient,
        visitDate,
        symptoms,
        diagnosis,
        medications,
        nonPharmacologicalAdvice,
        labTests,
        followUpDate,
        notes
      });
      
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Prescription_${patient.name}_${format(visitDate, 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="relative">
      {/* Actions bar */}
      <div className="top-0 z-10 bg-white p-3 border-b border-gray-200 flex justify-end space-x-2 no-print">
        <button 
          onClick={handleDownload}
          className="btn-primary flex items-center"
        >
          <Download size={16} className="mr-1" />
          Download PDF
        </button>
      </div>

      {/* Prescription preview */}
      <div className="p-8 bg-white border border-gray-200 shadow-lg prescription-preview">
  

        {/* Patient Info */}
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">Patient:</span> {patient.name}</p>
              <p><span className="font-semibold">Age/Gender:</span> {patient.age} years / {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</p>
            </div>
            <div className="text-right">
              <p><span className="font-semibold">Date:</span> {format(visitDate, 'MMMM d, yyyy')}</p>
              {patient.contact && <p><span className="font-semibold">Contact:</span> {patient.contact}</p>}
            </div>
          </div>
        </div>

        {/* Symptoms & Diagnosis */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Symptoms</h3>
              <ul className="list-disc list-inside text-gray-700">
                {symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Diagnosis</h3>
              <ul className="list-disc list-inside text-gray-700">
                {diagnosis.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Rx Symbol */}
        <div className="mb-6">
          <div className="text-2xl font-bold text-primary-600">℞</div>
        </div>

        {/* Medications */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Medications</h3>
          {medications.map((medication, index) => (
            <div key={index} className="mb-4 pb-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start">
                <span className="text-gray-600 mr-2">{index + 1}.</span>
                <div className="flex-1">
                  <p className="font-medium">{medication.name} - {medication.dosage}</p>
                  <p className="text-gray-700">{medication.frequency}</p>
                  {medication.instructions && (
                    <p className="text-gray-600 text-sm mt-1 italic">{medication.instructions}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Non-Pharmacological Advice */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Advice</h3>
          <ul className="list-disc list-inside text-gray-700">
            {nonPharmacologicalAdvice.map((advice, index) => (
              <li key={index}>{advice}</li>
            ))}
          </ul>
        </div>

        {/* Lab Tests */}
        {labTests && labTests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Laboratory Tests</h3>
            <ul className="list-disc list-inside text-gray-700">
              {labTests.map((test, index) => (
                <li key={index}>{test}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Follow-up */}
        {followUpDate && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Follow-up</h3>
            <p className="text-gray-700">Please return for follow-up on {format(followUpDate, 'MMMM d, yyyy')}</p>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="text-gray-700">{notes}</p>
          </div>
        )}

        {/* Signature */}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <div className="flex justify-end">
            <div className="text-center">
              <div className="border-t border-gray-400 w-48 mb-2"></div>
              <p className="font-semibold">{doctor.name}</p>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
              <p className="text-sm text-gray-600">License: {doctor.licenseNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPreview;
