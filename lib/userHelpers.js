// lib/userHelpers.js — Shared helpers for building user objects from DB rows
// Used by all /api/users/* functions

export function isUniversityEmail(email) {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1].toLowerCase();
  const commercial = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'protonmail.com', 'gmx.com'];
  if (commercial.includes(domain)) return false;
  return (
    domain.endsWith('.edu') ||
    domain.endsWith('.ac.uk') ||
    domain.endsWith('.ac.in') ||
    domain.endsWith('.edu.in') ||
    domain.endsWith('.edu.au') ||
    domain.endsWith('.edu.ca') ||
    domain.endsWith('.edu.sg') ||
    domain.includes('.edu.') ||
    domain.includes('univ') ||
    domain.includes('college') ||
    domain.includes('school')
  );
}

export const CATEGORY_MAP = {
  'CODING & TECH': 'Coding & Tech',
  'ACADEMIC & STEM': 'Academic & STEM',
  'LANGUAGES': 'Languages',
  'CREATIVE & ARTS': 'Creative & Arts',
  'WRITING & PREP': 'Writing & Test Prep',
  'SPORTS & DRILLS': 'Sports & Fitness'
};

export const normalizeCategory = (cat) => CATEGORY_MAP[cat] || cat || 'Coding & Tech';

/** Attach skillsOffered + skillsWanted arrays and remap snake_case → camelCase */
export async function hydrateUser(db, row) {
  if (!row) return null;
  const skills = await db.execute({
    sql: 'SELECT * FROM skills WHERE user_id = ?',
    args: [row.id]
  });
  const rows = skills.rows;
  return {
    ...row,
    reviewCount: row.review_count,
    hoursTaught: row.hours_taught,
    hoursLearned: row.hours_learned,
    badgeLevel: row.badge_level,
    preferredFormat: row.preferred_format,
    skillsOffered: rows
      .filter(s => s.type === 'teach')
      .map(s => ({ id: s.id, name: s.name, category: s.category, level: s.level, endorsementCount: s.endorsement_count })),
    skillsWanted: rows
      .filter(s => s.type === 'learn')
      .map(s => ({ id: s.id, name: s.name, category: s.category, priority: s.priority }))
  };
}
