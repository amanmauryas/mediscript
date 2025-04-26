import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { Doctor, Patient, Medication } from '../types';

interface PrescriptionData {
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

export const generatePDF = async (data: PrescriptionData): Promise<Uint8Array> => {
  const {
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
  } = data;

  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set font styles
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Page margins
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  let yPos = margin;

  // Helper function for text wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lineHeight * lines.length;
  };

  // Header - Clinic Info
  doc.setFontSize(16);
  doc.setTextColor(15, 82, 186); // Primary color
  doc.setFont('helvetica', 'bold');
  doc.text(doctor.clinicInfo.name, margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  yPos = addWrappedText(doctor.clinicInfo.address, margin, yPos, pageWidth - 2 * margin, 5);
  yPos += 5;
  
  doc.text(`Phone: ${doctor.clinicInfo.phone}${doctor.clinicInfo.email ? ` | Email: ${doctor.clinicInfo.email}` : ''}`, margin, yPos);
  yPos += 10;

  // Horizontal line
  doc.setDrawColor(15, 82, 186);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Doctor Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(doctor.name, margin, yPos);
  yPos += 5;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(doctor.specialization, margin, yPos);
  yPos += 5;
  
  doc.text(`License: ${doctor.licenseNumber}`, margin, yPos);
  yPos += 10;

  // Patient Info
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 5;

  doc.setFontSize(10);
  doc.text(`Patient: ${patient.name}`, margin, yPos);
  doc.text(`Date: ${format(visitDate, 'MMMM d, yyyy')}`, pageWidth - margin - 60, yPos);
  yPos += 5;
  
  doc.text(`Age/Gender: ${patient.age} years / ${patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}`, margin, yPos);
  if (patient.contact) {
    doc.text(`Contact: ${patient.contact}`, pageWidth - margin - 60, yPos);
  }
  yPos += 5;

  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Symptoms & Diagnosis
  const halfWidth = (pageWidth - 2 * margin - 10) / 2;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Symptoms', margin, yPos);
  doc.text('Diagnosis', margin + halfWidth + 10, yPos);
  yPos += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Prepare symptom and diagnosis text
  const symptomText = symptoms.map(s => `• ${s}`).join('\n');
  const diagnosisText = diagnosis.map(d => `• ${d}`).join('\n');

  // Get the heights after wrapping
  const symptomsLines = doc.splitTextToSize(symptomText, halfWidth);
  const diagnosisLines = doc.splitTextToSize(diagnosisText, halfWidth);
  const symptomsHeight = symptomsLines.length * 5;
  const diagnosisHeight = diagnosisLines.length * 5;

  // Use the greater height
  const maxHeight = Math.max(symptomsHeight, diagnosisHeight);

  // Add the text
  doc.text(symptomsLines, margin, yPos);
  doc.text(diagnosisLines, margin + halfWidth + 10, yPos);
  yPos += maxHeight + 10;

  // Rx Symbol
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('℞', margin, yPos);
  yPos += 10;

  // Medications
  doc.setFontSize(11);
  doc.text('Medications', margin, yPos);
  yPos += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  medications.forEach((med, index) => {
    doc.text(`${index + 1}. ${med.name} - ${med.dosage}`, margin, yPos);
    yPos += 5;
    doc.text(`   ${med.frequency} | ${med.route} | Duration: ${med.duration}`, margin, yPos);
    yPos += 5;
    
    if (med.instructions) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      yPos = addWrappedText(`   ${med.instructions}`, margin, yPos, pageWidth - 2 * margin, 4);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
    }
    
    yPos += 5;
  });

  // Non-Pharmacological Advice
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Advice', margin, yPos);
  yPos += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  nonPharmacologicalAdvice.forEach((advice, index) => {
    yPos = addWrappedText(`• ${advice}`, margin, yPos, pageWidth - 2 * margin, 5);
  });
  yPos += 10;

  // Check if we need to add a new page for remaining content
  if (yPos > doc.internal.pageSize.height - 60) {
    doc.addPage();
    yPos = margin;
  }

  // Lab Tests
  if (labTests && labTests.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Laboratory Tests', margin, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    labTests.forEach((test, index) => {
      yPos = addWrappedText(`• ${test}`, margin, yPos, pageWidth - 2 * margin, 5);
    });
    yPos += 10;
  }

  // Follow-up
  if (followUpDate) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Follow-up', margin, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Please return for follow-up on ${format(followUpDate, 'MMMM d, yyyy')}`, margin, yPos);
    yPos += 10;
  }

  // Additional Notes
  if (notes) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes', margin, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    yPos = addWrappedText(notes, margin, yPos, pageWidth - 2 * margin, 5);
    yPos += 10;
  }

  // Signature
  const signatureX = pageWidth - margin - 40;
  yPos += 15;
  doc.line(signatureX, yPos, pageWidth - margin, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.text(doctor.name, signatureX + (pageWidth - margin - signatureX) / 2 - 10, yPos, { align: 'center' });
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(doctor.specialization, signatureX + (pageWidth - margin - signatureX) / 2 - 10, yPos, { align: 'center' });

  // Footer
  const footerY = doc.internal.pageSize.height - 20;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This prescription is valid for 30 days from the date of issue.', pageWidth / 2, footerY - 5, { align: 'center' });
  doc.text('Keep all medications out of reach of children.', pageWidth / 2, footerY, { align: 'center' });

  // Output PDF
  return doc.output('arraybuffer');
};