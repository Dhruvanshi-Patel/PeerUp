import express from 'express';
import { sqlDb } from '../db/database.js';

const router = express.Router();

// GET /api/leaderboard - Get weekly honor roll and rankings from SQL Database
router.get('/', async (req, res) => {
  try {
    const leaderboard = await sqlDb.getLeaderboard();
    res.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
      meta: {
        season: "Fall 2026",
        scoringFormula: "Karma = Hours Taught × 25 + Rating Bonus"
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
