#!/usr/bin/env node
// scripts/migrate.js
// Run ONCE after creating your Turso database to create schema and seed initial data.
//
// Usage:
//   TURSO_DATABASE_URL=libsql://your-db.turso.io TURSO_AUTH_TOKEN=yourtoken node scripts/migrate.js
//
// Or set these in .env.local and use:
//   node -r dotenv/config scripts/migrate.js

import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error('❌ Missing TURSO_DATABASE_URL. Set it as an environment variable.');
  process.exit(1);
}

const db = createClient({ url, authToken });

async function migrate() {
  console.log('🗄️  Connecting to Turso database...');

  // ── Create Tables ──────────────────────────────────────────────────────────
  console.log('📐 Creating tables...');

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(128) NOT NULL,
      email VARCHAR(128) NOT NULL UNIQUE,
      password VARCHAR(128) NOT NULL DEFAULT 'password123',
      school VARCHAR(128) DEFAULT 'UC Berkeley',
      major VARCHAR(128) DEFAULT 'Computer Science',
      bio TEXT,
      avatar TEXT,
      rating REAL DEFAULT 5.0,
      review_count INTEGER DEFAULT 0,
      hours_taught INTEGER DEFAULT 0,
      hours_learned INTEGER DEFAULT 0,
      credits INTEGER DEFAULT 5,
      karma INTEGER DEFAULT 150,
      streak INTEGER DEFAULT 1,
      badge_level VARCHAR(64) DEFAULT 'Verified Contributor',
      location VARCHAR(128) DEFAULT 'Campus',
      preferred_format VARCHAR(32) DEFAULT 'Both',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skills (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      type VARCHAR(16) NOT NULL,
      name VARCHAR(128) NOT NULL,
      category VARCHAR(64) NOT NULL,
      level VARCHAR(64) DEFAULT 'Intermediate',
      priority VARCHAR(64) DEFAULT 'High',
      endorsement_count INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS swaps (
      id VARCHAR(64) PRIMARY KEY,
      sender_id VARCHAR(64) NOT NULL,
      sender_name VARCHAR(128),
      sender_avatar TEXT,
      sender_school VARCHAR(128),
      receiver_id VARCHAR(64) NOT NULL,
      type VARCHAR(32) NOT NULL DEFAULT 'Direct Swap',
      offered_skill VARCHAR(128),
      requested_skill VARCHAR(128) NOT NULL,
      format VARCHAR(32) DEFAULT 'Virtual Call',
      proposed_slot VARCHAR(128),
      status VARCHAR(32) DEFAULT 'Pending',
      message TEXT,
      credit_amount INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(64) PRIMARY KEY,
      host_id VARCHAR(64) NOT NULL,
      peer_id VARCHAR(64) NOT NULL,
      peer_name VARCHAR(128),
      peer_avatar TEXT,
      peer_school VARCHAR(128),
      skill VARCHAR(128) NOT NULL,
      format VARCHAR(32) DEFAULT 'Virtual Call',
      scheduled_time VARCHAR(128),
      duration VARCHAR(32) DEFAULT '60 mins',
      type VARCHAR(32) DEFAULT 'Direct Swap',
      room_code VARCHAR(64),
      status VARCHAR(32) DEFAULT 'Confirmed',
      location_detail VARCHAR(128),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id VARCHAR(64) PRIMARY KEY,
      target_user_id VARCHAR(64) NOT NULL,
      author_name VARCHAR(128) NOT NULL,
      author_avatar TEXT,
      author_school VARCHAR(128),
      rating REAL NOT NULL,
      skill VARCHAR(128),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id VARCHAR(64) PRIMARY KEY,
      participant1_id VARCHAR(64) NOT NULL,
      participant2_id VARCHAR(64) NOT NULL,
      participant1_name VARCHAR(128),
      participant2_name VARCHAR(128),
      participant1_avatar TEXT,
      participant2_avatar TEXT,
      last_message TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(64) PRIMARY KEY,
      conversation_id VARCHAR(64) NOT NULL,
      sender_id VARCHAR(64) NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notes (
      id VARCHAR(64) PRIMARY KEY,
      title TEXT NOT NULL,
      course VARCHAR(128) NOT NULL,
      author_name VARCHAR(128),
      author_school VARCHAR(128),
      category VARCHAR(64) DEFAULT 'Academic & STEM',
      type VARCHAR(64) DEFAULT 'Lecture Notes',
      pages INTEGER DEFAULT 5,
      credit_cost INTEGER DEFAULT 1,
      downloads INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0,
      exam_year VARCHAR(16),
      tags TEXT,
      summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Tables created.');

  // ── Seed Users ──────────────────────────────────────────────────────────────
  console.log('🌱 Seeding Priya Sharma and kk...');

  const existing = await db.execute({ sql: 'SELECT COUNT(*) as count FROM users', args: [] });
  if (existing.rows[0].count > 0) {
    console.log('⚠️  Users already seeded. Skipping user seed (use --force to reset).');
  } else {
    // Priya Sharma
    await db.execute({
      sql: `INSERT INTO users (id, name, email, password, school, major, bio, avatar, rating, review_count, hours_taught, hours_learned, credits, karma, streak, badge_level, location, preferred_format)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ['usr_priya', 'Priya Sharma', 'priya.sharma@berkeley.edu', 'priya123',
             'UC Berkeley', 'Computer Science (Junior)',
             'Passionate about full-stack web dev, Python backend, and algorithms. Prepping for study abroad in Madrid next spring.',
             'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
             5.0, 3, 32, 18, 8, 990, 6, 'Master Mentor', 'Berkeley, CA (Virtual & On-Campus)', 'Both']
    });
    // Priya skills
    for (const s of [
      ['sk_py', 'Python & Data Structures', 'Coding & Tech', 'teach', 'Advanced', 'High', 19],
      ['sk_react', 'React & Modern Web', 'Coding & Tech', 'teach', 'Advanced', 'High', 15],
      ['sk_algo', 'LeetCode & Technical Interview Prep', 'Coding & Tech', 'teach', 'Intermediate', 'High', 11],
      ['sk_es', 'Conversational Spanish', 'Languages', 'learn', 'Intermediate', 'High', 0],
      ['sk_speech', 'Public Speaking', 'Writing & Test Prep', 'learn', 'Beginner', 'Medium', 0]
    ]) {
      await db.execute({
        sql: `INSERT INTO skills (id, user_id, type, name, category, level, priority, endorsement_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [s[0], 'usr_priya', s[3], s[1], s[2], s[4], s[5], s[6]]
      });
    }

    // kk
    await db.execute({
      sql: `INSERT INTO users (id, name, email, password, school, major, bio, avatar, rating, review_count, hours_taught, hours_learned, credits, karma, streak, badge_level, location, preferred_format)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ['usr_1786965735374', 'kk', 'kk@univ.edu', 'kk123',
             'UC Berkeley', 'Computer Science',
             'Passionate about peer learning and trading tech & science skills on campus!',
             'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
             5.0, 1, 5, 2, 5, 200, 2, 'Verified Contributor', 'UC Berkeley Campus', 'Both']
    });
    await db.execute({
      sql: `INSERT INTO skills (id, user_id, type, name, category, level, priority, endorsement_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ['sk_kk_1', 'usr_1786965735374', 'teach', 'Computer Science & Full-Stack Web', 'Coding & Tech', 'Advanced', 'High', 2]
    });
    await db.execute({
      sql: `INSERT INTO skills (id, user_id, type, name, category, level, priority, endorsement_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ['sk_kk_w1', 'usr_1786965735374', 'learn', 'Spanish Conversation & Public Speaking', 'Languages', 'Beginner', 'High', 0]
    });

    console.log('✅ Seeded: Priya Sharma, kk');
  }

  // ── Seed Notes ──────────────────────────────────────────────────────────────
  const existingNotes = await db.execute({ sql: 'SELECT COUNT(*) as count FROM notes', args: [] });
  if (existingNotes.rows[0].count === 0) {
    console.log('📚 Seeding study notes...');
    const NOTES = [
      ['note_pyq_1', 'CS 61A: Fall 2024 Midterm 2 PYQ + Official Solved Step-by-Step', 'CS 61A', 'Priya Sharma', 'UC Berkeley', 'Coding & Tech', 'PYQ Paper', 14, 1, 142, 5.0, '2024', '["PYQ Exam","Tree Recursion","Environment Diagrams","Solved Solutions"]', 'Complete CS 61A Midterm 2 with step-by-step environment diagrams.'],
      ['note_pyq_2', 'MATH 53: Multivariable Calculus 2024 Final Exam PYQ + Solved Solutions', 'MATH 53 / 18.02', 'kk', 'UC Berkeley', 'Academic & STEM', 'PYQ Paper', 10, 1, 118, 4.9, '2024', '["PYQ Exam","Stokes Theorem","Surface Integrals"]', 'Complete 2024 Final with detailed vector calculus derivations.'],
      ['note_1', 'CS 61A: Complete Recursion, Trees & OOP Midterm Cheatsheet', 'CS 61A', 'Priya Sharma', 'UC Berkeley', 'Coding & Tech', 'Lecture Notes', 6, 1, 84, 5.0, null, '["Python","Algorithms","Midterm Prep"]', 'Hand-annotated summary of tree recursion and OOP patterns.'],
    ];
    for (const n of NOTES) {
      await db.execute({
        sql: `INSERT INTO notes (id, title, course, author_name, author_school, category, type, pages, credit_cost, downloads, rating, exam_year, tags, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: n
      });
    }
    console.log('✅ Notes seeded.');
  }

  console.log('\n🎉 Migration complete! Your Turso database is ready.');
  console.log('   Next: Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to your Vercel project environment variables.');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
