
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Generate a PDF from a given HTML element
 * @param element The HTML element to convert to PDF
 * @param filename The name of the PDF file
 * @param options Configuration options for the PDF generation
 * @returns Promise that resolves when the PDF is generated and saved
 */
export const generatePDF = async (
  element: HTMLElement,
  filename: string,
  options: {
    format?: 'a4' | 'a5' | 'letter' | 'legal';
    orientation?: 'portrait' | 'landscape';
    quality?: number;
    scale?: number;
  } = {}
): Promise<void> => {
  // Default options
  const {
    format = 'a4',
    orientation = 'portrait',
    quality = 0.95,
    scale = 2
  } = options;

  // Add a small delay to ensure DOM is fully rendered
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Create canvas from HTML element
  const canvas = await html2canvas(element, {
    scale: scale,
    logging: false,
    useCORS: true,
    backgroundColor: "#ffffff",
    allowTaint: false,
    removeContainer: true
  });
  
  // Create new PDF document
  const pdf = new jsPDF({
    orientation: orientation,
    unit: 'mm',
    format: format,
    compress: true
  });
  
  // Calculate dimensions
  const pageWidth = format === 'a5' ? 148 : 210; // A5 or A4 width
  const imgHeight = canvas.height * pageWidth / canvas.width;
  
  // Convert canvas to JPEG data URL
  const imgData = canvas.toDataURL('image/jpeg', quality);
  
  // Add image to PDF
  pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight);
  
  // Save the PDF
  pdf.save(filename);
};
