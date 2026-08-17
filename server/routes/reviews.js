import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// POST /api/reviews - Submit review, ratings, and endorsements
router.post('/', (req, res) => {
  try {
    const { targetUserId, authorName, authorAvatar, authorSchool, rating, skill, tags, comment } = req.body;

    if (!targetUserId || !rating || !skill) {
      return res.status(400).json({ 
        success: false, 
        error: 'targetUserId, rating (1-5), and skill are required' 
      });
    }

    const result = store.addReview({
      targetUserId,
      authorName: authorName || 'Anonymous Student',
      authorAvatar,
      authorSchool,
      rating: parseInt(rating),
      skill,
      tags: tags || [],
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review saved! Peer karma updated.',
      data: result
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
