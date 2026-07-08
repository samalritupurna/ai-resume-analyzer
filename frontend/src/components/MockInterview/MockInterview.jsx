import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import './MockInterview.css';

const MockInterview = ({ questions }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (!questions || questions.length === 0) return null;

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mock-interview-section">
      <div className="mock-interview-header">
        <h2 className="section-heading">🎤 Mock Interview Prep</h2>
        <p className="section-subheading">Tailored questions based on your resume and the job description.</p>
      </div>

      <div className="accordion-container">
        {questions.map((item, index) => (
          <motion.div 
            key={index} 
            className={`accordion-item glass-card ${openIndex === index ? 'open' : ''}`}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div 
              className="accordion-header" 
              onClick={() => toggleAccordion(index)}
            >
              <div className="question-wrapper">
                <span className="question-number">Q{index + 1}</span>
                <h3 className="question-text">{item.question}</h3>
              </div>
              {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div 
                  className="accordion-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="tips-container">
                    <MessageSquare size={18} className="tips-icon" />
                    <div className="tips-text">
                      <strong>How to answer:</strong>
                      <p>{item.tips}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MockInterview;
