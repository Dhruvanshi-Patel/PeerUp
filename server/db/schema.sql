-- PeerUp SQLite / MySQL Database Schema
-- Defines relational tables for Users, Skills, Swaps, Sessions, Reviews, and Notes

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
  review_count INT DEFAULT 0,
  hours_taught INT DEFAULT 0,
  hours_learned INT DEFAULT 0,
  credits INT DEFAULT 5,
  karma INT DEFAULT 150,
  streak INT DEFAULT 1,
  badge_level VARCHAR(64) DEFAULT 'Verified Contributor',
  location VARCHAR(128) DEFAULT 'Campus',
  preferred_format VARCHAR(32) DEFAULT 'Both',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  type VARCHAR(16) NOT NULL, -- 'teach' or 'learn'
  name VARCHAR(128) NOT NULL,
  category VARCHAR(64) NOT NULL,
  level VARCHAR(64) DEFAULT 'Intermediate',
  priority VARCHAR(64) DEFAULT 'High',
  endorsement_count INT DEFAULT 1,
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
  credit_amount INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (target_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS referrals (
  id VARCHAR(64) PRIMARY KEY,
  referrer_id VARCHAR(64) NOT NULL,
  referred_user_id VARCHAR(64) NOT NULL,
  referred_user_name VARCHAR(128),
  credits_awarded INT DEFAULT 2,
  karma_awarded INT DEFAULT 50,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE
);

