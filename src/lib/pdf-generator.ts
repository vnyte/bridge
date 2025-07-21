'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface BulkPDFOptions {
  filename?: string;
  quality?: number;
}

export interface FormData {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  clientCode: string;
  phoneNumber?: string | null;
  email?: string | null;
  aadhaarNumber: string;
  panNumber?: string | null;
  birthDate?: string | null;
  bloodGroup?: string | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  guardianFirstName?: string | null;
  guardianMiddleName?: string | null;
  guardianLastName?: string | null;
  photoUrl?: string | null;
  signatureUrl?: string | null;
  learningLicenseNumber?: string | null;
  learningLicenseIssueDate?: string | null;
  learningLicenseExpiryDate?: string | null;
  learningLicenseClass?: string[] | null;
}

export const generateForm4HTML = (clientData: FormData): string => {
  const formatName = (first?: string | null, middle?: string | null, last?: string | null) => {
    return [first, middle, last].filter(Boolean).join(' ');
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Times New Roman', serif;
          background: white;
          color: black;
          line-height: 1.2;
        }
        
        .page {
          width: 794px;
          max-width: 794px;
          padding: 40px;
          background: white;
          margin: 0;
          box-sizing: border-box;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 8px;
          color: black;
        }
        
        .header h2 {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
          color: black;
        }
        
        .header p {
          font-size: 14px;
          color: black;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section h3 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
          color: black;
        }
        
        .rto-box {
          border: 2px solid black;
          padding: 15px;
        }
        
        .rto-box p {
          font-size: 14px;
          margin-bottom: 8px;
          color: black;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid black;
          font-size: 14px;
        }
        
        td {
          border: 1px solid black;
          padding: 10px;
          vertical-align: top;
          color: black;
        }
        
        .label-cell {
          font-weight: bold;
          background-color: #f5f5f5;
          width: 35%;
        }
        
        .declaration {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
          color: black;
        }
        
        .signature-section {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-top: 40px;
        }
        
        .signature-line {
          border-bottom: 2px solid black;
          width: 200px;
          margin-bottom: 8px;
        }
        
        .signature-text {
          text-align: center;
          font-size: 14px;
          color: black;
        }
        
        .office-use {
          border: 2px solid black;
          padding: 15px;
          margin-top: 30px;
        }
        
        .office-grid {
          display: flex;
          justify-content: space-between;
        }
        
        .office-column {
          flex: 1;
          padding-right: 20px;
        }
        
        .office-column:last-child {
          padding-right: 0;
        }
        
        .office-line {
          font-size: 14px;
          margin-bottom: 15px;
          color: black;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <!-- Header -->
        <div class="header">
          <h1>FORM 4</h1>
          <h2>APPLICATION FOR PERMANENT DRIVING LICENCE</h2>
          <p>[See rule 19 of the Central Motor Vehicle Rules, 1989]</p>
        </div>

        <!-- RTO Address -->
        <div class="section">
          <div class="rto-box">
            <p>To,</p>
            <p>The Licensing Authority,</p>
            <p>Regional Transport Office,</p>
            <p>Maharashtra</p>
          </div>
        </div>

        <!-- Applicant Information -->
        <div class="section">
          <h3>APPLICANT INFORMATION:</h3>
          <table>
            <tr>
              <td class="label-cell">Full Name</td>
              <td>${formatName(clientData?.firstName, clientData?.middleName, clientData?.lastName)}</td>
            </tr>
            <tr>
              <td class="label-cell">Client Code</td>
              <td>${clientData?.clientCode || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Father's/Guardian's Name</td>
              <td>${formatName(clientData?.guardianFirstName, clientData?.guardianMiddleName, clientData?.guardianLastName)}</td>
            </tr>
            <tr>
              <td class="label-cell">Date of Birth</td>
              <td>${formatDate(clientData?.birthDate)}</td>
            </tr>
            <tr>
              <td class="label-cell">Blood Group</td>
              <td>${clientData?.bloodGroup || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Gender</td>
              <td>${clientData?.gender || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Mobile Number</td>
              <td>${clientData?.phoneNumber || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Email Address</td>
              <td>${clientData?.email || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Aadhaar Number</td>
              <td>${clientData?.aadhaarNumber || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">PAN Number</td>
              <td>${clientData?.panNumber || ''}</td>
            </tr>
          </table>
        </div>

        <!-- Address -->
        <div class="section">
          <h3>ADDRESS:</h3>
          <table>
            <tr>
              <td class="label-cell">Present Address</td>
              <td>${clientData?.address || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">City</td>
              <td>${clientData?.city || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">State</td>
              <td>${clientData?.state || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">PIN Code</td>
              <td>${clientData?.pincode || ''}</td>
            </tr>
          </table>
        </div>

        <!-- Learning License Details -->
        <div class="section">
          <h3>LEARNING LICENCE DETAILS:</h3>
          <table>
            <tr>
              <td class="label-cell">Learning Licence Number</td>
              <td>${clientData?.learningLicenseNumber || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Issue Date</td>
              <td>${formatDate(clientData?.learningLicenseIssueDate)}</td>
            </tr>
            <tr>
              <td class="label-cell">Expiry Date</td>
              <td>${formatDate(clientData?.learningLicenseExpiryDate)}</td>
            </tr>
            <tr>
              <td class="label-cell">Class of Vehicle</td>
              <td>${Array.isArray(clientData?.learningLicenseClass) ? clientData.learningLicenseClass.join(', ') : ''}</td>
            </tr>
          </table>
        </div>

        <!-- Declaration -->
        <div class="section">
          <h3>DECLARATION:</h3>
          <p class="declaration">
            I hereby declare that the information given above is true to the best of my knowledge and belief. 
            I undertake to abide by the Motor Vehicle Act and Rules made thereunder.
          </p>
          
          <div class="signature-section">
            <div>
              <p>Date: ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
            <div>
              <div class="signature-line"></div>
              <p class="signature-text">Signature of Applicant</p>
            </div>
          </div>
        </div>

        <!-- Office Use Only -->
        <div class="office-use">
          <h3>FOR OFFICE USE ONLY:</h3>
          <div class="office-grid">
            <div class="office-column">
              <p class="office-line">Application No: _______________</p>
              <p class="office-line">Test Date: _______________</p>
              <p class="office-line">Test Result: _______________</p>
            </div>
            <div class="office-column">
              <p class="office-line">DL No: _______________</p>
              <p class="office-line">Issue Date: _______________</p>
              <p class="office-line">Valid Till: _______________</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateBulkPDFs = async (
  formsData: FormData[],
  options: BulkPDFOptions = {}
): Promise<void> => {
  const { filename = 'Form4_Bulk_Download', quality = 0.8 } = options;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let isFirstPage = true;

  try {
    for (let i = 0; i < formsData.length; i++) {
      const clientData = formsData[i];

      // Create a temporary iframe to isolate CSS
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.width = '210mm'; // A4 width
      iframe.style.height = 'auto'; // Let content determine height
      iframe.style.border = 'none';
      iframe.style.backgroundColor = 'white';
      document.body.appendChild(iframe);

      // Get iframe document
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Could not access iframe document');
      }

      // Create form HTML and inject into iframe
      const formHTML = generateForm4HTML(clientData);
      iframeDoc.open();
      iframeDoc.write(formHTML);
      iframeDoc.close();

      // Wait for rendering and fonts to load
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Get the actual content dimensions
      const bodyElement = iframeDoc.body;
      const contentHeight = bodyElement.scrollHeight;
      const contentWidth = bodyElement.scrollWidth;

      // A4 dimensions in pixels (at 96 DPI)
      const pageWidth = 794;
      const pageHeight = 1123;

      // Scale to fit width (maintain aspect ratio)
      const scale = pageWidth / contentWidth;

      // Convert to canvas with calculated scale
      const canvas = await html2canvas(bodyElement, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        windowWidth: contentWidth,
        windowHeight: contentHeight,
        onclone: (clonedDoc) => {
          // Ensure all styles are applied correctly
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * { color: black !important; }
            body { background: white !important; overflow: visible !important; }
            .page { transform-origin: top left; }
          `;
          clonedDoc.head.appendChild(style);
        },
      });

      // Calculate how many pages this form will need
      const scaledHeight = contentHeight * scale;
      const pagesNeeded = Math.ceil(scaledHeight / pageHeight);

      // Split content across multiple pages
      for (let pageIndex = 0; pageIndex < pagesNeeded; pageIndex++) {
        // Add new page for subsequent forms/pages
        if (!isFirstPage) {
          pdf.addPage();
        }
        isFirstPage = false;

        // Calculate the portion of canvas for this page
        const sourceY = pageIndex * pageHeight;
        const sourceHeight = Math.min(pageHeight, scaledHeight - sourceY);

        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = (sourceHeight / scaledHeight) * canvas.height;

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          // Draw the portion of the main canvas for this page
          ctx.drawImage(
            canvas,
            0,
            (sourceY / scaledHeight) * canvas.height, // Source position
            canvas.width,
            (sourceHeight / scaledHeight) * canvas.height, // Source size
            0,
            0, // Destination position
            pageCanvas.width,
            pageCanvas.height // Destination size
          );

          // Add this page slice to PDF
          const pageImgData = pageCanvas.toDataURL('image/jpeg', quality);
          pdf.addImage(pageImgData, 'JPEG', 0, 0, 210, (sourceHeight / pageHeight) * 297);
        }
      }

      // Clean up iframe
      document.body.removeChild(iframe);
    }

    // Download the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

export const generateSinglePDF = async (clientData: FormData, filename?: string): Promise<void> => {
  await generateBulkPDFs([clientData], {
    filename: filename || `Form4_${clientData.clientCode}`,
  });
};
