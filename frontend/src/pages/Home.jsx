import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Hero from '../components/Hero/Hero';
import ResumeUpload from '../components/ResumeUpload/ResumeUpload';
import JobDescription from '../components/JobDescription/JobDescription';
import AnalyzeButton from '../components/AnalyzeButton/AnalyzeButton';
import BulletOptimizer from '../components/BulletOptimizer/BulletOptimizer';
import LinkedInAnalyzer from '../components/LinkedInAnalyzer/LinkedInAnalyzer';
import { analyzeResumeAPI } from '../services/api';
import './Home.css';

function Home() {
  const [file, setFile] = useState(null);
  const [linkedinText, setLinkedinText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadMode, setUploadMode] = useState('resume');
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenGreeting = sessionStorage.getItem('hasSeenGreeting');
    if (!hasSeenGreeting) {
      const userName = localStorage.getItem('userName') || 'there';
      toast(`Welcome back, ${userName}! 👋`, {
        description: 'Ready to optimize your resume today?',
        duration: 5000,
      });
      sessionStorage.setItem('hasSeenGreeting', 'true');
    }
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    const loadingStates = [
      'Uploading Document...',
      'Extracting Text...',
      'Running OCR Scanner...',
      'Analyzing Profile...',
      'Generating Suggestions...'
    ];
    let currentStateIndex = 0;
    
    const loadingToastId = toast.loading(loadingStates[0], { description: 'This may take a few moments...' });
    
    const progressInterval = setInterval(() => {
      currentStateIndex++;
      if (currentStateIndex < loadingStates.length) {
        toast.loading(loadingStates[currentStateIndex], { 
          id: loadingToastId, 
          description: 'Please wait while we process your document.'
        });
      }
    }, 2500); // Update status every 2.5 seconds
    
    try {
      const data = await analyzeResumeAPI(uploadMode === 'resume' ? file : null, jobDescription, uploadMode === 'linkedin' ? linkedinText : null);
      clearInterval(progressInterval);
      toast.success('Analysis complete!', { id: loadingToastId, description: 'Redirecting to results...' });
      // Navigate to the result page and pass the data along via route state
      navigate('/result', { state: { analysisData: data } });
    } catch (error) {
      clearInterval(progressInterval);
      toast.error(error.message, { id: loadingToastId, description: 'Please check your file and try again.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="home-page">
      <Hero />
      
      <div className="mode-toggle-container" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`saas-btn ${uploadMode === 'resume' ? 'saas-btn-primary' : 'saas-btn-secondary'}`}
          onClick={() => setUploadMode('resume')}
        >
          📄 PDF Resume
        </button>
        <button 
          className={`saas-btn ${uploadMode === 'linkedin' ? 'saas-btn-primary' : 'saas-btn-secondary'}`}
          onClick={() => setUploadMode('linkedin')}
        >
          🔗 LinkedIn Profile
        </button>
      </div>

      <div className="home-content-grid">
        {uploadMode === 'resume' ? (
          <ResumeUpload file={file} setFile={setFile} />
        ) : (
          <LinkedInAnalyzer linkedinText={linkedinText} setLinkedinText={setLinkedinText} />
        )}
        <JobDescription text={jobDescription} setText={setJobDescription} />
      </div>
      
      <div className="analyze-action-container">
        <AnalyzeButton 
          isResumeUploaded={uploadMode === 'resume' ? !!file : linkedinText.length > 50} 
          isJobDescriptionFilled={jobDescription.length > 0} 
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze} 
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '2rem' }}>
        <BulletOptimizer />
      </div>
    </div>
  );
}

export default Home;
