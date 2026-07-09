const express = require('express');
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware');
const { analyzeController, getHistoryController, getSharedAnalysis } = require('../controllers/analyzeController');
const { getDashboardStats, getGlobalLogs, getAllUsers, getAllAnalyses, deleteAnalysis, getContactMessages } = require('../controllers/adminController');
const { submitContactMessage } = require('../controllers/contactController');
const { optimizeBullet } = require('../controllers/optimizeController');

const router = express.Router();

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // Keep original extension to help OCR and parsers
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
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
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
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
