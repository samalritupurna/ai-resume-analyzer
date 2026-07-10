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
          RituResume AI
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
                <Link to="/resumes" className="nav-links" onClick={() => setIsOpen(false)} style={{ color: '#F59E0B' }}>
                  Resumes ★
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/recommend" className="nav-links" onClick={() => setIsOpen(false)}>
                  Recommend
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/compare" className="nav-links" onClick={() => setIsOpen(false)}>
                  Compare
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/resume-history" className="nav-links" onClick={() => setIsOpen(false)}>
                  History
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
