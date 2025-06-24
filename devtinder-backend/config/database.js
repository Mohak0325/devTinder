const mongoose = require('mongoose');


const url = 'mongodb+srv://mohak25jain:9sCgUcPGA8k4zFp2@cluster0.i6kpe.mongodb.net/devTinder';

const connectDB = async () => {
    try {
      await mongoose.connect(url);
      console.log('MongoDB Connected...');
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1);
    }
  };

module.exports = connectDB;