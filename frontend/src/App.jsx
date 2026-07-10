import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Result from './pages/Result';
import Login from './pages/Login';
import Register from './pages/Register';
import Background from './components/Background/Background';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Activity from './pages/Activity';
import AdminPanel from './pages/AdminPanel';
import Contact from './pages/Contact';
import SharedReport from './pages/SharedReport';

// New Premium Features
import ResumeVersions from './pages/ResumeVersions';
import ResumeComparison from './pages/ResumeComparison';
import ResumeHistory from './pages/ResumeHistory';
import ResumeRecommendation from './pages/ResumeRecommendation';

function App() {
  useEffect(() => {
    const hasSeenHi = sessionStorage.getItem('hasSeenHi');
    if (!hasSeenHi) {
      toast('Hi! Welcome to RituResume AI 👋', {
        description: 'Analyze and optimize your resume instantly.',
        duration: 5000,
      });
      sessionStorage.setItem('hasSeenHi', 'true');
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Toaster theme="dark" position="top-center" richColors />
        <Background />
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
            <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/report/:id" element={<SharedReport />} />
            
            {/* New Premium Feature Routes */}
            <Route path="/resumes" element={<ProtectedRoute><ResumeVersions /></ProtectedRoute>} />
            <Route path="/compare" element={<ProtectedRoute><ResumeComparison /></ProtectedRoute>} />
            <Route path="/resume-history" element={<ProtectedRoute><ResumeHistory /></ProtectedRoute>} />
            <Route path="/recommend" element={<ProtectedRoute><ResumeRecommendation /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
