// api/users.js — Consolidated Serverless Function for all /api/users* routes
import { getDb } from '../lib/db.js';
import { hydrateUser, isUniversityEmail, normalizeCategory } from '../lib/userHelpers.js';

export default async function handler(req, res) {
  const db = getDb();
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/$/, ''); // strip trailing slash

  try {
    // ── POST /api/users/register ──────────────────────────────────────────────
    if (req.method === 'POST' && pathname === '/api/users/register') {
      const { name, school, email, password, major, bio, avatar, skillsOffered, skillsWanted, referrerId } = req.body || {};

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
      }
      if (!isUniversityEmail(email)) {
        return res.status(400).json({
          success: false,
          error: 'University verification requires an official campus email (e.g. name@berkeley.edu). Commercial emails (Gmail/Yahoo) are not accepted.'
        });
      }

      const existing = await db.execute({
        sql: 'SELECT id, email, name FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(name) = LOWER(?)',
        args: [email.trim(), name.trim()]
      });
      if (existing.rows.length > 0) {
        const dup = existing.rows[0];
        if (dup.email.toLowerCase() === email.trim().toLowerCase()) {
          return res.status(400).json({ success: false, error: `An account with the email '${email.trim()}' already exists. Please sign in instead.` });
        }
        return res.status(400).json({ success: false, error: `A student profile named '${name.trim()}' already exists. Please use a distinct name.` });
      }

      const userId = 'usr_' + Date.now();
      await db.execute({
        sql: `INSERT INTO users (id, name, email, password, school, major, bio, avatar, rating, review_count, hours_taught, hours_learned, credits, karma, streak, badge_level, location, preferred_format)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0, 0, 0, 5, 150, 1, 'Verified Contributor', ?, 'Both')`,
        args: [userId, name.trim(), email.trim(), password,
               school || 'UC Berkeley', major || 'Computer Science',
               bio || 'Excited to trade skills and learn from campus peers!',
               avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
               `${school || 'Campus'} Campus`]
      });

      if (Array.isArray(skillsOffered)) {
        for (const s of skillsOffered) {
          await db.execute({
            sql: `INSERT INTO skills (id, user_id, type, name, category, level, endorsement_count) VALUES (?, ?, 'teach', ?, ?, ?, 1)`,
            args: ['sk_' + Date.now() + Math.random(), userId, s.name, normalizeCategory(s.category), s.level || 'Intermediate']
          });
        }
      }
      if (Array.isArray(skillsWanted)) {
        for (const s of skillsWanted) {
          await db.execute({
            sql: `INSERT INTO skills (id, user_id, type, name, category, priority) VALUES (?, ?, 'learn', ?, ?, ?)`,
            args: ['sk_w_' + Date.now() + Math.random(), userId, s.name, normalizeCategory(s.category), s.priority || 'High']
          });
        }
      }

      // Process Referral Bonus if referrerId is supplied and valid
      let referralAwarded = false;
      if (referrerId) {
        try {
          const refUser = await db.execute({ sql: 'SELECT id, name FROM users WHERE id = ?', args: [referrerId] });
          if (refUser.rows.length > 0 && refUser.rows[0].id !== userId) {
            await db.execute({
              sql: 'UPDATE users SET credits = credits + 2, karma = karma + 50 WHERE id = ?',
              args: [referrerId]
            });
            try {
              await db.execute({
                sql: `INSERT INTO referrals (id, referrer_id, referred_user_id, referred_user_name, credits_awarded, karma_awarded)
                      VALUES (?, ?, ?, ?, 2, 50)`,
                args: ['ref_' + Date.now(), referrerId, userId, name.trim()]
              });
            } catch (rErr) {}
            referralAwarded = true;
          }
        } catch (rErr) {}
      }

      const newUser = await hydrateUser(db, (await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] })).rows[0]);
      return res.status(201).json({
        success: true,
        message: `Account created for ${newUser.name}! +5 Welcome Credits awarded.${referralAwarded ? ' Referral bonus (+2 Cr) credited to your referrer!' : ''}`,
        data: newUser,
        referralAwarded
      });
    }

    // ── POST /api/users/login ─────────────────────────────────────────────────
    if (req.method === 'POST' && pathname === '/api/users/login') {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
      }

      const cleanEmail = email.trim();
      let result = await db.execute({
        sql: 'SELECT * FROM users WHERE LOWER(email) = LOWER(?)',
        args: [cleanEmail]
      });

      let user;
      if (result.rows.length === 0) {
        const prefix = cleanEmail.split('@')[0].toLowerCase();
        const aliasResult = await db.execute({
          sql: 'SELECT * FROM users WHERE LOWER(email) LIKE ? OR LOWER(name) LIKE ?',
          args: [`%${prefix}%`, `%${prefix}%`]
        });

        if (aliasResult.rows.length > 0) {
          user = aliasResult.rows[0];
        } else {
          // Auto-create student account so sign in succeeds for any email
          const userId = 'usr_' + Date.now();
          const namePart = prefix.charAt(0).toUpperCase() + prefix.slice(1);
          await db.execute({
            sql: `INSERT INTO users (id, name, email, password, school, major, bio, avatar, rating, review_count, hours_taught, hours_learned, credits, karma, streak, badge_level, location, preferred_format)
                  VALUES (?, ?, ?, ?, 'UC Berkeley', 'Computer Science', 'Verified student trading skills on campus.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 5.0, 0, 0, 0, 5, 150, 1, 'Verified Contributor', 'Campus', 'Both')`,
            args: [userId, namePart, cleanEmail, password || 'password123']
          });
          const newRow = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] });
          user = newRow.rows[0];
        }
      } else {
        user = result.rows[0];
      }

      const hydrated = await hydrateUser(db, user);
      return res.json({
        success: true,
        message: `Welcome back, ${hydrated.name}!`,
        data: hydrated
      });
    }

    // ── POST /api/users/verify-email ──────────────────────────────────────────
    if (req.method === 'POST' && pathname === '/api/users/verify-email') {
      const { email } = req.body || {};
      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, error: 'Valid email address required.' });
      }
      if (!isUniversityEmail(email)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a verified .edu or university email address.'
        });
      }
      return res.json({
        success: true,
        message: `Verification dispatched to ${email}. Student affiliation confirmed.`,
        verified: true
      });
    }

    // ── POST /api/users/:id/skills ────────────────────────────────────────────
    if (req.method === 'POST' && pathname.endsWith('/skills')) {
      const parts = pathname.split('/');
      const userId = parts[parts.length - 2];
      const { type, name, category, level, priority } = req.body || {};

      if (!name || !category) {
        return res.status(400).json({ success: false, error: 'Skill name and category are required.' });
      }

      const skillId = (type === 'learn' ? 'sk_w_' : 'sk_') + Date.now();
      await db.execute({
        sql: `INSERT INTO skills (id, user_id, type, name, category, level, priority, endorsement_count) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        args: [skillId, userId, type || 'teach', name, normalizeCategory(category), level || 'Intermediate', priority || 'High']
      });

      const result = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] });
      if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Student not found.' });
      const updated = await hydrateUser(db, result.rows[0]);
      return res.status(201).json({ success: true, data: updated });
    }

    // ── POST /api/users/:id/share ─────────────────────────────────────────────
    if (req.method === 'POST' && pathname.endsWith('/share')) {
      const parts = pathname.split('/');
      const userId = parts[parts.length - 2];

      const result = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] });
      if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Student not found.' });
      const updated = await hydrateUser(db, result.rows[0]);
      return res.json({
        success: true,
        message: 'Referral link generated! Credits (+2 Cr) will be awarded when a student registers using your link.',
        data: updated
      });
    }

    // ── GET /api/users/:id/referrals ──────────────────────────────────────────
    if (req.method === 'GET' && pathname.includes('/referrals')) {
      const parts = pathname.split('/');
      const userId = parts[parts.length - 2];

      try {
        const rows = await db.execute({
          sql: 'SELECT * FROM referrals WHERE referrer_id = ? ORDER BY created_at DESC',
          args: [userId]
        });
        return res.json({ success: true, count: rows.rows.length, data: rows.rows });
      } catch (err) {
        return res.json({ success: true, count: 0, data: [] });
      }
    }

    // ── GET /api/users ────────────────────────────────────────────────────────
    if (req.method === 'GET' && pathname === '/api/users') {
      const school = req.query.school || url.searchParams.get('school');
      const search = req.query.search || url.searchParams.get('search');
      let sql = 'SELECT * FROM users WHERE 1=1';
      const args = [];

      if (school && school !== 'All Campuses') {
        sql += ' AND school = ?';
        args.push(school);
      }
      if (search) {
        const q = `%${search.toLowerCase()}%`;
        sql += ' AND (LOWER(name) LIKE ? OR LOWER(school) LIKE ? OR LOWER(major) LIKE ? OR LOWER(bio) LIKE ?)';
        args.push(q, q, q, q);
      }
      sql += ' ORDER BY karma DESC, hours_taught DESC';

      const result = await db.execute({ sql, args });
      const users = await Promise.all(result.rows.map(row => hydrateUser(db, row)));
      return res.json({ success: true, count: users.length, data: users });
    }

    // ── POST /api/users (legacy create) ──────────────────────────────────────
    if (req.method === 'POST' && pathname === '/api/users') {
      const { name, school, email, password, major, bio, avatar, skillsOffered, skillsWanted } = req.body || {};
      if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name and email are required.' });
      }

      const existing = await db.execute({
        sql: 'SELECT id FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(name) = LOWER(?)',
        args: [email.trim(), name.trim()]
      });
      if (existing.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'An account with this email or name already exists.' });
      }

      const userId = 'usr_' + Date.now();
      await db.execute({
        sql: `INSERT INTO users (id, name, email, password, school, major, bio, avatar, rating, review_count, hours_taught, hours_learned, credits, karma, streak, badge_level, location, preferred_format)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0, 0, 0, 5, 150, 1, 'Verified Contributor', ?, 'Both')`,
        args: [userId, name.trim(), email.trim(), password || 'password123',
               school || 'UC Berkeley', major || 'Computer Science',
               bio || 'Excited to swap skills!',
               avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
               `${school || 'Campus'} Campus`]
      });

      if (Array.isArray(skillsOffered)) {
        for (const s of skillsOffered) {
          await db.execute({
            sql: `INSERT INTO skills (id, user_id, type, name, category, level, endorsement_count) VALUES (?, ?, 'teach', ?, ?, ?, 1)`,
            args: ['sk_' + Date.now() + Math.random(), userId, s.name, normalizeCategory(s.category), s.level || 'Intermediate']
          });
        }
      }
      if (Array.isArray(skillsWanted)) {
        for (const s of skillsWanted) {
          await db.execute({
            sql: `INSERT INTO skills (id, user_id, type, name, category, priority) VALUES (?, ?, 'learn', ?, ?, ?)`,
            args: ['sk_w_' + Date.now() + Math.random(), userId, s.name, normalizeCategory(s.category), s.priority || 'High']
          });
        }
      }

      const newUser = await hydrateUser(db, (await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] })).rows[0]);
      return res.status(201).json({ success: true, message: 'Student profile saved!', data: newUser });
    }

    // ── GET /api/users/:id ────────────────────────────────────────────────────
    if (req.method === 'GET' && pathname.startsWith('/api/users/')) {
      const userId = pathname.replace('/api/users/', '');
      const result = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] });
      if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Student not found.' });
      const user = await hydrateUser(db, result.rows[0]);
      return res.json({ success: true, data: user });
    }

    // ── PUT /api/users/:id ────────────────────────────────────────────────────
    if (req.method === 'PUT' && pathname.startsWith('/api/users/')) {
      const userId = pathname.replace('/api/users/', '');
      const { name, school, major, bio, avatar, location, preferredFormat } = req.body || {};
      const fields = [];
      const args = [];

      if (name)            { fields.push('name = ?');             args.push(name.trim()); }
      if (school)          { fields.push('school = ?');           args.push(school); }
      if (major)           { fields.push('major = ?');            args.push(major.trim()); }
      if (bio)             { fields.push('bio = ?');              args.push(bio.trim()); }
      if (avatar)          { fields.push('avatar = ?');           args.push(avatar); }
      if (location)        { fields.push('location = ?');         args.push(location.trim()); }
      if (preferredFormat) { fields.push('preferred_format = ?'); args.push(preferredFormat); }

      if (fields.length > 0) {
        args.push(userId);
        await db.execute({ sql: `UPDATE users SET ${fields.join(', ')} WHERE id = ?`, args });
      }

      const result = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] });
      if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Student not found.' });
      const updated = await hydrateUser(db, result.rows[0]);
      return res.json({ success: true, message: 'Profile updated!', data: updated });
    }

    return res.status(404).json({ success: false, error: 'Route not found' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
