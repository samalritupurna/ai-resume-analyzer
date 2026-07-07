async function test() {
  const response = await fetch("https://ai-resume-analyzer-2-pj1z.onrender.com/api/history");
  console.log('Status:', response.status);
  const text = await response.text();
  console.log('Body:', text.substring(0, 100));
}
test();
