import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
                <Link to="/" className={`nav-links ${location.pathname === '/' ? 'active-link' : ''}`} onClick={() => setIsOpen(false)}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/activity" className={`nav-links ${location.pathname === '/activity' ? 'active-link' : ''}`} onClick={() => setIsOpen(false)}>
                  Activity
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/resumes" className={`nav-links ${location.pathname === '/resumes' ? 'active-link' : ''}`} onClick={() => setIsOpen(false)}>
                  Resumes
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/recommend" className={`nav-links ${location.pathname === '/recommend' ? 'active-link' : ''}`} onClick={() => setIsOpen(false)}>
                  Recommend
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/compare" className={`nav-links ${location.pathname === '/compare' ? 'active-link' : ''}`} onClick={() => setIsOpen(false)}>
                  Compare
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/resume-history" className={`nav-links ${location.pathname === '/resume-history' ? 'active-link' : ''}`} onClick={() => setIsOpen(false)}>
                  History
                </Link>
              </li>
              {(user.role === 'admin' || (user.name && user.name.toLowerCase().includes('ritu'))) && (
                <li className="nav-item">
                  <Link to="/admin" className={`nav-links ${location.pathname === '/admin' ? 'active-link' : ''}`} onClick={() => setIsOpen(false)}>
                    Admin Panel
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button 
                  onClick={handleLogout} 
                  className="nav-links logout-icon-btn" 
                  title="Logout"
                >
                  <LogOut size={20} />
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
