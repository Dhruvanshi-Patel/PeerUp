// api/misc.js — Consolidated Serverless Function for health, leaderboard, reviews, wallet, and perks
import { getDb } from '../lib/db.js';

const PERKS_CATALOG = [
  {
    id: 'perk_coffee',
    title: '$10 Campus Café & Bakery Voucher',
    vendor: "Peet's Coffee / Student Union Café",
    category: 'Food & Drinks',
    creditCost: 2,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
    description: 'Enjoy handcrafted espresso, matcha, and artisan croissants at any campus union location.',
    terms: 'Redeemable at participating campus dining locations.'
  },
  {
    id: 'perk_dining',
    title: 'All-You-Can-Eat Dining Hall Meal Pass',
    vendor: 'Campus Residential Dining',
    category: 'Meal Pass',
    creditCost: 3,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
    description: '1 Guest Meal Pass for any campus dining hall.',
    terms: 'Instant digital QR voucher upon redemption.'
  },
  {
    id: 'perk_boba',
    title: '$8 Boba / Smoothie Reward',
    vendor: 'Campus Boba Spot & Juice Bar',
    category: 'Food & Drinks',
    creditCost: 1,
    image: 'https://images.unsplash.com/photo-1558857563-b37cf3e18a93?w=300&auto=format&fit=crop&q=80',
    description: 'Treat yourself to brown sugar boba or fresh fruit smoothie after a long tutoring session.',
    terms: 'Valid 30 days from redemption.'
  },
  {
    id: 'perk_bookstore',
    title: '$25 Campus Bookstore & Tech Card',
    vendor: 'Official University Store',
    category: 'Campus Gear',
    creditCost: 5,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&auto=format&fit=crop&q=80',
    description: 'Use toward textbooks, stationary, Apple accessories, or collegiate apparel.',
    terms: "Sponsored by University Academic Dean's Honor Fund."
  }
];

export default async function handler(req, res) {
  const db = getDb();
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/$/, '');

  try {
    // ── GET /api/health ───────────────────────────────────────────────────────
    if (req.method === 'GET' && pathname === '/api/health') {
      return res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'PeerUp Peer-to-Peer Backend Engine',
        version: '2.0.0',
        db: 'Turso (libSQL)',
        endpoints: {
          users: '/api/users',
          swaps: '/api/swaps',
          sessions: '/api/sessions',
          messages: '/api/messages/conversations',
          reviews: '/api/reviews',
          leaderboard: '/api/leaderboard',
          wallet: '/api/wallet/:userId',
          perks: '/api/perks'
        }
      });
    }

    // ── GET /api/leaderboard ──────────────────────────────────────────────────
    if (req.method === 'GET' && pathname === '/api/leaderboard') {
      const result = await db.execute({
        sql: `SELECT id, name, school, karma, hours_taught as hours, badge_level as badge, avatar, rating
              FROM users ORDER BY karma DESC, hours_taught DESC`,
        args: []
      });
      const leaderboard = result.rows.map((row, i) => ({ ...row, rank: i + 1 }));
      return res.json({
        success: true,
        count: leaderboard.length,
        data: leaderboard,
        meta: { season: 'Fall 2026', scoringFormula: 'Karma = Hours Taught × 25 + Rating Bonus' }
      });
    }

    // ── POST /api/reviews ─────────────────────────────────────────────────────
    if (req.method === 'POST' && pathname === '/api/reviews') {
      const { targetUserId, authorName, authorAvatar, authorSchool, rating, skill, comment } = req.body || {};
      if (!targetUserId || !rating || !skill) {
        return res.status(400).json({ success: false, error: 'targetUserId, rating (1-5), and skill are required.' });
      }

      const reviewId = 'rev_' + Date.now();
      await db.execute({
        sql: `INSERT INTO reviews (id, target_user_id, author_name, author_avatar, author_school, rating, skill, comment)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [reviewId, targetUserId, authorName || 'Anonymous Student',
               authorAvatar || '', authorSchool || '', parseInt(rating), skill, comment || '']
      });

      const allReviews = await db.execute({
        sql: 'SELECT rating FROM reviews WHERE target_user_id = ?',
        args: [targetUserId]
      });
      const avgRating = allReviews.rows.reduce((s, r) => s + r.rating, 0) / allReviews.rows.length;
      await db.execute({
        sql: 'UPDATE users SET rating = ?, review_count = ?, karma = karma + 30 WHERE id = ?',
        args: [Math.round(avgRating * 10) / 10, allReviews.rows.length, targetUserId]
      });

      const review = (await db.execute({ sql: 'SELECT * FROM reviews WHERE id = ?', args: [reviewId] })).rows[0];
      return res.status(201).json({ success: true, message: 'Review saved! Peer karma updated.', data: review });
    }

    // ── GET /api/wallet/:userId ───────────────────────────────────────────────
    if (req.method === 'GET' && pathname.startsWith('/api/wallet/')) {
      const userId = pathname.replace('/api/wallet/', '');
      const result = await db.execute({
        sql: 'SELECT id, name, credits, karma FROM users WHERE id = ?',
        args: [userId]
      });
      if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Wallet not found for student.' });
      const user = result.rows[0];
      return res.json({
        success: true,
        data: { userId: user.id, name: user.name, credits: user.credits, karma: user.karma, escrowBalance: 0 }
      });
    }

    // ── POST /api/perks/:id/redeem ────────────────────────────────────────────
    if (req.method === 'POST' && pathname.endsWith('/redeem')) {
      const parts = pathname.split('/');
      const perkId = parts[parts.length - 2];
      const { userId } = req.body || {};

      const perk = PERKS_CATALOG.find(p => p.id === perkId);
      if (!perk) return res.status(404).json({ success: false, error: 'Campus perk not found.' });

      const userRes = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] });
      if (userRes.rows.length === 0) return res.status(404).json({ success: false, error: 'Student not found.' });

      const user = userRes.rows[0];
      if (user.credits < perk.creditCost) {
        return res.status(400).json({
          success: false,
          error: `Insufficient credits. Need ${perk.creditCost} (you have ${user.credits}). Teach more sessions to earn credits!`
        });
      }

      await db.execute({
        sql: 'UPDATE users SET credits = credits - ? WHERE id = ?',
        args: [perk.creditCost, userId]
      });

      const voucherCode = `SWAP-${perk.category.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      return res.json({
        success: true,
        message: `🎉 Successfully redeemed ${perk.title}! Voucher: ${voucherCode}`,
        data: { perk, voucherCode, remainingCredits: user.credits - perk.creditCost }
      });
    }

    // ── GET /api/perks ────────────────────────────────────────────────────────
    if (req.method === 'GET' && pathname === '/api/perks') {
      return res.json({ success: true, count: PERKS_CATALOG.length, data: PERKS_CATALOG });
    }

    return res.status(404).json({ success: false, error: 'Route not found' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
