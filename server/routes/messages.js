import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// GET /api/messages/conversations - List all conversation threads
router.get('/conversations', (req, res) => {
  try {
    const { userId } = req.query;
    const conversations = store.getConversations(userId);
    res.json({ success: true, count: conversations.length, data: conversations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/messages/:conversationId - Get messages for a conversation
router.get('/:conversationId', (req, res) => {
  try {
    const conv = store.getConversationById(req.params.conversationId);
    if (!conv) {
      return res.status(404).json({ success: false, error: 'Conversation thread not found' });
    }
    res.json({ success: true, data: conv.messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/messages - Send a message to peer
router.post('/', (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;
    if (!conversationId || !senderId || !text) {
      return res.status(400).json({ success: false, error: 'conversationId, senderId, and text are required' });
    }

    const result = store.sendMessage(conversationId, senderId, text);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
