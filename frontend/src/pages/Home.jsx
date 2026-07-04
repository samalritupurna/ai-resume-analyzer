import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import ResumeUpload from '../components/ResumeUpload/ResumeUpload';
import JobDescription from '../components/JobDescription/JobDescription';
import AnalyzeButton from '../components/AnalyzeButton/AnalyzeButton';
import Loader from '../components/Loader/Loader';
import { analyzeResumeAPI } from '../services/api';

function Home() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const data = await analyzeResumeAPI(file, jobDescription);
      // Navigate to the result page and pass the data along via route state
      navigate('/result', { state: { analysisData: data } });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="home-page">
      <Hero />
      <ResumeUpload file={file} setFile={setFile} />
      <JobDescription text={jobDescription} setText={setJobDescription} />
      
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <AnalyzeButton 
          isResumeUploaded={!!file} 
          isJobDescriptionFilled={jobDescription.length > 0} 
          onAnalyze={handleAnalyze} 
        />
      </div>

      <Loader isVisible={isAnalyzing} />
    </div>
  );
}

export default Home;
