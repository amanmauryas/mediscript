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

  // Add watermark
  doc.setTextColor(240, 240, 240);
  doc.setFontSize(60);
  doc.text('PRESCRIPTION', pageWidth / 2, pageWidth / 2, { angle: 45, align: 'center' });
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  // Header - Clinic Info with border
  doc.setDrawColor(15, 82, 186);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 30);
  
  // Add header image if exists
  if (doctor.clinic.headerImage) {
    try {
      const img = new Image();
      img.src = doctor.clinic.headerImage;
      await new Promise((resolve) => {
        img.onload = () => {
          const imgWidth = 40;
          const imgHeight = (img.height * imgWidth) / img.width;
          doc.addImage(img, 'JPEG', margin + 5, yPos + 5, imgWidth, imgHeight);
          resolve(null);
        };
      });
    } catch (error) {
      console.error('Error loading header image:', error);
    }
  }
  
  doc.setFontSize(16);
  doc.setTextColor(15, 82, 186);
  doc.setFont('helvetica', 'bold');
  doc.text(doctor.clinic.name, margin + 5, yPos + 8);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  yPos = addWrappedText(doctor.clinic.address, margin + 5, yPos + 15, pageWidth - 2 * margin - 10, 5);
  
  doc.text(`Phone: ${doctor.clinic.phone}${doctor.clinic.email ? ` | Email: ${doctor.clinic.email}` : ''}`, margin + 5, yPos);
  yPos += 15;

  // Doctor Info with background
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 20, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(doctor.name, margin + 5, yPos + 8);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(doctor.specialization, margin + 5, yPos + 15);
  doc.text(`License: ${doctor.licenseNumber}`, pageWidth - margin - 5, yPos + 15, { align: 'right' });
  yPos += 25;

  // Patient Info with border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 25);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Information', margin + 5, yPos + 8);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${patient.name}`, margin + 5, yPos + 15);
  doc.text(`Age/Gender: ${patient.age} years / ${patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}`, margin + 5, yPos + 20);
  if (patient.contact) {
    doc.text(`Contact: ${patient.contact}`, pageWidth - margin - 5, yPos + 15, { align: 'right' });
  }
  doc.text(`Date: ${format(visitDate, 'MMMM d, yyyy')}`, pageWidth - margin - 5, yPos + 20, { align: 'right' });
  yPos += 30;

  // Symptoms & Diagnosis in two columns with headers
  const halfWidth = (pageWidth - 2 * margin - 10) / 2;
  
  // Symptoms
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos, halfWidth, 8, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Symptoms', margin + 5, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const symptomText = symptoms.map(s => `• ${s}`).join('\n');
  const symptomsLines = doc.splitTextToSize(symptomText, halfWidth - 10);
  doc.text(symptomsLines, margin + 5, yPos + 15);
  
  // Diagnosis
  doc.setFillColor(240, 240, 240);
  doc.rect(margin + halfWidth + 10, yPos, halfWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnosis', margin + halfWidth + 15, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  const diagnosisText = diagnosis.map(d => `• ${d}`).join('\n');
  const diagnosisLines = doc.splitTextToSize(diagnosisText, halfWidth - 10);
  doc.text(diagnosisLines, margin + halfWidth + 15, yPos + 15);
  
  // Calculate height for next section
  const symptomsHeight = symptomsLines.length * 5;
  const diagnosisHeight = diagnosisLines.length * 5;
  yPos += Math.max(symptomsHeight, diagnosisHeight) + 20;

  // Rx Symbol with decorative line
  doc.setDrawColor(15, 82, 186);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('℞', margin + 5, yPos + 8);
  yPos += 15;

  // Medications with table-like format
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Medications', margin, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  medications.forEach((med, index) => {
    // Draw a light background for each medication
    doc.setFillColor(248, 248, 248);
    doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 20, 'F');
    
    doc.text(`${index + 1}. ${med.name}`, margin + 5, yPos);
    doc.text(`Dosage: ${med.dosage}`, margin + 5, yPos + 5);
    doc.text(`Frequency: ${med.frequency}`, margin + 5, yPos + 10);
    
    if (med.instructions) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      yPos = addWrappedText(`Instructions: ${med.instructions}`, margin + 5, yPos + 15, pageWidth - 2 * margin - 10, 4);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
    }
    
    yPos += 5;
  });

  // Non-Pharmacological Advice with icon
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Advice', margin, yPos + 5);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  nonPharmacologicalAdvice.forEach((advice, index) => {
    yPos = addWrappedText(`• ${advice}`, margin + 5, yPos, pageWidth - 2 * margin - 10, 5);
  });
  yPos += 10;

  // Check if we need to add a new page for remaining content
  if (yPos > doc.internal.pageSize.height - 60) {
    doc.addPage();
    yPos = margin;
  }

  // Lab Tests with icon
  if (labTests && labTests.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Laboratory Tests', margin, yPos + 5);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    labTests.forEach((test, index) => {
      yPos = addWrappedText(`• ${test}`, margin + 5, yPos, pageWidth - 2 * margin - 10, 5);
    });
    yPos += 10;
  }

  // Follow-up with icon
  if (followUpDate) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Follow-up', margin, yPos + 5);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${format(followUpDate, 'MMMM d, yyyy')}`, margin + 5, yPos);
    yPos += 10;
  }

  // Notes with icon
  if (notes) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes', margin, yPos + 5);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    yPos = addWrappedText(notes, margin + 5, yPos, pageWidth - 2 * margin - 10, 5);
  }

  // Footer with signature line
  const footerY = doc.internal.pageSize.height - 30;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setFontSize(10);
  doc.text('Doctor\'s Signature', margin + 5, footerY + 10);
  doc.text('Date: ' + format(visitDate, 'MMMM d, yyyy'), pageWidth - margin - 5, footerY + 10, { align: 'right' });

  // Add page number
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 5, doc.internal.pageSize.height - 5, { align: 'right' });
  }

  return doc.output('arraybuffer');
};