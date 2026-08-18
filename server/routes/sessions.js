import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// GET /api/sessions - List confirmed or past sessions
router.get('/', (req, res) => {
  try {
    const { userId } = req.query;
    const sessions = store.getSessions({ userId });
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/sessions/:id - Get session details
router.get('/:id', (req, res) => {
  try {
    const session = store.getSessionById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/sessions/:id/complete - Complete session, release simple credit, award +50 karma
router.post('/:id/complete', (req, res) => {
  try {
    const { completedByUserId } = req.body;
    const result = store.completeSession(req.params.id, completedByUserId);
    res.json({
      success: true,
      message: 'Session completed! +1 Credit and +50 Karma awarded.',
      data: result
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/sessions/:id/qr - Get QR verification code
router.get('/:id/qr', (req, res) => {
  try {
    const session = store.getSessionById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({
      success: true,
      data: {
        sessionId: session.id,
        roomCode: session.roomCode,
        location: session.locationDetail,
        verificationUrl: `https://omnikon.edu/checkin/${session.roomCode}`
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
