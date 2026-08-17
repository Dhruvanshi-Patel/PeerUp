import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// GET /api/wallet/:userId - Get credit balance and ledger transactions
router.get('/:userId', (req, res) => {
  try {
    const wallet = store.getWallet(req.params.userId);
    if (!wallet) {
      return res.status(404).json({ success: false, error: 'Wallet not found for student' });
    }
    res.json({ success: true, data: wallet });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
