const serverless = require('serverless-http');
const app = require('../../backend/src/app');

// Export wrapper for Netlify
module.exports.handler = serverless(app);
