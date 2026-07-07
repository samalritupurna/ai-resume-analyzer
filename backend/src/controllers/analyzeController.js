const { extractTextFromFile } = require('../services/documentService');
const { analyzeResume } = require('../services/aiService');
const Analysis = require('../models/Analysis');

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
    console.error('Analyze Controller Error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during analysis.' });
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

module.exports = {
  analyzeController,
  getHistoryController,
};
