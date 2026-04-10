require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./backend/src/models/User');

async function seedUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB.');
        
        const email = 'admin@ai.com';
        const password = 'admin';
        
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('User already exists.');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ email, password: hashedPassword });
            console.log('Admin user created successfully!');
            console.log('Email: admin@ai.com');
            console.log('Password: admin');
        }
    } catch (err) {
        console.error('Error seeding user:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedUser();
