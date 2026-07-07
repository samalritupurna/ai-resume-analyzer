require('dotenv').config({ path: './.env' });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function test() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log('Testing with key:', apiKey ? apiKey.substring(0, 10) + '...' : 'Missing');

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: "Say hello" }],
        max_tokens: 2000
      })
    });

    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response body:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
