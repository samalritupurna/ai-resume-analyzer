const { extractTextFromFile } = require('../services/documentService');
const { analyzeResume } = require('../services/aiService');
const Analysis = require('../models/Analysis');
const ResumeVersion = require('../models/ResumeVersion');
const fs = require('fs');

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
  } finally {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
    }
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

// Utility function for text similarity
const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 100;
  const len1 = str1.length;
  const len2 = str2.length;
  if (Math.abs(len1 - len2) / Math.max(len1, len2) > 0.1) return 0; // Quick length check

  const tokenize = str => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const tokens1 = tokenize(str1);
  const tokens2 = tokenize(str2);
  const set2 = new Set(tokens2);
  let matches = 0;
  for (const token of tokens1) {
    if (set2.has(token)) matches++;
  }
  return (matches / Math.max(tokens1.length, tokens2.length)) * 100;
};

const analyzeMultipleController = async (req, res) => {
  try {
    const { resumeIds, jobDescription } = req.body;

    if (!resumeIds || !Array.isArray(resumeIds) || resumeIds.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of resumeIds.' });
    }
    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    // Fetch all resumes
    const resumes = await ResumeVersion.find({ _id: { $in: resumeIds }, user: req.user._id });
    
    if (resumes.length === 0) {
      return res.status(404).json({ error: 'No resumes found.' });
    }

    // Check for Identical Resumes (>95% similar)
    if (resumes.length >= 2) {
      let isIdentical = false;
      for (let i = 0; i < resumes.length; i++) {
        for (let j = i + 1; j < resumes.length; j++) {
          const sim = calculateSimilarity(resumes[i].rawText, resumes[j].rawText);
          if (sim > 95) {
            isIdentical = true;
            break;
          }
        }
        if (isIdentical) break;
      }

      if (isIdentical) {
        return res.status(200).json({
          isIdentical: true,
          message: "These resumes appear to be identical or nearly identical. Although they have different file names, their content, skills, experience, projects, education, and ATS keywords are essentially the same. Therefore, there is no meaningful difference to compare or recommend between them."
        });
      }
    }

    const results = [];
    
    // Process sequentially to avoid rate-limiting
    for (const resume of resumes) {
      try {
        const analysisResult = await analyzeResume(resume.rawText, jobDescription);
        
        // Save analysis linked to the resume version
        const newAnalysis = new Analysis({
          ...analysisResult,
          user: req.user._id,
          resumeVersion: resume._id,
          rawResumeText: resume.rawText,
          rawJobDescription: jobDescription,
        });
        await newAnalysis.save();

        results.push({
          resumeId: resume._id,
          resumeName: resume.resumeName,
          targetRole: resume.targetRole,
          analysisId: newAnalysis._id,
          ...analysisResult
        });
      } catch (err) {
        console.error(`Failed to analyze resume ${resume._id}:`, err);
        // Continue with others
      }
    }

    if (results.length === 0) {
      return res.status(500).json({ error: 'Failed to analyze any resumes.' });
    }

    // Determine the recommended one (highest atsScore)
    results.sort((a, b) => b.atsScore - a.atsScore);
    const recommended = results[0];

    // Build the final AI explanation for why it's the best (simulated briefly based on score/skills)
    const missingCount = (recommended.missingSkills || recommended.missingKeywords || []).length;
    const explanation = `Recommended Resume: ${recommended.resumeName}\n\nReason:\n• Highest ATS Score (${recommended.atsScore}%)\n• Best Keyword Match (${recommended.jobMatchScore}%)\n• Lowest number of missing keywords (${missingCount})`;

    res.status(200).json({
      recommendedId: recommended.resumeId,
      explanation,
      results
    });

  } catch (error) {
    console.error('Analyze Multiple Error:', error);
    res.status(500).json({ error: 'Failed to analyze resumes.' });
  }
};

module.exports = {
  analyzeController,
  getHistoryController,
  getSharedAnalysis,
  analyzeMultipleController
};

