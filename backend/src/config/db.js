const mongoose = require('mongoose');

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Add it to your .env file.');
  }

  if (MONGODB_URI.includes('YOUR_CLUSTER') || MONGODB_URI.includes('YOUR_USERNAME') || MONGODB_URI.includes('YOUR_PASSWORD')) {
    throw new Error('MONGODB_URI still contains placeholder values. Replace the sample Atlas values in your .env file.');
  }

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    connectTimeoutMS: 10000,
  });
  
  console.log('Successfully connected to MongoDB Atlas');
  return mongoose.connection;
}

module.exports = connectToDatabase;
