const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

// Bypass strict SSL verification which can cause "UNABLE_TO_VERIFY_LEAF_SIGNATURE" errors
// with OpenRouter on some environments (like Windows/corporate networks)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * Calls the Google Gemini API to analyze the resume against the job description.
 * @param {string} resumeText - The extracted text from the resume.
 * @param {string} jobDescription - The target job description.
 * @returns {Promise<Object>} The parsed JSON result.
 */
const analyzeResume = async (resumeText, jobDescription, retryCount = 0) => {
  const prompt = `
    You are an expert ATS. Analyze this resume against the job description. Be concise. Do not use filler words. Return ONLY raw JSON matching this structure exactly (no markdown blocks):
    {
      "resumeScore": 85, "atsScore": 80, "jobMatchScore": 90,
      "grammar": "Good", "formatting": "Clean",
      "matchedSkills": ["skill1"], "missingSkills": ["skill2"], "missingKeywords": ["keyword1"],
      "technicalSkills": ["skill1"], "softSkills": ["skill2"],
      "workExperience": [{"title": "Title", "company": "Co", "duration": "Duration"}],
      "education": [{"degree": "Deg", "institution": "Inst", "year": "2020"}],
      "projects": ["Desc"], "certifications": ["Cert"],
      "strengths": ["Str"], "weaknesses": ["Weak"], "suggestions": ["Sugg"],
      "recommendation": "Verdict",
      "recommendedRoles": [{"role": "Role", "matchPercentage": 90, "matchReasons": ["R1"], "missingSkills": ["S1"], "difficultyLevel": "Beginner", "hiringPotential": "High"}],
      "careerSuggestions": {"skillsToImprove": ["S1"], "certifications": ["C1"], "technologiesToLearn": ["T1"], "projectIdeas": ["P1"], "interviewTopics": ["I1"]},
      "coverLetter": "Short tailored cover letter...",
      "interviewQuestions": [{"question": "Q1", "tips": "T1"}]
    }
    
    Job Description: ${jobDescription.substring(0, 3000)}
    Resume Text: ${resumeText.substring(0, 3000)}
  `;

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
       throw new Error("OPENROUTER_API_KEY is missing.");
    }
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2500
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 429 || (response.status >= 500 && retryCount < 1)) {
        console.warn(`OpenRouter rate limit or server error. Retrying... (${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return analyzeResume(resumeText, jobDescription, retryCount + 1);
      }
      console.error('OpenRouter API Error Response:', data);
      throw new Error(`OpenRouter API failed: ${data.error?.message || 'Unknown error'}`);
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      if (retryCount < 1) {
        console.warn(`Invalid response format. Retrying... (${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return analyzeResume(resumeText, jobDescription, retryCount + 1);
      }
      throw new Error('Invalid response from AI provider.');
    }

    let textResult = data.choices[0].message.content;
    
    const firstBrace = textResult.indexOf('{');
    const lastBrace = textResult.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('AI returned an invalid format. No JSON found.');
    }
    
    const jsonString = textResult.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error in analyzeResume:', error);
    
    if (error.name === 'SyntaxError') {
       throw new Error('AI returned invalid JSON data. Please try again.');
    }
    
    if (error.message && error.message.includes('OPENROUTER_API_KEY')) {
      throw error;
    }

    if (error.message && error.message.includes('OpenRouter API failed')) {
       // Mask raw credit errors with a friendly message for the user, but log the real one (already logged above)
       if (error.message.includes('credits') || error.message.includes('tokens')) {
         throw new Error('Our AI servers are currently busy or at capacity. Please try again in a few minutes.');
       }
       throw new Error('Failed to communicate with AI provider.');
    }
    
    throw new Error('AI Analysis failed. Please ensure your document contains readable text and try again.');
  }
};

module.exports = {
  analyzeResume,
};
