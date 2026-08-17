// api/swaps.js — Consolidated Serverless Function for all /api/swaps* routes
import { getDb } from '../lib/db.js';

export default async function handler(req, res) {
  const db = getDb();
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/$/, '');

  try {
    // ── PATCH /api/swaps/:id/accept ───────────────────────────────────────────
    if (req.method === 'PATCH' && pathname.endsWith('/accept')) {
      const parts = pathname.split('/');
      const swapId = parts[parts.length - 2];

      const swapRes = await db.execute({ sql: 'SELECT * FROM swaps WHERE id = ?', args: [swapId] });
      if (swapRes.rows.length === 0) return res.status(404).json({ success: false, error: 'Swap proposal not found.' });
      const swap = swapRes.rows[0];

      await db.execute({ sql: `UPDATE swaps SET status = 'Accepted' WHERE id = ?`, args: [swapId] });

      const sessionId = 'sess_' + Date.now();
      await db.execute({
        sql: `INSERT INTO sessions (id, host_id, peer_id, peer_name, peer_avatar, peer_school, skill, format, scheduled_time, duration, type, room_code, status)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '60 mins', ?, ?, 'Confirmed')`,
        args: [sessionId, swap.receiver_id, swap.sender_id, swap.sender_name, swap.sender_avatar, swap.sender_school,
               swap.requested_skill, swap.format || 'Virtual Call', swap.proposed_slot,
               swap.type || 'Direct Swap', 'ROOM-' + Math.random().toString(36).substr(2, 6).toUpperCase()]
      });

      const updatedSwap = (await db.execute({ sql: 'SELECT * FROM swaps WHERE id = ?', args: [swapId] })).rows[0];
      const newSession = (await db.execute({ sql: 'SELECT * FROM sessions WHERE id = ?', args: [sessionId] })).rows[0];

      return res.json({
        success: true,
        message: 'Swap accepted & session scheduled!',
        data: { swap: updatedSwap, session: newSession }
      });
    }

    // ── PATCH /api/swaps/:id/decline ──────────────────────────────────────────
    if (req.method === 'PATCH' && pathname.endsWith('/decline')) {
      const parts = pathname.split('/');
      const swapId = parts[parts.length - 2];

      await db.execute({ sql: `UPDATE swaps SET status = 'Declined' WHERE id = ?`, args: [swapId] });
      const result = (await db.execute({ sql: 'SELECT * FROM swaps WHERE id = ?', args: [swapId] })).rows[0];
      return res.json({ success: true, message: 'Swap declined.', data: result });
    }

    // ── GET /api/swaps ────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const userId = req.query.userId || url.searchParams.get('userId');
      const status = req.query.status || url.searchParams.get('status');
      let sql = 'SELECT * FROM swaps WHERE 1=1';
      const args = [];

      if (userId) {
        sql += ' AND (sender_id = ? OR receiver_id = ?)';
        args.push(userId, userId);
      }
      if (status) {
        sql += ' AND status = ?';
        args.push(status);
      }
      sql += ' ORDER BY created_at DESC';

      const result = await db.execute({ sql, args });
      const swaps = result.rows.map(row => ({
        ...row,
        offeredSkill: row.offered_skill,
        requestedSkill: row.requested_skill,
        proposedSlot: row.proposed_slot,
        senderId: row.sender_id,
        senderName: row.sender_name,
        senderAvatar: row.sender_avatar,
        senderSchool: row.sender_school,
        receiverId: row.receiver_id,
        creditAmount: row.credit_amount,
        createdAt: row.created_at
      }));
      return res.json({ success: true, count: swaps.length, data: swaps });
    }

    // ── POST /api/swaps ───────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { senderId, receiverId, type, offeredSkill, requestedSkill, format, proposedSlot, message } = req.body || {};

      if (!senderId || !receiverId || !requestedSkill || !proposedSlot) {
        return res.status(400).json({
          success: false,
          error: 'Missing required: senderId, receiverId, requestedSkill, proposedSlot'
        });
      }

      const senderRes = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [senderId] });
      const sender = senderRes.rows[0] || {};

      const swapId = 'swap_' + Date.now();
      await db.execute({
        sql: `INSERT INTO swaps (id, sender_id, sender_name, sender_avatar, sender_school, receiver_id, type, offered_skill, requested_skill, format, proposed_slot, status, message, credit_amount)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, 0)`,
        args: [swapId, senderId, sender.name || '', sender.avatar || '', sender.school || '',
               receiverId, type || 'Direct Swap', offeredSkill || '', requestedSkill,
               format || 'Virtual Call', proposedSlot, message || '']
      });

      const created = (await db.execute({ sql: 'SELECT * FROM swaps WHERE id = ?', args: [swapId] })).rows[0];
      return res.status(201).json({ success: true, message: 'Swap proposal dispatched!', data: created });
    }

    return res.status(404).json({ success: false, error: 'Route not found' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
