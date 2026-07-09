const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let conn;
    try {
      // Try connecting to Cloud MongoDB first
      const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/resume_analyzer';
      console.log(`Attempting to connect to MongoDB URI: ${uri.replace(/:[^:]*@/, ':***@')}`); // Hide password in logs
      conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (cloudErr) {
      console.error('Cloud MongoDB connection failed! Error:', cloudErr.message);
      console.log('Falling back to local database...');
      conn = await mongoose.connect('mongodb://localhost:27017/resume_analyzer');
      console.log(`Local MongoDB Connected successfully: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('The server will continue running, but database operations will fail.');
    // REMOVED process.exit(1) to prevent Render Crash Loop
  }
};

module.exports = connectDB;
