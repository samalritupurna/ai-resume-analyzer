process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function test() {
  const url = 'https://ai-resume-analyzer-2-pj1z.onrender.com/api';
  
  const email = `test${Date.now()}@test.com`;
  const regRes = await fetch(`${url}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email, password: 'password123' })
  });
  const regDataText = await regRes.text();
  console.log('Register Status:', regRes.status);
  console.log('Register Body:', regDataText.substring(0, 200));
}
test();
