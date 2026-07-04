const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

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
      const data = await pdf(dataBuffer);
      text = data.text;
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.originalname.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to parse the uploaded document.');
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
