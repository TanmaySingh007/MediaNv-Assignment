// Vercel serverless function entry point
// This file is used when deploying backend to Vercel as serverless functions
const app = require('../src/server');

// Export the Express app for Vercel
module.exports = app;
