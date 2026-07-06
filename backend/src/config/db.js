const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let conn;
    try {
      // Try connecting to Cloud MongoDB first
      conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/resume_analyzer');
      console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (cloudErr) {
      console.log('Cloud MongoDB connection failed, falling back to local database...');
      conn = await mongoose.connect('mongodb://localhost:27017/resume_analyzer');
      console.log(`Local MongoDB Connected successfully: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
