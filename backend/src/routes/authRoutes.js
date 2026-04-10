const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const connectToDatabase = require('../config/db');

const router = express.Router();

function getAuthErrorMessage(action, error) {
  console.error(`Auth Error during ${action}:`, error); // Log the full error to the backend console

  if (error.message.includes('MONGODB_URI is missing')) {
    return 'Login database is not configured yet. Add MONGODB_URI to the project .env file.';
  }

  if (error.message.includes('placeholder values')) {
    return 'Your .env file still has sample MongoDB values. Replace YOUR_USERNAME, YOUR_PASSWORD, and YOUR_CLUSTER with your real Atlas details.';
  }

  if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
    return 'MongoDB Atlas host could not be reached. Check that your MONGODB_URI is correct and that the cluster name is real.';
  }

  if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
    return 'MongoDB Atlas rejected the username or password in MONGODB_URI.';
  }

  return `Something went wrong while ${action}.`;
}

router.post('/signup', async (req, res) => {
  try {
    await connectToDatabase();

    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      success: true,
      message: 'Signup successful. You can now sign in.'
    });
  } catch (error) {
    console.error('[auth][signup] Failed to create account:', error);
    return res.status(500).json({
      success: false,
      message: getAuthErrorMessage('creating the account', error)
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    await connectToDatabase();

    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    return res.json({
      success: true,
      message: 'Login successful.'
    });
  } catch (error) {
    console.error('[auth][login] Failed to log in:', error);
    return res.status(500).json({
      success: false,
      message: getAuthErrorMessage('logging in', error)
    });
  }
});

module.exports = router;
