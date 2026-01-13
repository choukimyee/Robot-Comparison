import app from '../backend/server.js';

// Vercel serverless function wrapper
// Vercel routes /api/* to this file, but may remove /api prefix from req.url
// We need to restore it for Express routes that expect /api prefix
export default function handler(req, res) {
  // Restore /api prefix if it was removed by Vercel
  const originalUrl = req.url;
  if (!originalUrl.startsWith('/api')) {
    req.url = '/api' + (originalUrl === '/' ? '' : originalUrl);
  }
  // Call Express app
  return app(req, res);
}
