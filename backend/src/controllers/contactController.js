const Contact = require('../models/Contact');

const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newMessage = new Contact({
      name,
      email,
      subject: subject || 'No Subject',
      message
    });

    await newMessage.save();

    res.status(201).json({ success: true, message: 'Your message has been sent successfully.' });
  } catch (error) {
    console.error('Contact Submission Error:', error);
    res.status(500).json({ error: 'Failed to submit message. Please try again later.' });
  }
};

module.exports = {
  submitContactMessage
};
