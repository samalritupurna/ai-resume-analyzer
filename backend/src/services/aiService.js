const OpenAI = require('openai');

/**
 * Calls the OpenRouter API (via OpenAI SDK) to analyze the resume against the job description.
 * @param {string} resumeText - The extracted text from the resume.
 * @param {string} jobDescription - The target job description.
 * @returns {Promise<Object>} The parsed JSON result.
 */
const analyzeResume = async (resumeText, jobDescription) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not defined in environment variables.');
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
  });

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
    
    Analyze the resume and return a strict JSON object exactly matching the following structure, with no markdown formatting or extra text outside of the JSON block:
    {
      "atsScore": <number between 0 and 100 representing overall ATS compatibility>,
      "matchPercentage": <number between 0 and 100 representing the skill and experience match>,
      "matchedSkills": [<array of strings of key skills found in both>],
      "missingSkills": [<array of strings of key skills in job description but missing in resume>],
      "strengths": [<array of 2-4 strings highlighting strong points of the resume for this role>],
      "weaknesses": [<array of 2-4 strings highlighting weaknesses or missing qualifications>],
      "suggestions": [<array of 2-4 actionable suggestions to improve the resume for this specific role>],
      "recommendation": "<A short, 1-2 sentence final verdict on the candidate's fit>"
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-flash-1.5", // You can change this to any model supported by OpenRouter (e.g. meta-llama/llama-3-8b-instruct)
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const responseText = completion.choices[0].message.content;
    
    // Clean up potential markdown formatting (e.g. ```json ... ```)
    let cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(cleanedText);
    return parsedData;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw new Error('Failed to analyze the resume using AI.');
  }
};

module.exports = {
  analyzeResume,
};
