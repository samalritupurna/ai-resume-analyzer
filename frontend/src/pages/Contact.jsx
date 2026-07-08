import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContactAPI } from '../services/api';
import { toast } from 'sonner';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitContactAPI(formData);
      toast.success('Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <motion.div 
        className="contact-container glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Have a question or feedback? We'd love to hear from you!</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="Your Name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              value={formData.subject} 
              onChange={handleChange} 
              placeholder="What is this regarding?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea 
              id="message" 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              required 
              placeholder="Type your message here..."
              rows="5"
            ></textarea>
          </div>

          <button type="submit" className="contact-submit-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Send Message'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
