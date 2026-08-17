// api/messages.js — Consolidated Serverless Function for all /api/messages* routes
import { getDb } from '../lib/db.js';

export default async function handler(req, res) {
  const db = getDb();
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/$/, '');

  try {
    // ── GET /api/messages/conversations ──────────────────────────────────────
    if (req.method === 'GET' && pathname === '/api/messages/conversations') {
      const userId = req.query.userId || url.searchParams.get('userId');
      let sql = 'SELECT * FROM conversations WHERE 1=1';
      const args = [];

      if (userId) {
        sql += ' AND (participant1_id = ? OR participant2_id = ?)';
        args.push(userId, userId);
      }
      sql += ' ORDER BY updated_at DESC';

      const result = await db.execute({ sql, args });
      const conversations = result.rows.map(row => ({
        id: row.id,
        participants: [row.participant1_id, row.participant2_id],
        participantNames: [row.participant1_name, row.participant2_name],
        participantAvatars: [row.participant1_avatar, row.participant2_avatar],
        lastMessage: row.last_message,
        updatedAt: row.updated_at
      }));

      return res.json({ success: true, count: conversations.length, data: conversations });
    }

    // ── POST /api/messages ───────────────────────────────────────────────────
    if (req.method === 'POST' && pathname === '/api/messages') {
      const { conversationId, senderId, text } = req.body || {};
      if (!conversationId || !senderId || !text) {
        return res.status(400).json({ success: false, error: 'conversationId, senderId, and text are required.' });
      }

      const msgId = 'msg_' + Date.now();
      await db.execute({
        sql: `INSERT INTO messages (id, conversation_id, sender_id, text, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        args: [msgId, conversationId, senderId, text]
      });

      await db.execute({
        sql: `UPDATE conversations SET last_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        args: [text.substring(0, 100), conversationId]
      });

      const msg = (await db.execute({ sql: 'SELECT * FROM messages WHERE id = ?', args: [msgId] })).rows[0];
      return res.status(201).json({ success: true, data: msg });
    }

    // ── GET /api/messages/:conversationId ────────────────────────────────────
    if (req.method === 'GET' && pathname.startsWith('/api/messages/')) {
      const conversationId = pathname.replace('/api/messages/', '');
      const result = await db.execute({
        sql: 'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
        args: [conversationId]
      });
      return res.json({ success: true, data: result.rows });
    }

    return res.status(404).json({ success: false, error: 'Route not found' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
