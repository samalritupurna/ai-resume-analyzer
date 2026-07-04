const { extractTextFromFile } = require('../services/documentService');
const { analyzeResume } = require('../services/aiService');

/**
 * Controller to handle the /api/analyze endpoint.
 */
const analyzeController = async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'Resume file is required.' });
    }

    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    // Step 1: Extract text from the uploaded file
    const resumeText = await extractTextFromFile(file);

    if (!resumeText) {
      return res.status(400).json({ error: 'Could not extract text from the provided file.' });
    }

    // Step 2: Analyze the text using AI
    const analysisResult = await analyzeResume(resumeText, jobDescription);

    // Step 3: Return the structured JSON along with the raw text for comparison
    return res.status(200).json({
      ...analysisResult,
      rawResumeText: resumeText,
      rawJobDescription: jobDescription
    });

  } catch (error) {
    console.error('Analyze Controller Error:', error.message);
    return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
};

module.exports = {
  analyzeController,
};
