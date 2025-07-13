const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('Testing MongoDB Atlas connection...');

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Mask the connection string for security
    const maskedURI = MONGODB_URI.replace(
      /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
      'mongodb+srv://[USERNAME]:[PASSWORD]@'
    );
    console.log('Connection string format:', maskedURI);

    console.log('Attempting to connect...');
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: 'drinking'
    });

    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('Database name:', mongoose.connection.name);
    console.log('Connection state:', mongoose.connection.readyState);

    // Test creating a collection
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });

    const Test = mongoose.model('Test', testSchema);

    // Create a test document
    const testDoc = await Test.create({ name: 'Connection Test' });
    console.log('✅ Test document created:', testDoc._id);

    // Clean up
    await Test.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB Atlas');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if your .env.local file exists and has MONGODB_URI');
    console.log('2. Verify your MongoDB Atlas credentials');
    console.log('3. Make sure your IP is whitelisted in MongoDB Atlas');
    console.log('4. Check if your cluster is running');
    process.exit(1);
  }
}

testConnection(); 