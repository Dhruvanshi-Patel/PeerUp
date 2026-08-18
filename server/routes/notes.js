import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

let INITIAL_NOTES = [
  {
    id: "note_pyq_1",
    title: "CS 61A: Fall 2024 Midterm 2 PYQ + Official Solved Step-by-Step",
    course: "CS 61A",
    authorName: "Priya Sharma",
    authorSchool: "UC Berkeley",
    category: "Coding & Tech",
    type: "PYQ Paper",
    pages: 14,
    creditCost: 1,
    downloads: 142,
    rating: 5.0,
    examYear: "2024",
    tags: ["PYQ Exam", "Tree Recursion", "Environment Diagrams", "Solved Solutions"],
    summary: "Senior verified PYQ paper: Complete CS 61A Midterm 2 with step-by-step hand-drawn environment diagrams and code solution commentary."
  },
  {
    id: "note_pyq_2",
    title: "MATH 53: Multivariable Calculus 2024 Final Exam PYQ + Solved Solutions",
    course: "MATH 53 / 18.02",
    authorName: "Marcus Vance",
    authorSchool: "MIT",
    category: "Academic & STEM",
    type: "PYQ Paper",
    pages: 10,
    creditCost: 1,
    downloads: 118,
    rating: 4.9,
    examYear: "2024",
    tags: ["PYQ Exam", "Stokes' Theorem", "Surface Integrals", "Solved Solutions"],
    summary: "Complete 2024 Final Exam PYQ with detailed vector calculus derivations, 3D surface sketches, and Green's Theorem proofs."
  },
  {
    id: "note_1",
    title: "CS 61A: Complete Recursion, Trees & OOP Midterm Cheatsheet",
    course: "CS 61A",
    authorName: "Priya Sharma",
    authorSchool: "UC Berkeley",
    category: "Coding & Tech",
    type: "Lecture Notes",
    pages: 6,
    creditCost: 1,
    downloads: 84,
    rating: 5.0,
    tags: ["Python", "Algorithms", "Midterm Prep"],
    summary: "Hand-annotated summary of tree recursion, environment diagrams, OOP dispatch, and linked list patterns with solved past exam problems."
  },
  {
    id: "note_2",
    title: "CHEM 3A: Organic Chemistry 2024 Midterm PYQ & Synthesis Mindmaps",
    course: "CHEM 3A / 14C",
    authorName: "David Kim",
    authorSchool: "Columbia",
    category: "Academic & STEM",
    type: "PYQ Paper",
    pages: 12,
    creditCost: 1,
    downloads: 128,
    rating: 4.9,
    examYear: "2024",
    tags: ["PYQ Exam", "Reaction Mechanisms", "Stereochemistry"],
    summary: "Color-coded arrow pushing diagrams for all alkene, alkyne, and alcohol reactions with spectroscopy IR/NMR tables and past exam PYQs."
  },
  {
    id: "note_3",
    title: "Spanish DELE B2/C1 Conversational Idioms & Subjunctive Guide",
    course: "SPAN 102",
    authorName: "Elena Rostova",
    authorSchool: "UT Austin",
    category: "Languages",
    type: "Lecture Notes",
    pages: 8,
    creditCost: 1,
    downloads: 62,
    rating: 5.0,
    tags: ["Spanish", "Grammar", "Vocabulary"],
    summary: "100 high-yield colloquial idioms, subjunctive trigger phrases, and Madrid study-abroad dialogue scripts."
  }
];

// GET /api/notes - List all available study notes
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let result = [...INITIAL_NOTES];

  if (category && category !== 'all') {
    result = result.filter(n => n.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(n => 
      n.title.toLowerCase().includes(q) ||
      n.course.toLowerCase().includes(q) ||
      n.authorSchool.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// POST /api/notes - Upload / List new study notes
router.post('/', (req, res) => {
  try {
    const { title, course, authorName, authorSchool, category, pages, tags, summary } = req.body;
    if (!title || !course) {
      return res.status(400).json({ success: false, error: 'Title and Course are required' });
    }

    const newNote = {
      id: 'note_' + Date.now(),
      title,
      course,
      authorName: authorName || 'Student Peer',
      authorSchool: authorSchool || 'Verified Campus',
      category: category || 'Academic & STEM',
      pages: pages || 5,
      creditCost: 1,
      downloads: 0,
      rating: 5.0,
      tags: tags || ['Course Notes'],
      summary: summary || 'Comprehensive student class notes.'
    };

    INITIAL_NOTES.unshift(newNote);
    res.status(201).json({ success: true, message: 'Notes published to campus swap hub!', data: newNote });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/notes/:id/unlock - Unlock notes using 1 credit
router.post('/:id/unlock', (req, res) => {
  try {
    const { userId } = req.body;
    const note = INITIAL_NOTES.find(n => n.id === req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Study guide not found' });
    }

    const user = store.getUserById(userId);
    if (user) {
      if (user.credits < 1) {
        return res.status(400).json({ success: false, error: 'You need at least 1 credit to unlock this guide.' });
      }
      user.credits -= 1;
      store.saveData();
    }

    note.downloads += 1;
    res.json({
      success: true,
      message: `Unlocked "${note.title}"! 1 credit spent.`,
      data: {
        note,
        downloadUrl: `https://omnikon.edu/download/${note.id}.pdf`
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
