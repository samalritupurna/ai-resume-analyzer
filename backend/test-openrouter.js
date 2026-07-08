process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function test() {
  const url = 'https://ai-resume-analyzer-2-pj1z.onrender.com';
  
  const res = await fetch(url);
  const text = await res.text();
  console.log('Health Status:', res.status);
  console.log('Health Text:', text);
}
test();
