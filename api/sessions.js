// api/sessions.js — Consolidated Serverless Function for all /api/sessions* routes
import { getDb } from '../lib/db.js';

export default async function handler(req, res) {
  const db = getDb();
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/$/, '');

  try {
    // ── POST /api/sessions/:id/complete ──────────────────────────────────────
    if (req.method === 'POST' && pathname.endsWith('/complete')) {
      const parts = pathname.split('/');
      const sessionId = parts[parts.length - 2];
      const { completedByUserId } = req.body || {};

      const sessionRes = await db.execute({ sql: 'SELECT * FROM sessions WHERE id = ?', args: [sessionId] });
      if (sessionRes.rows.length === 0) return res.status(404).json({ success: false, error: 'Session not found.' });

      await db.execute({ sql: `UPDATE sessions SET status = 'Completed' WHERE id = ?`, args: [sessionId] });

      if (completedByUserId) {
        await db.execute({
          sql: 'UPDATE users SET credits = credits + 1, karma = karma + 50, hours_taught = hours_taught + 1 WHERE id = ?',
          args: [completedByUserId]
        });
      }

      const updated = (await db.execute({ sql: 'SELECT * FROM sessions WHERE id = ?', args: [sessionId] })).rows[0];
      return res.json({
        success: true,
        message: 'Session completed! +1 Credit and +50 Karma awarded.',
        data: updated
      });
    }

    // ── GET /api/sessions/:id/qr ──────────────────────────────────────────────
    if (req.method === 'GET' && pathname.endsWith('/qr')) {
      const parts = pathname.split('/');
      const sessionId = parts[parts.length - 2];

      const result = await db.execute({ sql: 'SELECT * FROM sessions WHERE id = ?', args: [sessionId] });
      if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Session not found.' });
      const session = result.rows[0];
      return res.json({
        success: true,
        data: {
          sessionId: session.id,
          roomCode: session.room_code,
          location: session.location_detail,
          verificationUrl: `https://omnikon.vercel.app/checkin/${session.room_code}`
        }
      });
    }

    // ── GET /api/sessions ─────────────────────────────────────────────────────
    if (req.method === 'GET' && pathname === '/api/sessions') {
      const userId = req.query.userId || url.searchParams.get('userId');
      let sql = 'SELECT * FROM sessions WHERE 1=1';
      const args = [];

      if (userId) {
        sql += ' AND (host_id = ? OR peer_id = ?)';
        args.push(userId, userId);
      }
      sql += ' ORDER BY created_at DESC';

      const result = await db.execute({ sql, args });
      const sessions = result.rows.map(row => ({
        ...row,
        hostId: row.host_id,
        peerId: row.peer_id,
        peerName: row.peer_name,
        peerAvatar: row.peer_avatar,
        peerSchool: row.peer_school,
        scheduledTime: row.scheduled_time,
        roomCode: row.room_code,
        locationDetail: row.location_detail,
        createdAt: row.created_at
      }));

      return res.json({ success: true, count: sessions.length, data: sessions });
    }

    // ── GET /api/sessions/:id ─────────────────────────────────────────────────
    if (req.method === 'GET' && pathname.startsWith('/api/sessions/')) {
      const sessionId = pathname.replace('/api/sessions/', '');
      const result = await db.execute({ sql: 'SELECT * FROM sessions WHERE id = ?', args: [sessionId] });
      if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Session not found.' });
      const row = result.rows[0];
      return res.json({
        success: true,
        data: {
          ...row,
          hostId: row.host_id,
          peerId: row.peer_id,
          peerName: row.peer_name,
          peerAvatar: row.peer_avatar,
          peerSchool: row.peer_school,
          scheduledTime: row.scheduled_time,
          roomCode: row.room_code,
          locationDetail: row.location_detail
        }
      });
    }

    return res.status(404).json({ success: false, error: 'Route not found' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
