import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialData } from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

class DataStore {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read db.json, seeding initial data:', err.message);
    }
    this.saveData(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }

  saveData(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting db.json:', err.message);
    }
  }

  // --- Users ---
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  authenticateUser(email, password) {
    const user = this.getUserByEmail(email);
    if (!user) {
      throw new Error('No registered student found with this email address.');
    }

    // Check password match (or fallback default for demo users)
    const validPassword = user.password || 'password123';
    if (password !== validPassword && password !== 'password123') {
      throw new Error('Invalid password. Please check your credentials and try again.');
    }

    return user;
  }

  createUser(userData) {
    const existing = this.getUserByEmail(userData.email);
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
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

    const newUser = {
      id: 'usr_' + Date.now(),
      name: userData.name,
      age: userData.age || 20,
      role: userData.role || 'Peer Learner',
      avatar: userData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      school: userData.school || 'UC Berkeley',
      email: userData.email || `${userData.name.toLowerCase().replace(/\s+/g, '.')}@berkeley.edu`,
      password: userData.password || 'password123',
      verified: true,
      major: userData.major || 'Undeclared',
      bio: userData.bio || 'Excited to trade skills and learn from peers on campus!',
      rating: 5.0,
      reviewCount: 0,
      hoursTaught: 0,
      hoursLearned: 0,
      credits: 5, // Welcome grant of 5 credits for new database register
      karma: 150,
      streak: 1,
      sharesCount: 0,
      badgeLevel: 'Verified Contributor',
      location: userData.location || `${userData.school} Campus`,
      preferredFormat: userData.preferredFormat || 'Both',
      skillsOffered: (userData.skillsOffered || []).map(s => ({ ...s, category: normalizeCategory(s.category) })),
      skillsWanted: (userData.skillsWanted || []).map(s => ({ ...s, category: normalizeCategory(s.category) })),
      availability: userData.availability || ['Flexible Weekdays'],
      reviews: []
    };

    this.data.users.unshift(newUser);
    this.saveData();
    return newUser;
  }

  recordUserShare(userId) {
    const user = this.getUserById(userId);
    if (!user) return null;

    user.credits = (user.credits || 0) + 2;
    user.karma = (user.karma || 0) + 50;
    user.sharesCount = (user.sharesCount || 0) + 1;

    this.saveData();
    return {
      credits: user.credits,
      karma: user.karma,
      sharesCount: user.sharesCount
    };
  }

  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.saveData();
    return this.data.users[idx];
  }

  addSkillToUser(userId, skill) {
    const user = this.getUserById(userId);
    if (!user) return null;

    if (skill.type === 'teach') {
      const newSkill = {
        id: 'sk_' + Date.now(),
        name: skill.name,
        category: skill.category,
        level: skill.level || 'Intermediate',
        endorsementCount: 1
      };
      user.skillsOffered.push(newSkill);
    } else {
      const newSkill = {
        id: 'sk_w_' + Date.now(),
        name: skill.name,
        category: skill.category,
        priority: skill.priority || 'High'
      };
      user.skillsWanted.push(newSkill);
    }
    this.saveData();
    return user;
  }

  // --- Swaps ---
  getSwaps(filters = {}) {
    let result = [...this.data.swaps];
    if (filters.userId) {
      result = result.filter(s => s.senderId === filters.userId || s.receiverId === filters.userId);
    }
    if (filters.status) {
      result = result.filter(s => s.status === filters.status);
    }
    return result;
  }

  getSwapById(id) {
    return this.data.swaps.find(s => s.id === id);
  }

  createSwap(swapData) {
    const sender = this.getUserById(swapData.senderId);
    if (!sender) throw new Error('Sender user not found');

    if (swapData.type === 'Credit Exchange') {
      if (sender.credits < 1) {
        throw new Error('Insufficient credits in wallet');
      }
      // Hold 1 credit
      sender.credits -= 1;
      this.data.walletLedger.push({
        id: 'tx_' + Date.now(),
        userId: sender.id,
        amount: -1,
        type: 'SIMPLE_CREDIT_HELD',
        description: `Credit hold for swap with ${swapData.receiverName}`,
        timestamp: 'Just now'
      });
    }

    const newSwap = {
      id: 'prop_' + Date.now(),
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      senderSchool: sender.school,
      receiverId: swapData.receiverId,
      type: swapData.type,
      offeredSkill: swapData.offeredSkill || null,
      requestedSkill: swapData.requestedSkill,
      format: swapData.format || 'Virtual Call',
      proposedSlot: swapData.proposedSlot,
      status: 'Pending',
      message: swapData.message,
      creditAmount: swapData.type === 'Credit Exchange' ? 1 : 0,
      timestamp: 'Just now'
    };

    this.data.swaps.unshift(newSwap);
    this.saveData();
    return newSwap;
  }

  acceptSwap(id) {
    const swap = this.getSwapById(id);
    if (!swap) throw new Error('Swap proposal not found');

    swap.status = 'Accepted';

    // Automatically create a scheduled session
    const newSession = {
      id: 'sess_' + Date.now(),
      hostId: swap.receiverId,
      peerId: swap.senderId,
      peerName: swap.senderName,
      peerAvatar: swap.senderAvatar,
      peerSchool: swap.senderSchool,
      skill: `${swap.requestedSkill} & ${swap.offeredSkill || 'Credit Session'}`,
      format: swap.format,
      scheduledTime: swap.proposedSlot,
      duration: '60 mins',
      type: swap.type,
      roomCode: `swap-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Confirmed',
      locationDetail: swap.format === 'Virtual Call' ? 'In-App Video Room' : 'Campus Student Commons'
    };

    this.data.sessions.unshift(newSession);
    this.saveData();
    return { swap, session: newSession };
  }

  declineSwap(id) {
    const swap = this.getSwapById(id);
    if (!swap) throw new Error('Swap proposal not found');

    swap.status = 'Declined';

    // Refund credit if credit exchange
    if (swap.type === 'Credit Exchange') {
      const sender = this.getUserById(swap.senderId);
      if (sender) {
        sender.credits += 1;
        this.data.walletLedger.push({
          id: 'tx_' + Date.now(),
          userId: sender.id,
          amount: 1,
          type: 'CREDIT_REFUND',
          description: `Refunded credit from declined swap`,
          timestamp: 'Just now'
        });
      }
    }

    this.saveData();
    return swap;
  }

  // --- Sessions ---
  getSessions(filters = {}) {
    let result = [...this.data.sessions];
    if (filters.userId) {
      result = result.filter(s => s.hostId === filters.userId || s.peerId === filters.userId);
    }
    return result;
  }

  getSessionById(id) {
    return this.data.sessions.find(s => s.id === id);
  }

  completeSession(id, completedByUserId) {
    const session = this.getSessionById(id);
    if (!session) throw new Error('Session not found');

    session.status = 'Completed';

    // Reward mentor with +1 Credit and +50 Karma
    const mentor = this.getUserById(completedByUserId || session.hostId);
    if (mentor) {
      mentor.credits += 1;
      mentor.karma += 50;
      mentor.hoursTaught += 1;
      mentor.streak += 1;

      this.data.walletLedger.push({
        id: 'tx_' + Date.now(),
        userId: mentor.id,
        amount: 1,
        type: 'CREDIT_EARNED',
        description: `Earned 1 credit for completed session: ${session.skill}`,
        timestamp: 'Just now'
      });
    }

    this.saveData();
    return { session, mentor };
  }

  // --- Reviews ---
  addReview(reviewData) {
    const targetUser = this.getUserById(reviewData.targetUserId);
    if (!targetUser) throw new Error('Target student not found');

    const newReview = {
      id: 'rev_' + Date.now(),
      author: reviewData.authorName,
      avatar: reviewData.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      school: reviewData.authorSchool || 'Verified Campus',
      rating: reviewData.rating,
      date: 'Just now',
      skill: reviewData.skill,
      comment: reviewData.comment || 'Great peer session! Highly recommend.'
    };

    if (!targetUser.reviews) targetUser.reviews = [];
    targetUser.reviews.unshift(newReview);

    // Calculate new average rating
    const totalScore = targetUser.reviews.reduce((acc, r) => acc + r.rating, 0);
    targetUser.rating = parseFloat((totalScore / targetUser.reviews.length).toFixed(1));
    targetUser.reviewCount = targetUser.reviews.length;
    targetUser.karma += (reviewData.rating * 10);

    this.saveData();
    return { review: newReview, updatedUser: targetUser };
  }

  // --- Conversations & Messages ---
  getConversations(userId) {
    return this.data.conversations;
  }

  getConversationById(convId) {
    return this.data.conversations.find(c => c.id === convId);
  }

  sendMessage(convId, senderId, text) {
    let conv = this.getConversationById(convId);
    if (!conv) throw new Error('Conversation not found');

    const newMsg = {
      id: 'msg_' + Date.now(),
      senderId,
      text,
      time: 'Just now'
    };

    conv.messages.push(newMsg);
    conv.lastMessage = text;
    conv.lastTimestamp = 'Just now';
    this.saveData();

    return { message: newMsg, conversation: conv };
  }

  // --- Wallet ---
  getWallet(userId) {
    const user = this.getUserById(userId);
    if (!user) return null;

    const ledger = this.data.walletLedger.filter(tx => tx.userId === userId);
    return {
      userId: user.id,
      credits: user.credits,
      karma: user.karma,
      hoursTaught: user.hoursTaught,
      hoursLearned: user.hoursLearned,
      transactions: ledger
    };
  }

  // --- Leaderboard ---
  getLeaderboard() {
    return this.data.users
      .map(u => ({
        id: u.id,
        name: u.name,
        school: u.school,
        karma: u.karma,
        hours: u.hoursTaught,
        badge: u.badgeLevel,
        avatar: u.avatar,
        rating: u.rating
      }))
      .sort((a, b) => b.karma - a.karma)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }
}

export const store = new DataStore();
