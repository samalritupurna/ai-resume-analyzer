const ResumeVersion = require('../models/ResumeVersion');
const HistoryEvent = require('../models/HistoryEvent');
const { extractTextFromFile } = require('../services/documentService');
const fs = require('fs');

const createResume = async (req, res) => {
  try {
    const { resumeName, targetRole } = req.body;
    let rawText = req.body.rawText;
    
    // If a file was uploaded, extract text from it
    if (req.file) {
      rawText = await extractTextFromFile(req.file);
    }

    if (!rawText || rawText.trim() === '') {
      return res.status(400).json({ error: 'Resume content is required' });
    }

    const newResume = new ResumeVersion({
      user: req.user._id,
      resumeName: resumeName || 'Untitled Resume',
      targetRole: targetRole || 'General',
      rawText
    });

    await newResume.save();

    // Log history
    await HistoryEvent.create({
      user: req.user._id,
      actionType: 'CREATED_RESUME',
      title: 'Created new resume version',
      description: `Created "${newResume.resumeName}" targeting ${newResume.targetRole} roles.`
    });

    res.status(201).json(newResume);
  } catch (error) {
    console.error('Create Resume Error:', error);
    res.status(500).json({ error: 'Failed to create resume' });
  }
};

const getResumes = async (req, res) => {
  try {
    const resumes = await ResumeVersion.find({ user: req.user._id, isActive: true })
      .sort({ updatedAt: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    console.error('Get Resumes Error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await ResumeVersion.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.status(200).json(resume);
  } catch (error) {
    console.error('Get Resume Error:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
};

const updateResume = async (req, res) => {
  try {
    const { resumeName, targetRole, rawText } = req.body;
    const resume = await ResumeVersion.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (resumeName) resume.resumeName = resumeName;
    if (targetRole) resume.targetRole = targetRole;
    if (rawText) {
      resume.rawText = rawText;
      resume.versionNumber += 1;
    }
    resume.updatedAt = Date.now();

    await resume.save();
    res.status(200).json(resume);
  } catch (error) {
    console.error('Update Resume Error:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await ResumeVersion.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Soft delete
    resume.isActive = false;
    await resume.save();

    await HistoryEvent.create({
      user: req.user._id,
      actionType: 'DELETED_RESUME',
      title: 'Deleted resume',
      description: `Deleted "${resume.resumeName}"`
    });

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete Resume Error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
};

const duplicateResume = async (req, res) => {
  try {
    const original = await ResumeVersion.findOne({ _id: req.params.id, user: req.user._id });
    if (!original) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    const duplicate = new ResumeVersion({
      user: req.user._id,
      resumeName: `${original.resumeName} (Copy)`,
      targetRole: original.targetRole,
      rawText: original.rawText,
      versionNumber: 1
    });

    await duplicate.save();

    await HistoryEvent.create({
      user: req.user._id,
      actionType: 'DUPLICATED_RESUME',
      title: 'Duplicated resume',
      description: `Created copy of "${original.resumeName}"`
    });

    res.status(201).json(duplicate);
  } catch (error) {
    console.error('Duplicate Resume Error:', error);
    res.status(500).json({ error: 'Failed to duplicate resume' });
  }
};

module.exports = {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume
};
