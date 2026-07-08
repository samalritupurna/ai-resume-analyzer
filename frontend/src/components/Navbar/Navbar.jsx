import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          AI Resume Analyzer
        </Link>
        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`hamburger ${isOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <li className="nav-item">
                <span className="nav-links" style={{ color: '#3b82f6' }}>
                  Hello, {user.name}
                </span>
              </li>
              <li className="nav-item">
                <Link to="/activity" className="nav-links" onClick={() => setIsOpen(false)}>
                  Activity
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-links" onClick={() => setIsOpen(false)}>
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin" className="nav-links" onClick={() => setIsOpen(false)}>
                  Admin Panel
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-links"
              onClick={() => setIsOpen(false)}
            >
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
