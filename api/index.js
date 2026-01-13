import app from '../backend/server.js';

// Vercel serverless function
// Routes in backend/server.js are defined without /api prefix
// because Vercel's api/ directory already handles /api routing
export default app;
