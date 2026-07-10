const mongoose = require('mongoose');

const resumeVersionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeName: {
    type: String,
    required: true,
    default: 'Untitled Resume',
  },
  targetRole: {
    type: String,
    default: 'General',
  },
  rawText: {
    type: String,
    required: true,
  },
  versionNumber: {
    type: Number,
    default: 1,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const ResumeVersion = mongoose.model('ResumeVersion', resumeVersionSchema);

module.exports = ResumeVersion;
