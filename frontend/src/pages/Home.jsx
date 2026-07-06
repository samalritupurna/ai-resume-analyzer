import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Hero from '../components/Hero/Hero';
import ResumeUpload from '../components/ResumeUpload/ResumeUpload';
import JobDescription from '../components/JobDescription/JobDescription';
import AnalyzeButton from '../components/AnalyzeButton/AnalyzeButton';
import { analyzeResumeAPI } from '../services/api';
import './Home.css';

function Home() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const loadingToastId = toast.loading('Analyzing your resume...', { description: 'Evaluating skills, experience, and job fit.' });
    
    try {
      const data = await analyzeResumeAPI(file, jobDescription);
      toast.success('Analysis complete!', { id: loadingToastId });
      // Navigate to the result page and pass the data along via route state
      navigate('/result', { state: { analysisData: data } });
    } catch (error) {
      toast.error(error.message, { id: loadingToastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="home-page">
      <Hero />
      <div className="home-content-grid">
        <ResumeUpload file={file} setFile={setFile} />
        <JobDescription text={jobDescription} setText={setJobDescription} />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <AnalyzeButton 
          isResumeUploaded={!!file} 
          isJobDescriptionFilled={jobDescription.length > 0} 
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze} 
        />
      </div>
    </div>
  );
}

export default Home;
