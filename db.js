const mongoose = require('mongoose');

// Ensure MongoDB URI is in your .env file
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_CONNECTION_STRING; // Use the connection string from .env
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error.message);
    process.exit(1); // Exit if unable to connect
  }
};

module.exports = connectDB;
