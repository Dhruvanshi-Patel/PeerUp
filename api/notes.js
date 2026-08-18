// api/notes.js — Consolidated Serverless Function for all /api/notes* routes
import { getDb } from '../lib/db.js';

export default async function handler(req, res) {
  const db = getDb();
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/$/, '');

  try {
    // ── POST /api/notes/:id/unlock ────────────────────────────────────────────
    if (req.method === 'POST' && pathname.endsWith('/unlock')) {
      const parts = pathname.split('/');
      const noteId = parts[parts.length - 2];
      const { userId } = req.body || {};

      const noteRes = await db.execute({ sql: 'SELECT * FROM notes WHERE id = ?', args: [noteId] });
      if (noteRes.rows.length === 0) return res.status(404).json({ success: false, error: 'Study guide not found.' });
      const note = noteRes.rows[0];

      if (userId) {
        const userRes = await db.execute({ sql: 'SELECT credits FROM users WHERE id = ?', args: [userId] });
        if (userRes.rows.length > 0 && userRes.rows[0].credits < 1) {
          return res.status(400).json({ success: false, error: 'You need at least 1 credit to unlock this guide.' });
        }
        await db.execute({
          sql: 'UPDATE users SET credits = credits - 1 WHERE id = ?',
          args: [userId]
        });
      }

      await db.execute({
        sql: 'UPDATE notes SET downloads = downloads + 1 WHERE id = ?',
        args: [noteId]
      });

      return res.json({
        success: true,
        message: `Unlocked "${note.title}"! 1 credit spent.`,
        data: {
          note,
          downloadUrl: `https://peerup.vercel.app/download/${note.id}.pdf`
        }
      });
    }

    // ── GET /api/notes ────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const category = req.query.category || url.searchParams.get('category');
      const search = req.query.search || url.searchParams.get('search');
      let sql = 'SELECT * FROM notes WHERE 1=1';
      const args = [];

      if (category && category !== 'all') {
        sql += ' AND category = ?';
        args.push(category);
      }
      if (search) {
        const q = `%${search.toLowerCase()}%`;
        sql += ' AND (LOWER(title) LIKE ? OR LOWER(course) LIKE ? OR LOWER(author_school) LIKE ?)';
        args.push(q, q, q);
      }
      sql += ' ORDER BY downloads DESC, created_at DESC';

      const result = await db.execute({ sql, args });
      const notes = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        course: row.course,
        authorName: row.author_name,
        authorSchool: row.author_school,
        category: row.category,
        type: row.type,
        pages: row.pages,
        creditCost: row.credit_cost,
        downloads: row.downloads,
        rating: row.rating,
        examYear: row.exam_year,
        tags: row.tags ? JSON.parse(row.tags) : [],
        summary: row.summary
      }));
      return res.json({ success: true, count: notes.length, data: notes });
    }

    // ── POST /api/notes ───────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { title, course, authorName, authorSchool, category, pages, tags, summary, type } = req.body || {};
      if (!title || !course) {
        return res.status(400).json({ success: false, error: 'Title and Course are required.' });
      }

      const noteId = 'note_' + Date.now();
      await db.execute({
        sql: `INSERT INTO notes (id, title, course, author_name, author_school, category, type, pages, credit_cost, downloads, rating, tags, summary)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 5.0, ?, ?)`,
        args: [noteId, title, course, authorName || 'Student Peer', authorSchool || 'Verified Campus',
               category || 'Academic & STEM', type || 'Lecture Notes', pages || 5,
               JSON.stringify(tags || ['Course Notes']), summary || 'Comprehensive student class notes.']
      });

      const note = (await db.execute({ sql: 'SELECT * FROM notes WHERE id = ?', args: [noteId] })).rows[0];
      return res.status(201).json({ success: true, message: 'Notes published to campus swap hub!', data: note });
    }

    return res.status(404).json({ success: false, error: 'Route not found' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
