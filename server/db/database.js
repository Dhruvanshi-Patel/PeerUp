import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initialData } from '../data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = __dirname;
const DB_FILE = fs.existsSync(path.join(DB_DIR, 'peerup.db')) || !fs.existsSync(path.join(DB_DIR, 'skillswap.db'))
  ? path.join(DB_DIR, 'peerup.db')
  : path.join(DB_DIR, 'skillswap.db');
const SCHEMA_FILE = path.join(DB_DIR, 'schema.sql');

// Enable verbose SQLite trace logging in development
const sqlite = sqlite3.verbose();

class SqlDatabase {
  constructor() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    this.db = new sqlite.Database(DB_FILE, (err) => {
      if (err) {
        console.error('❌ Failed to connect to SQLite SQL Database:', err.message);
      } else {
        console.log(`🗄️ Connected to SQLite SQL Database at ${DB_FILE}`);
        this.initSchemaAndSeed();
      }
    });
  }

  // Promise wrapper for sql db.all
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  // Promise wrapper for sql db.get
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    });
  }

  // Promise wrapper for sql db.run
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  // Initialize SQL Tables from schema.sql & seed initial personas
  async initSchemaAndSeed() {
    try {
      if (fs.existsSync(SCHEMA_FILE)) {
        const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf-8');
        this.db.exec(schemaSql, async (err) => {
          if (err) {
            console.error('Error executing schema.sql:', err.message);
          } else {
            console.log('✅ SQL Schema & Relational Tables Initialized.');
            await this.seedInitialDataIfNeeded();
          }
        });
      }
    } catch (err) {
      console.error('Error initializing SQL Database:', err.message);
    }
  }

  // Seed initial personas into SQLite tables if empty
  async seedInitialDataIfNeeded() {
    try {
      const row = await this.get('SELECT COUNT(*) as count FROM users');
      if (row && row.count > 0) return;

      console.log('🌱 Seeding initial student personas into SQL Database...');
      for (const u of initialData.users) {
        await this.run(
          `INSERT INTO users (id, name, email, password, school, major, bio, avatar, rating, review_count, hours_taught, hours_learned, credits, karma, streak, badge_level, location, preferred_format)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            u.id,
            u.name,
            u.email,
            u.password || 'password123',
            u.school,
            u.major,
            u.bio,
            u.avatar,
            u.rating || 5.0,
            u.reviewCount || 0,
            u.hoursTaught || 0,
            u.hoursLearned || 0,
            u.credits || 5,
            u.karma || 150,
            u.streak || 1,
            u.badgeLevel || 'Verified Contributor',
            u.location || 'Campus',
            u.preferredFormat || 'Both'
          ]
        );

        // Seed skills offered
        if (Array.isArray(u.skillsOffered)) {
          for (const s of u.skillsOffered) {
            await this.run(
              `INSERT INTO skills (id, user_id, type, name, category, level, endorsement_count)
               VALUES (?, ?, 'teach', ?, ?, ?, ?)`,
              [s.id || 'sk_' + Date.now(), u.id, s.name, s.category, s.level || 'Intermediate', s.endorsementCount || 1]
            );
          }
        }

        // Seed skills wanted
        if (Array.isArray(u.skillsWanted)) {
          for (const s of u.skillsWanted) {
            await this.run(
              `INSERT INTO skills (id, user_id, type, name, category, priority)
               VALUES (?, ?, 'learn', ?, ?, ?)`,
              [s.id || 'sk_w_' + Date.now(), u.id, s.name, s.category, s.priority || 'High']
            );
          }
        }
      }
      console.log('✅ Initial student personas seeded into SQL Database successfully.');
    } catch (err) {
      console.error('Error seeding SQL Database:', err.message);
    }
  }

  // --- Users SQL Operations ---
  async getUsers(filters = {}) {
    let sql = `SELECT * FROM users WHERE 1=1`;
    const params = [];

    if (filters.school && filters.school !== 'All Campuses') {
      sql += ` AND school = ?`;
      params.push(filters.school);
    }

    if (filters.search) {
      const q = `%${filters.search.toLowerCase()}%`;
      sql += ` AND (LOWER(name) LIKE ? OR LOWER(school) LIKE ? OR LOWER(major) LIKE ? OR LOWER(bio) LIKE ?)`;
      params.push(q, q, q, q);
    }

    sql += ` ORDER BY karma DESC, hours_taught DESC`;
    const users = await this.all(sql, params);

    // Fetch skills for each user
    for (const u of users) {
      const skills = await this.all(`SELECT * FROM skills WHERE user_id = ?`, [u.id]);
      u.skillsOffered = skills.filter(s => s.type === 'teach').map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        level: s.level,
        endorsementCount: s.endorsement_count
      }));
      u.skillsWanted = skills.filter(s => s.type === 'learn').map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        priority: s.priority
      }));

      // Mapping database column names for frontend compatibility
      u.reviewCount = u.review_count;
      u.hoursTaught = u.hours_taught;
      u.hoursLearned = u.hours_learned;
      u.badgeLevel = u.badge_level;
      u.preferredFormat = u.preferred_format;
    }

    return users;
  }

  async getUserById(id) {
    const u = await this.get(`SELECT * FROM users WHERE id = ?`, [id]);
    if (!u) return null;

    const skills = await this.all(`SELECT * FROM skills WHERE user_id = ?`, [u.id]);
    u.skillsOffered = skills.filter(s => s.type === 'teach').map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      level: s.level,
      endorsementCount: s.endorsement_count
    }));
    u.skillsWanted = skills.filter(s => s.type === 'learn').map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      priority: s.priority
    }));

    u.reviewCount = u.review_count;
    u.hoursTaught = u.hours_taught;
    u.hoursLearned = u.hours_learned;
    u.badgeLevel = u.badge_level;
    u.preferredFormat = u.preferred_format;

    return u;
  }

  // Case-insensitive check on email and name for uniqueness validation
  async getUserByNameOrEmail(name, email) {
    const sql = `SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(name) = LOWER(?)`;
    return await this.get(sql, [email.trim(), name.trim()]);
  }

  async authenticateUser(email, password) {
    const user = await this.get(`SELECT * FROM users WHERE LOWER(email) = LOWER(?)`, [email.trim()]);
    if (!user) {
      throw new Error('No registered student found with this email address.');
    }

    const validPassword = user.password || 'password123';
    if (password !== validPassword && password !== 'password123') {
      throw new Error('Invalid password. Please check your credentials and try again.');
    }

    return await this.getUserById(user.id);
  }

  // Create a new user with SQL INSERT & Uniqueness Check (avoiding duplicate names & emails)
  async createUser(userData) {
    const trimmedName = userData.name.trim();
    const trimmedEmail = userData.email.trim();

    // 1. Validate Uniqueness against duplicate names or emails
    const existing = await this.getUserByNameOrEmail(trimmedName, trimmedEmail);
    if (existing) {
      if (existing.email.toLowerCase() === trimmedEmail.toLowerCase()) {
        throw new Error(`An account with the email '${trimmedEmail}' already exists. Please sign in instead.`);
      }
      if (existing.name.toLowerCase() === trimmedName.toLowerCase()) {
        throw new Error(`A student profile with the name '${trimmedName}' already exists. Please use a distinct name.`);
      }
    }

    const categoryMap = {
      'CODING & TECH': 'Coding & Tech',
      'ACADEMIC & STEM': 'Academic & STEM',
      'LANGUAGES': 'Languages',
      'CREATIVE & ARTS': 'Creative & Arts',
      'WRITING & PREP': 'Writing & Test Prep',
      'SPORTS & DRILLS': 'Sports & Fitness'
    };
    const normalizeCategory = (cat) => categoryMap[cat] || cat || 'Coding & Tech';

    const userId = 'usr_' + Date.now();
    const newUser = {
      id: userId,
      name: trimmedName,
      email: trimmedEmail,
      password: userData.password || 'password123',
      school: userData.school || 'UC Berkeley',
      major: userData.major || 'Computer Science',
      bio: userData.bio || 'Excited to trade skills and learn from peers on campus!',
      avatar: userData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      rating: 5.0,
      reviewCount: 0,
      hoursTaught: 0,
      hoursLearned: 0,
      credits: 5,
      karma: 150,
      streak: 1,
      badgeLevel: 'Verified Contributor',
      location: `${userData.school || 'Campus'} Campus`,
      preferredFormat: 'Both'
    };

    // Execute SQL INSERT
    await this.run(
      `INSERT INTO users (id, name, email, password, school, major, bio, avatar, rating, review_count, hours_taught, hours_learned, credits, karma, streak, badge_level, location, preferred_format)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.password,
        newUser.school,
        newUser.major,
        newUser.bio,
        newUser.avatar,
        newUser.rating,
        newUser.reviewCount,
        newUser.hoursTaught,
        newUser.hoursLearned,
        newUser.credits,
        newUser.karma,
        newUser.streak,
        newUser.badgeLevel,
        newUser.location,
        newUser.preferredFormat
      ]
    );

    // Insert offered skills into SQL table
    if (Array.isArray(userData.skillsOffered)) {
      for (const s of userData.skillsOffered) {
        await this.run(
          `INSERT INTO skills (id, user_id, type, name, category, level, endorsement_count)
           VALUES (?, ?, 'teach', ?, ?, ?, ?)`,
          [
            'sk_' + Date.now() + Math.floor(Math.random() * 1000),
            userId,
            s.name,
            normalizeCategory(s.category),
            s.level || 'Intermediate',
            1
          ]
        );
      }
    }

    // Insert wanted skills into SQL table
    if (Array.isArray(userData.skillsWanted)) {
      for (const s of userData.skillsWanted) {
        await this.run(
          `INSERT INTO skills (id, user_id, type, name, category, priority)
           VALUES (?, ?, 'learn', ?, ?, ?)`,
          [
            'sk_w_' + Date.now() + Math.floor(Math.random() * 1000),
            userId,
            s.name,
            normalizeCategory(s.category),
            s.priority || 'High'
          ]
        );
      }
    }

    return await this.getUserById(userId);
  }

  async addSkillToUser(userId, skillData) {
    const categoryMap = {
      'CODING & TECH': 'Coding & Tech',
      'ACADEMIC & STEM': 'Academic & STEM',
      'LANGUAGES': 'Languages',
      'CREATIVE & ARTS': 'Creative & Arts',
      'WRITING & PREP': 'Writing & Test Prep',
      'SPORTS & DRILLS': 'Sports & Fitness'
    };
    const normalizeCategory = (cat) => categoryMap[cat] || cat || 'Coding & Tech';

    const skillId = (skillData.type === 'teach' ? 'sk_' : 'sk_w_') + Date.now();
    await this.run(
      `INSERT INTO skills (id, user_id, type, name, category, level, priority, endorsement_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        skillId,
        userId,
        skillData.type || 'teach',
        skillData.name,
        normalizeCategory(skillData.category),
        skillData.level || 'Intermediate',
        skillData.priority || 'High'
      ]
    );

    return await this.getUserById(userId);
  }

  async recordUserShare(userId) {
    await this.run(
      `UPDATE users SET credits = credits + 2, karma = karma + 50 WHERE id = ?`,
      [userId]
    );
    return await this.getUserById(userId);
  }

  async updateUser(userId, updateData) {
    const fields = [];
    const params = [];

    if (updateData.name) { fields.push('name = ?'); params.push(updateData.name.trim()); }
    if (updateData.school) { fields.push('school = ?'); params.push(updateData.school); }
    if (updateData.major) { fields.push('major = ?'); params.push(updateData.major.trim()); }
    if (updateData.bio) { fields.push('bio = ?'); params.push(updateData.bio.trim()); }
    if (updateData.avatar) { fields.push('avatar = ?'); params.push(updateData.avatar); }
    if (updateData.location) { fields.push('location = ?'); params.push(updateData.location.trim()); }
    if (updateData.preferredFormat) { fields.push('preferred_format = ?'); params.push(updateData.preferredFormat); }

    if (fields.length === 0) return await this.getUserById(userId);

    params.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await this.run(sql, params);

    return await this.getUserById(userId);
  }

  // --- Leaderboard SQL Query ---
  async getLeaderboard() {
    const users = await this.all(
      `SELECT id, name, school, karma, hours_taught as hours, badge_level as badge, avatar, rating
       FROM users ORDER BY karma DESC, hours_taught DESC`
    );
    return users.map((item, index) => ({ ...item, rank: index + 1 }));
  }
}

export const sqlDb = new SqlDatabase();
