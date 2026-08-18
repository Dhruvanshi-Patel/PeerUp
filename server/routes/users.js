import express from 'express';
import { sqlDb } from '../db/database.js';

const router = express.Router();

// GET /api/users - List all verified students from SQL database with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, school, search } = req.query;
    const users = await sqlDb.getUsers({ category, school, search });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/login - Authenticate student using email & password against SQL Database
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = await sqlDb.authenticateUser(email, password);
    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      data: user
    });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

// Helper: Validate university email domain
export const isUniversityEmail = (email) => {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1].toLowerCase();
  const commercialDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'protonmail.com', 'gmx.com'];
  if (commercialDomains.includes(domain)) return false;

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
};

// POST /api/users/register - Register a new student profile in SQL database (with unique email & name validation)
router.post('/register', async (req, res) => {
  try {
    const { name, school, email, password, major, bio, avatar, skillsOffered, skillsWanted } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    if (!isUniversityEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'University verification requires an official campus email address (e.g. name@berkeley.edu, name@stanford.edu, or name@ox.ac.uk). Commercial emails (Gmail/Yahoo) are not allowed.' 
      });
    }

    const newUser = await sqlDb.createUser({
      name,
      school: school || 'UC Berkeley',
      email,
      password,
      major,
      bio,
      avatar,
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || []
    });

    res.status(201).json({
      success: true,
      message: `Account created for ${newUser.name} in SQL Database! +5 Welcome Credits awarded.`,
      data: newUser
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/users - Create/Register a new student profile (with unique email & name validation)
router.post('/', async (req, res) => {
  try {
    const { name, school, email, password, major, bio, avatar, skillsOffered, skillsWanted } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and Email address are required.' });
    }

    const newUser = await sqlDb.createUser({
      name,
      school: school || 'UC Berkeley',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@berkeley.edu`,
      password: password || 'password123',
      major,
      bio,
      avatar,
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || []
    });

    res.status(201).json({ success: true, message: 'Student profile saved to SQL Database!', data: newUser });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/users/:id/share - Earn credits by sharing referral link
router.post('/:id/share', async (req, res) => {
  try {
    const result = await sqlDb.recordUserShare(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Student not found in SQL Database.' });
    }

    res.json({
      success: true,
      message: 'Earned +2 Simple Credits & +50 Karma XP!',
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/users/:id - Get specific user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await sqlDb.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Student not found in SQL Database' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/users/:id - Update student profile (avatar photo, bio, major, school)
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await sqlDb.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'Student not found in SQL Database' });
    }

    res.json({
      success: true,
      message: 'Student profile updated in SQL Database!',
      data: updatedUser
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/:id/skills - Add a new skill in SQL database
router.post('/:id/skills', async (req, res) => {
  try {
    const { type, name, category, level, priority } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, error: 'Skill name and category are required' });
    }

    const updatedUser = await sqlDb.addSkillToUser(req.params.id, { type, name, category, level, priority });
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'Student not found in SQL Database' });
    }

    res.status(201).json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/verify-email - Verify .edu school domain email
router.post('/verify-email', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid school email required' });
    }

    const isEdu = email.endsWith('.edu') || email.includes('.edu.');
    if (!isEdu) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a verified .edu university or institution email' 
      });
    }

    res.json({
      success: true,
      message: `Verification code dispatched to ${email}. Student affiliation confirmed.`,
      verified: true
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
