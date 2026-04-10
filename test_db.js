require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./backend/src/models/User');

async function testConnection() {
    try {
        console.log('Attempting to connect to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully.');
        
        const userCount = await User.countDocuments();
        console.log('Total users in database:', userCount);
        
        if (userCount > 0) {
            const users = await User.find({}, { password: 0 }); // Don't show passwords
            console.log('Users found:', users);
        } else {
            console.log('No users found. You need to create an account first!');
        }
        
    } catch (err) {
        console.error('Connection error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

testConnection();
