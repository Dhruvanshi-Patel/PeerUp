import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import usersRouter from './routes/users.js';
import swapsRouter from './routes/swaps.js';
import sessionsRouter from './routes/sessions.js';
import messagesRouter from './routes/messages.js';
import reviewsRouter from './routes/reviews.js';
import leaderboardRouter from './routes/leaderboard.js';
import walletRouter from './routes/wallet.js';
import perksRouter from './routes/perks.js';
import notesRouter from './routes/notes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(morgan('dev'));
app.use(express.json());

// API Route Registration
app.use('/api/users', usersRouter);
app.use('/api/swaps', swapsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/perks', perksRouter);
app.use('/api/notes', notesRouter);

// Service Health & API Documentation Index
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'PeerUp Peer-to-Peer Backend Engine',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      swaps: '/api/swaps',
      sessions: '/api/sessions',
      messages: '/api/messages/conversations',
      reviews: '/api/reviews',
      leaderboard: '/api/leaderboard',
      wallet: '/api/wallet/:userId'
    }
  });
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

// Serve static frontend build assets if present
app.use(express.static(distPath));

// Root API index
app.get('/api', (req, res) => {
  res.json({
    message: 'PeerUp API Server is active.',
    docs: '/api/health'
  });
});

// Fallback all non-API GET routes to React SPA index.html
app.get('{*path}', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Endpoint ${req.method} ${req.url} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 PeerUp Backend API running on http://localhost:${PORT}`);
  console.log(`📋 Health & Endpoint Catalog: http://localhost:${PORT}/api/health`);
});
