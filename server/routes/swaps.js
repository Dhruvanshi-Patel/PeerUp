import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// GET /api/swaps - List proposals
router.get('/', (req, res) => {
  try {
    const { userId, status } = req.query;
    const swaps = store.getSwaps({ userId, status });
    res.json({ success: true, count: swaps.length, data: swaps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/swaps - Create swap proposal (Direct 1:1 or Credit Exchange with Escrow hold)
router.post('/', (req, res) => {
  try {
    const { senderId, receiverId, type, offeredSkill, requestedSkill, format, proposedSlot, message } = req.body;

    if (!senderId || !receiverId || !requestedSkill || !proposedSlot) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required swap parameters (senderId, receiverId, requestedSkill, proposedSlot)' 
      });
    }

    const swap = store.createSwap({
      senderId,
      receiverId,
      type: type || 'Direct Swap',
      offeredSkill,
      requestedSkill,
      format,
      proposedSlot,
      message
    });

    res.status(201).json({ 
      success: true, 
      message: 'Swap proposal dispatched successfully', 
      data: swap 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH /api/swaps/:id/accept - Accept swap & create scheduled session
router.patch('/:id/accept', (req, res) => {
  try {
    const result = store.acceptSwap(req.params.id);
    res.json({ 
      success: true, 
      message: 'Swap accepted & session scheduled!', 
      data: result 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH /api/swaps/:id/decline - Decline swap & refund escrow credit
router.patch('/:id/decline', (req, res) => {
  try {
    const declined = store.declineSwap(req.params.id);
    res.json({ 
      success: true, 
      message: 'Swap declined and escrow refunded if applicable', 
      data: declined 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
