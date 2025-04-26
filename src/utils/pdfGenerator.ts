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
  const margin = 15;
  const pageWidth = doc.internal.pageSize.width;
  let yPos = margin;

  // Helper function for text wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lineHeight * lines.length;
  };


  
  // Add header image if exists
if (doctor.clinic.headerImage) {
  try {
    const img = new Image();
    img.src = doctor.clinic.headerImage;
    await new Promise((resolve) => {
      img.onload = () => {
        // Define desired full page width
        const availableWidth = pageWidth - 2 * margin; // excluding margins
        const imgOriginalWidth = 800;
        const imgOriginalHeight = 200;

        // Maintain aspect ratio
        const imgHeight = (imgOriginalHeight * availableWidth) / imgOriginalWidth;

        // Add image to PDF
        doc.addImage(img, 'JPEG', margin, margin, availableWidth, imgHeight);
        resolve(null);
      };
    });

    // After image is added, move yPos below the image
    yPos = margin + ((200 * (pageWidth - 2 * margin)) / 800) + 10; // Image height + small gap

  } catch (error) {
    console.error('Error loading header image:', error);
  }
}

  


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


  // Medications with Table-like Format
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('Medications', margin, yPos);
yPos += 8;

// Table Header
doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.setFillColor(220, 220, 220); // Light grey background
doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 10, 'F');

// Define column widths
const col1 = margin + 5; // Medicine Name
const col2 = margin + 85; // Dosage
const col3 = margin + 135; // Frequency

doc.text('Medicine Name', col1, yPos);
doc.text('Dosage', col2, yPos);
doc.text('Frequency', col3, yPos);

yPos += 10;

// Table Rows
doc.setFont('helvetica', 'normal');

medications.forEach((med, index) => {
  // Row background (alternating light fill for better readability)
  if (index % 2 === 0) {
    doc.setFillColor(248, 248, 248); // Very light grey
    doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 10, 'F');
  }

  doc.text(med.name, col1, yPos);
  doc.text(med.dosage, col2, yPos);
  doc.text(med.frequency, col3, yPos);

  yPos += 10; // Move to next row
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
