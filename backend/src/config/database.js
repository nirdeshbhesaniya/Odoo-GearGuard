const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  TROUBLESHOOTING:');
      console.error('   It looks like MongoDB is not running.');
      console.error('   1. Make sure you have installed "MongoDB Community Server".');
      console.error('   2. Check if the "MongoDB" service is running in Windows Services.');
      console.error('   3. See backend/README_LOCAL_SETUP.md for instructions.\n');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
