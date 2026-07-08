const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  atsScore: {
    type: Number,
    required: true,
  },
  jobMatchScore: {
    type: Number,
    required: true,
  },
  strengths: {
    type: [String],
    default: [],
  },
  weaknesses: {
    type: [String],
    default: [],
  },
  missingSkills: {
    type: [String],
    default: [],
  },
  rawResumeText: {
    type: String,
    required: false,
  },
  rawJobDescription: {
    type: String,
    required: false,
  },
  recommendedRoles: {
    type: Array,
    default: [],
  },
  careerSuggestions: {
    type: Object,
    default: null,
  },
  coverLetter: {
    type: String,
    required: false,
  },
  interviewQuestions: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
