const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

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
      "recommendation": "Short verdict string"
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
        max_tokens: 2000
      })
    });

    const data = await response.json();
    let textResult = data.choices[0].message.content;
    
    // Clean up potential markdown formatting from AI
    if (textResult.startsWith('\`\`\`json')) {
      textResult = textResult.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    } else if (textResult.startsWith('\`\`\`')) {
      textResult = textResult.replace(/\`\`\`/g, '');
    }
    
    return JSON.parse(textResult.trim());
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw new Error('AI Analysis failed. Please try again.');
  }
};

module.exports = {
  analyzeResume,
};
