import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div className="footer-left" style={{ alignItems: 'center' }}>
          <h3 className="footer-logo">RituResume AI</h3>
          <p className="footer-copyright">
            &copy; {currentYear} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
