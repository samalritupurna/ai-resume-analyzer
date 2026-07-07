require('dotenv').config({ path: './.env' });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function test() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log('Testing with key:', apiKey ? apiKey.substring(0, 10) + '...' : 'Missing');

  try {
    const response = await fetch("https://openrouter.ai/api/v1/models");
    const data = await response.json();
    const googleModels = data.data.map(m => m.id).filter(id => id.includes('gemini'));
    console.log('Google Models:', googleModels);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
