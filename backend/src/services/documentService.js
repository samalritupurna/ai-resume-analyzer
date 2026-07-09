const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { PdfReader } = require('pdfreader');
const WordExtractor = require('word-extractor');
const rtfParser = require('rtf-parser');
const Tesseract = require('tesseract.js');

// Text normalization to clean up OCR and PDF artifacts
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/[\r\n]+/g, '\n') // normalize newlines
    .replace(/[ \t]+/g, ' ')   // normalize spaces
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove control chars
    .trim();
};

// Fallback for modern PDF parsing
async function parsePdfWithPdfjsDist(buffer) {
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

// Fallback for legacy PDF parsing
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

// RTF Parsing
function parseRtf(filePath) {
  return new Promise((resolve, reject) => {
    rtfParser.parseFile(filePath, (err, doc) => {
      if (err) return reject(err);
      const text = doc.content.map(p => p.content.map(s => s.value).join('')).join('\n');
      resolve(text);
    });
  });
}

// OCR via OCR.Space API (Specifically useful for scanned PDFs where local rendering fails)
async function runOcrSpaceAPI(filePath, mimeType) {
  const formData = new FormData();
  const fileBlob = new Blob([fs.readFileSync(filePath)], { type: mimeType });
  formData.append('file', fileBlob, 'document.pdf');
  formData.append('apikey', 'helloworld'); // Free tier default key
  formData.append('isOverlayRequired', 'false');
  formData.append('OCREngine', '2');

  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (data.IsErroredOnProcessing) {
    throw new Error('OCR API Error: ' + (data.ErrorMessage || 'Unknown error'));
  }
  
  let extractedText = '';
  if (data.ParsedResults) {
    data.ParsedResults.forEach(result => {
      extractedText += result.ParsedText + '\n';
    });
  }
  
  return extractedText;
}

/**
 * Extracts text from a given file supporting multiple formats and OCR.
 * @param {Object} file - The file object from Multer.
 * @returns {Promise<string>} The cleaned, extracted text.
 */
const extractTextFromFile = async (file) => {
  const filePath = file.path;
  const mimeType = file.mimetype;
  const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
  let text = '';

  try {
    // === PDF PROCESSING ===
    if (mimeType === 'application/pdf' || ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      
      try {
        const data = await pdf(dataBuffer);
        text = data.text;
      } catch (pdfErr) {
        console.warn('pdf-parse failed, falling back to pdfjs-dist...');
        try {
           text = await parsePdfWithPdfjsDist(dataBuffer);
        } catch (pdfjsErr) {
           console.warn('pdfjs-dist failed, falling back to pdfreader...');
           try {
              text = await parsePdfWithPdfReader(dataBuffer);
           } catch (pdfreaderErr) {
              console.error('All text parsers failed.');
              if (pdfjsErr.message && pdfjsErr.message.toLowerCase().includes('password')) {
                 throw new Error('This file is password protected.');
              }
           }
        }
      }
      
      // If no text, it is likely a scanned PDF. Trigger OCR Space API.
      if (!text || text.trim().length < 50) {
         console.log('No readable text found in PDF. Triggering OCR fallback...');
         try {
           text = await runOcrSpaceAPI(filePath, 'application/pdf');
         } catch (ocrErr) {
           console.error('OCR fallback failed:', ocrErr);
           throw new Error('OCR could not detect text in this scanned PDF.');
         }
      }
    } 
    
    // === IMAGE PROCESSING (PNG, JPG, WEBP) ===
    else if (mimeType.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
       console.log('Image detected. Running local Tesseract OCR...');
       try {
         const result = await Tesseract.recognize(filePath, 'eng');
         text = result.data.text;
       } catch (ocrErr) {
         console.error('Tesseract OCR failed:', ocrErr);
         throw new Error('OCR could not detect text in this image.');
       }
    }

    // === DOCX PROCESSING ===
    else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === '.docx') {
      try {
        const result = await mammoth.extractRawText({ path: filePath });
        text = result.value;
      } catch (docErr) {
        throw new Error('Unable to extract text from DOCX file. It may be corrupted.');
      }
    } 
    
    // === DOC (Legacy) PROCESSING ===
    else if (mimeType === 'application/msword' || ext === '.doc') {
      try {
        const extractor = new WordExtractor();
        const extracted = await extractor.extract(filePath);
        text = extracted.getBody();
      } catch (docErr) {
        throw new Error('Unable to extract text from DOC file. It may be corrupted.');
      }
    }
    
    // === TXT PROCESSING ===
    else if (mimeType === 'text/plain' || ext === '.txt') {
      text = fs.readFileSync(filePath, 'utf8');
    }
    
    // === RTF PROCESSING ===
    else if (mimeType === 'application/rtf' || mimeType === 'text/rtf' || ext === '.rtf') {
       try {
         text = await parseRtf(filePath);
       } catch (rtfErr) {
         throw new Error('Unable to extract text from RTF file. It may be corrupted.');
       }
    } 
    
    else {
      throw new Error('Unsupported file format.');
    }
    
    text = normalizeText(text);

    if (!text || text.length < 50) {
       throw new Error('No readable text found. Please ensure the document is not blank.');
    }
    
  } catch (error) {
    console.error('Extraction pipeline error:', error.message);
    throw error;
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return text;
};

module.exports = {
  extractTextFromFile,
};
