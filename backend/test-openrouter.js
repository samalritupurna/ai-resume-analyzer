const https = require('https');

https.get('https://ai-resume-analyzer-2-pj1z.onrender.com/api/admin/stats', { rejectUnauthorized: false }, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Body:', data.substring(0, 500)));
}).on('error', err => console.error(err));
