const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { protect, admin } = require('../middleware/authMiddleware');
const { analyzeController, getHistoryController, getSharedAnalysis, analyzeMultipleController } = require('../controllers/analyzeController');
const { createResume, getResumes, getResumeById, updateResume, deleteResume, duplicateResume } = require('../controllers/resumeController');
const { getHistoryEvents } = require('../controllers/historyController');
const { getDashboardStats, getGlobalLogs, getAllUsers, getAllAnalyses, deleteAnalysis, getContactMessages } = require('../controllers/adminController');
const { submitContactMessage } = require('../controllers/contactController');
const { optimizeBullet } = require('../controllers/optimizeController');

const router = express.Router();

// Health Check Route
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongoState: mongoose.connection.readyState,
    mongoHost: mongoose.connection.host || 'none',
  });
});

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const os = require('os');
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    // Keep original extension to help OCR and parsers
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const dotIndex = file.originalname.lastIndexOf('.');
    const ext = dotIndex !== -1 ? file.originalname.substring(dotIndex) : '';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images, pdfs, and documents
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'text/plain', // .txt
      'application/rtf', // .rtf
      'text/rtf',
      'image/jpeg',
      'image/png',
      'image/webp'
    ];
    
    // Also check extensions since some environments send generic octet-stream for docs
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.png', '.jpg', '.jpeg', '.webp'];
    const dotIndex = file.originalname.lastIndexOf('.');
    const ext = dotIndex !== -1 ? file.originalname.substring(dotIndex).toLowerCase() : '';

    if (allowedMimeTypes.includes(file.mimetype) || (ext && allowedExtensions.includes(ext))) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload PDF, Word, TXT, RTF, or an Image.'), false);
    }
  }
});

// Public Routes
router.post('/contact', submitContactMessage);
router.get('/analyze/shared/:id', getSharedAnalysis);

// Route to handle resume analysis (protected)
router.post('/analyze', protect, upload.single('resume'), analyzeController);

// Route to get analysis history (protected)
router.get('/history', protect, getHistoryController);

// === NEW PREMIUM FEATURES ===
// Resume Versions CRUD
router.post('/resumes', protect, upload.single('resume'), createResume);
router.get('/resumes', protect, getResumes);
router.get('/resumes/:id', protect, getResumeById);
router.put('/resumes/:id', protect, updateResume);
router.delete('/resumes/:id', protect, deleteResume);
router.post('/resumes/:id/duplicate', protect, duplicateResume);

// Analyze Multiple (AI Recommendation)
router.post('/analyze-multiple', protect, analyzeMultipleController);

// History Timeline
router.get('/history-events', protect, getHistoryEvents);
// ==========================

// Admin Routes (protected + admin only)
router.get('/admin/stats', protect, admin, getDashboardStats);
router.get('/admin/logs', protect, admin, getGlobalLogs);

// Optimize Bullet Route
router.post('/optimize-bullet', protect, optimizeBullet);

// Admin Action Routes
router.get('/admin/users', protect, admin, getAllUsers);
router.get('/admin/analyses', protect, admin, getAllAnalyses);
router.delete('/admin/analyses/:id', protect, admin, deleteAnalysis);
router.get('/admin/contacts', protect, admin, getContactMessages);

module.exports = router;
