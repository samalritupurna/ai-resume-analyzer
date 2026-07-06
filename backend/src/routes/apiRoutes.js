const express = require('express');
const multer = require('multer');
const { analyzeController } = require('../controllers/analyzeController');

const router = express.Router();

// Configure multer for temporary file storage
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Route to handle resume analysis
router.post('/analyze', upload.single('resume'), analyzeController);

module.exports = router;
