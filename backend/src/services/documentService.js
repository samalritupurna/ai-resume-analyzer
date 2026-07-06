const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { PdfReader } = require('pdfreader');

// For modern, robust PDF parsing fallback
async function parsePdfWithPdfjsDist(buffer) {
  // Use a dynamic import to support ES modules if necessary, or require legacy build
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs').catch(() => require('pdfjs-dist/legacy/build/pdf.js'));
  
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
  const pdfDocument = await loadingTask.promise;
  const numPages = pdfDocument.numPages;
  
  let text = '';
  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    text += pageText + ' \n';
  }
  return text;
}

function parsePdfWithPdfReader(buffer) {
  return new Promise((resolve, reject) => {
    let text = '';
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) reject(err);
      else if (!item) resolve(text);
      else if (item.text) text += item.text + ' ';
    });
  });
}

/**
 * Extracts text from a given file (PDF or DOCX).
 * @param {Object} file - The file object from Multer.
 * @returns {Promise<string>} The extracted raw text.
 */
const extractTextFromFile = async (file) => {
  const filePath = file.path;
  const mimeType = file.mimetype;
  let text = '';

  try {
    if (mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      
      // Attempt 1: pdf-parse (Standard)
      try {
        const data = await pdf(dataBuffer);
        text = data.text;
      } catch (pdfErr) {
        console.warn('pdf-parse failed, falling back to pdfreader...');
        
        // Attempt 2: pdfreader
        try {
          text = await parsePdfWithPdfReader(dataBuffer);
        } catch (pdfreaderErr) {
          console.warn('pdfreader failed, falling back to pdfjs-dist...');
          
          // Attempt 3: pdfjs-dist (Most robust)
          try {
             text = await parsePdfWithPdfjsDist(dataBuffer);
          } catch (pdfjsErr) {
             console.error('pdfjs-dist error:', pdfjsErr.message || pdfjsErr, pdfjsErr.stack);
             if (pdfjsErr.message && pdfjsErr.message.toLowerCase().includes('password')) {
                throw new Error('The PDF is password protected.');
             }
             throw new Error('Unable to read PDF. The file may be corrupted or encrypted.');
          }
        }
      }
      
      if (!text || text.trim() === '') {
         throw new Error('The PDF contains only scanned images or no readable text found.');
      }
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.originalname.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
      if (!text || text.trim() === '') {
         throw new Error('No readable text found in the DOCX file.');
      }
    } else {
      throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
    }
  } catch (error) {
    console.error('Error extracting text from file:', error.message || error);
    // Rethrow known user-friendly errors
    if (
      error.message.includes('password') ||
      error.message.includes('scanned images') ||
      error.message.includes('readable text') ||
      error.message.includes('Unsupported file format') ||
      error.message.includes('Unable to read PDF')
    ) {
      throw error;
    }
    // Generic fallback for totally unexpected errors
    throw new Error('Unable to read the document. It might be corrupted.');
  } finally {
    // Clean up the temporary file immediately after reading
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return text.trim();
};

module.exports = {
  extractTextFromFile,
};
