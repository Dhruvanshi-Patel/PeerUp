// lib/db.js — Shared Turso (libSQL) connection for all Vercel Serverless Functions
// Reads TURSO_DATABASE_URL and TURSO_AUTH_TOKEN from env (set in Vercel dashboard)
// For local dev: set these in .env.local

import { createClient } from '@libsql/client';

let _client = null;

export function getDb() {
  if (_client) return _client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      'TURSO_DATABASE_URL environment variable is not set. ' +
      'Add it to your Vercel project environment variables and to .env.local for local dev.'
    );
  }

  _client = createClient({
    url,
    authToken: authToken || undefined
  });

  return _client;
}
