const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Initialize dotenv to use environment variables
dotenv.config();

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    // console.log('MongoDB connected successfully');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;

