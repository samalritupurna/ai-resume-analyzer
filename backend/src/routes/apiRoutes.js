const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../middleware/authMiddleware');
const { analyzeController, getHistoryController } = require('../controllers/analyzeController');

const router = express.Router();

// Configure multer for temporary file storage
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Route to handle resume analysis (protected)
router.post('/analyze', authMiddleware, upload.single('resume'), analyzeController);

// Route to get analysis history (protected)
router.get('/history', authMiddleware, getHistoryController);

module.exports = router;
