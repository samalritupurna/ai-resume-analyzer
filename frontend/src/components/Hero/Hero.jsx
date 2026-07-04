import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Unlock Your Career Potential</h1>
        <p className="hero-description">
          Upload your resume and let our AI analyze your strengths, identify areas for improvement, 
          and provide actionable insights to land your dream job.
        </p>
        <Link to="/result" className="hero-btn">
          Analyze Resume
        </Link>
      </div>
    </section>
  );
};

export default Hero;
