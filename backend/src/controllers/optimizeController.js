const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Calls the OpenRouter AI to rewrite a resume bullet point.
 * @route   POST /api/optimize-bullet
 * @access  Private
 */
const optimizeBullet = async (req, res) => {
  try {
    const { bullet, missingSkills } = req.body;

    if (!bullet) {
      return res.status(400).json({ error: 'Please provide a bullet point to optimize.' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key missing.' });
    }

    const prompt = `
      You are an expert technical recruiter and resume writer.
      Your task is to rewrite the following resume bullet point to be powerful, ATS-friendly, and professional.
      
      Original Bullet: "${bullet}"
      Skills to naturally include (if relevant): ${missingSkills || 'None provided'}
      
      Requirements:
      - Use strong action verbs.
      - Keep it concise (1-2 sentences max).
      - Naturally weave in the missing skills without keyword stuffing.
      - Quantify achievements if possible (or leave it easy for the user to fill in numbers).
      - DO NOT return markdown, DO NOT include conversational text.
      - Return ONLY the raw rewritten text string.
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter API Error Response:', data);
      throw new Error(`OpenRouter API failed: ${data.error?.message || 'Unknown error'}`);
    }
    let textResult = data.choices[0].message.content.trim();
    
    // Clean up quotes if AI wraps the response in them
    if (textResult.startsWith('"') && textResult.endsWith('"')) {
      textResult = textResult.slice(1, -1);
    }

    res.status(200).json({ optimizedBullet: textResult });
  } catch (error) {
    console.error('Optimize Bullet Error:', error);
    res.status(500).json({ error: 'Failed to optimize bullet. Please try again.' });
  }
};

module.exports = {
  optimizeBullet
};
