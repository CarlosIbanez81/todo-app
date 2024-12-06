const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_CONNECTION_STRING; 
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
