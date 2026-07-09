const { extractTextFromFile } = require('../services/documentService');
const { analyzeResume } = require('../services/aiService');
const Analysis = require('../models/Analysis');

/**
 * Controller to handle the /api/analyze endpoint.
 */
const analyzeController = async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription, linkedinProfileText } = req.body;

    if (!file && !linkedinProfileText) {
      return res.status(400).json({ error: 'Resume file or LinkedIn profile text is required.' });
    }

    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    // Step 1: Extract text from the uploaded file or use provided text
    let resumeText = '';
    if (file) {
      resumeText = await extractTextFromFile(file);
    } else if (linkedinProfileText) {
      resumeText = linkedinProfileText;
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'We couldn\'t read enough text. Please ensure your document or text is detailed.' });
    }

    // Step 2: Analyze the text using AI
    const analysisResult = await analyzeResume(resumeText, jobDescription);

    // Step 3: Save the result to MongoDB
    const newAnalysis = new Analysis({
      ...analysisResult,
      user: req.user._id,
      rawResumeText: resumeText,
      rawJobDescription: jobDescription,
    });
    
    await newAnalysis.save();

    // 4. Return the structured JSON along with the raw text for comparison
    return res.status(200).json({
      ...analysisResult,
      rawResumeText: resumeText,
      rawJobDescription: jobDescription
    });

  } catch (error) {
    console.error('Analyze Controller Error:', error.message);
    
    // Map known validation/extraction errors to 400 Bad Request
    const errorMessage = error.message || 'An error occurred during analysis.';
    const isClientError = 
      errorMessage.includes('password') || 
      errorMessage.includes('readable text') || 
      errorMessage.includes('Unsupported') || 
      errorMessage.includes('corrupted') || 
      errorMessage.includes('OCR');

    const statusCode = isClientError ? 400 : 500;
    res.status(statusCode).json({ error: errorMessage });
  }
};
const getHistoryController = async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user._id })
      .select('atsScore jobMatchScore recommendation createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

const getSharedAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await Analysis.findById(id).select('-user'); // exclude user data for privacy

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Get Shared Analysis Error:', error);
    res.status(500).json({ error: 'Failed to fetch shared analysis' });
  }
};

module.exports = {
  analyzeController,
  getHistoryController,
  getSharedAnalysis,
};
