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
const analyzeResume = async (resumeText, jobDescription) => {
  const prompt = `
    You are an expert technical recruiter and an advanced Applicant Tracking System (ATS).
    Your task is to analyze the following resume against the provided job description.
    
    Job Description:
    """
    ${jobDescription}
    """
    
    Resume Text:
    """
    ${resumeText}
    """
    
    Analyze the resume and return the result strictly as a JSON object matching this structure EXACTLY (do not include markdown blocks like \`\`\`json, just raw JSON):
    {
      "resumeScore": (number 0-100),
      "atsScore": (number 0-100),
      "jobMatchScore": (number 0-100),
      "grammar": "Short string",
      "formatting": "Short string",
      "matchedSkills": ["skill1", "skill2"],
      "missingSkills": ["skill1", "skill2"],
      "missingKeywords": ["keyword1"],
      "technicalSkills": ["skill1"],
      "softSkills": ["skill1"],
      "workExperience": [{"title": "Job Title", "company": "Company", "duration": "Duration"}],
      "education": [{"degree": "Degree", "institution": "Institution", "year": "Year"}],
      "projects": ["Project desc"],
      "certifications": ["Cert desc"],
      "strengths": ["Strength 1"],
      "weaknesses": ["Weakness 1"],
      "suggestions": ["Suggestion 1"],
      "recommendation": "Short verdict string",
      "recommendedRoles": [
        {
          "role": "Role Name",
          "matchPercentage": (number 0-100),
          "matchReasons": ["Reason 1", "Reason 2"],
          "missingSkills": ["Skill 1", "Skill 2"],
          "difficultyLevel": "Beginner/Intermediate/Advanced",
          "hiringPotential": "Low/Medium/High"
        }
      ],
      "careerSuggestions": {
        "skillsToImprove": ["Skill 1", "Skill 2"],
        "certifications": ["Cert 1", "Cert 2"],
        "technologiesToLearn": ["Tech 1", "Tech 2"],
        "projectIdeas": ["Idea 1", "Idea 2"],
        "interviewTopics": ["Topic 1", "Topic 2"]
      },
      "coverLetter": "A highly tailored, professional cover letter matching the candidate's skills to the job description. Do not include placeholders like [Your Name], try to infer details from the resume or leave it neutral.",
      "interviewQuestions": [
        {
          "question": "A specific interview question tailored to the job and resume.",
          "tips": "Brief advice on how the candidate should answer this."
        }
      ]
    }
  `;

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
       throw new Error("OPENROUTER_API_KEY is missing from environment variables.");
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
        max_tokens: 8192
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenRouter API Error Response:', data);
      throw new Error(`OpenRouter API failed: ${data.error?.message || 'Unknown error'}`);
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenRouter response format:', data);
      throw new Error('Invalid response from AI provider.');
    }

    let textResult = data.choices[0].message.content;
    
    // Find the first { and the last } to extract just the JSON
    const firstBrace = textResult.indexOf('{');
    const lastBrace = textResult.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      console.error('No JSON object found in AI response:', textResult);
      throw new Error('AI returned an invalid format.');
    }
    
    const jsonString = textResult.substring(firstBrace, lastBrace + 1);
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error in analyzeResume:', error);
    // If it's already a custom error we threw, preserve its message
    if (error.message && error.message.includes('OpenRouter API failed')) {
      throw error;
    }
    if (error.message && error.message.includes('Invalid format')) {
      throw error;
    }
    throw new Error('AI Analysis failed: ' + error.message);
  }
};

module.exports = {
  analyzeResume,
};
