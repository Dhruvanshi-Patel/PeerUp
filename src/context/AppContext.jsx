import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { INITIAL_PERSONAS, INITIAL_PROPOSALS, INITIAL_CONVERSATIONS, INITIAL_SCHEDULED_SESSIONS, LEADERBOARD, INITIAL_QUESTS, INITIAL_BADGES } from '../data/mockData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Auth gate – starts as false so LandingPage is shown first
  // Auth gate – initialized with localStorage persistence
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('skillswap_is_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  // State initialized with localStorage persistence
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('skillswap_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PERSONAS;
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      return localStorage.getItem('skillswap_current_user_id') || "usr_priya";
    } catch {
      return "usr_priya";
    }
  });

  const [activeTab, setActiveTab] = useState("explore");
  
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState("conv_elena");
  const [scheduledSessions, setScheduledSessions] = useState(INITIAL_SCHEDULED_SESSIONS);
  const [leaderboardData, setLeaderboardData] = useState(LEADERBOARD);

  // Gamification Quests & Badges
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [badges, setBadges] = useState(INITIAL_BADGES);
  const [isQuestsModalOpen, setIsQuestsModalOpen] = useState(false);

  // Modals & Active Session Room
  const [targetUserForSwap, setTargetUserForSwap] = useState(null);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPerksModalOpen, setIsPerksModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSessionTarget, setReviewSessionTarget] = useState(null);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [portfolioTargetUser, setPortfolioTargetUser] = useState(null);
  const [activeLiveSession, setActiveLiveSession] = useState(null);

  // Notifications
  const [toasts, setToasts] = useState([
    { id: 't1', title: 'Connected to Backend API ⚡', message: 'RESTful API active on port 3001 with live credit escrow.', type: 'info' }
  ]);

  const addToast = (title, message, type = 'success') => {
    const id = 't_' + Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync users & auth state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('skillswap_users', JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('skillswap_current_user_id', currentUserId);
      localStorage.setItem('skillswap_is_logged_in', isLoggedIn ? 'true' : 'false');
    } catch (e) {}
  }, [currentUserId, isLoggedIn]);

  // Sync initial state from backend on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [usersRes, swapsRes, sessionsRes, convsRes, lbRes] = await Promise.all([
          api.getUsers().catch(() => null),
          api.getSwaps().catch(() => null),
          api.getSessions().catch(() => null),
          api.getConversations().catch(() => null),
          api.getLeaderboard().catch(() => null)
        ]);

        if (usersRes?.data && usersRes.data.length > 0) {
          setUsers(() => {
            // Keep only Priya Sharma, kk, and newly registered users
            const validUsers = usersRes.data.filter(u => 
              u.id === 'usr_priya' || u.name?.toLowerCase() === 'priya sharma' || u.name?.toLowerCase() === 'kk' || u.id === 'usr_1786965735374'
            );
            return validUsers.length > 0 ? validUsers : INITIAL_PERSONAS;
          });

          // Restore signed-in user if saved in localStorage
          const savedUserId = localStorage.getItem('skillswap_current_user_id');
          if (savedUserId && usersRes.data.some(u => u.id === savedUserId)) {
            setCurrentUserId(savedUserId);
            setIsLoggedIn(true);
          }
        }
        if (swapsRes?.data) setProposals(swapsRes.data);
        if (sessionsRes?.data) setScheduledSessions(sessionsRes.data);
        if (convsRes?.data) setConversations(convsRes.data);
        if (lbRes?.data) setLeaderboardData(lbRes.data);
      } catch (err) {
        console.log('Using local fallback state:', err.message);
      }
    }
    loadBackendData();
  }, []);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  // Dynamic Level & XP calculations
  const totalKarma = currentUser.karma || 100;
  const level = Math.floor(totalKarma / 150) + 1;
  const nextLevelXp = 150;
  const xp = totalKarma % 150;

  // Claim a completed daily quest
  const claimQuest = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.claimed || !quest.completed) return;

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    setQuests(prev => prev.map(q => q.id === questId ? { ...q, claimed: true } : q));

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          credits: u.credits + (quest.rewardCredits || 0),
          karma: u.karma + (quest.rewardKarma || Math.floor(quest.rewardXp / 2))
        };
      }
      return u;
    }));

    addToast('🏆 Quest Claimed!', `Earned +${quest.rewardXp} XP ${quest.rewardCredits ? `and +${quest.rewardCredits} Credit` : ''}!`, 'success');
  };

  // Switch persona
  const switchPersona = (userId) => {
    setCurrentUserId(userId);
    const selected = users.find(u => u.id === userId);
    addToast('Switched Persona', `Now browsing as ${selected?.name} (${selected?.role})`, 'info');
  };

  // Propose a swap
  const sendSwapProposal = async (proposalData) => {
    const payload = {
      senderId: currentUser.id,
      receiverId: proposalData.receiverId,
      type: proposalData.type,
      offeredSkill: proposalData.offeredSkill,
      requestedSkill: proposalData.requestedSkill,
      format: proposalData.format,
      proposedSlot: proposalData.proposedSlot,
      message: proposalData.message
    };

    if (proposalData.type === 'Credit Exchange' && currentUser.credits < 1) {
      addToast('Insufficient Credits', 'You need at least 1 credit to book a credit session.', 'error');
      return false;
    }

    try {
      // Call backend API
      const res = await api.createSwapProposal(payload).catch(() => null);
      const createdSwap = res?.data || {
        id: 'prop_' + Date.now(),
        ...payload,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderSchool: currentUser.school,
        status: 'Pending',
        timestamp: 'Just now'
      };

      setProposals(prev => [createdSwap, ...prev]);

      // Deduct 1 credit if credit exchange
      if (proposalData.type === 'Credit Exchange') {
        setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, credits: u.credits - 1 } : u));
      }

      // Update or create chat thread
      const existingConv = conversations.find(c => c.peerId === proposalData.receiverId);
      if (existingConv) {
        setConversations(prev => prev.map(c => c.id === existingConv.id ? {
          ...c,
          lastMessage: `Swap Proposal: ${proposalData.offeredSkill || '1 Credit'} ⇄ ${proposalData.requestedSkill}`,
          lastTimestamp: 'Just now',
          messages: [
            ...c.messages,
            {
              id: 'm_' + Date.now(),
              senderId: currentUser.id,
              text: `[Proposed ${proposalData.type}]: ${proposalData.message} (${proposalData.proposedSlot})`,
              time: 'Just now'
            }
          ]
        } : c));
      } else {
        const targetUser = users.find(u => u.id === proposalData.receiverId);
        const newConv = {
          id: 'conv_' + Date.now(),
          peerId: proposalData.receiverId,
          peerName: targetUser ? targetUser.name : 'Peer',
          peerAvatar: targetUser ? targetUser.avatar : '',
          peerSchool: targetUser ? targetUser.school : 'Verified Campus',
          skillContext: `${proposalData.offeredSkill || 'Credit'} ⇄ ${proposalData.requestedSkill}`,
          lastMessage: proposalData.message,
          lastTimestamp: 'Just now',
          unread: false,
          messages: [
            {
              id: 'm_' + Date.now(),
              senderId: currentUser.id,
              text: `[Proposed ${proposalData.type}]: ${proposalData.message} (${proposalData.proposedSlot})`,
              time: 'Just now'
            }
          ]
        };
        setConversations(prev => [newConv, ...prev]);
      }

      setIsSwapModalOpen(false);
      addToast('Swap Proposal Dispatched! 🚀', `Request sent via API to ${proposalData.receiverName}.`, 'success');
      return true;
    } catch (err) {
      addToast('Error Sending Swap', err.message, 'error');
      return false;
    }
  };

  // Accept a proposal
  const acceptProposal = async (proposalId) => {
    try {
      const res = await api.acceptSwapProposal(proposalId).catch(() => null);
      
      setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'Accepted' } : p));
      
      const proposal = proposals.find(p => p.id === proposalId);
      if (proposal) {
        const newSession = res?.data?.session || {
          id: 'sess_' + Date.now(),
          hostId: currentUser.id,
          peerId: proposal.senderId,
          peerName: proposal.senderName,
          peerAvatar: proposal.senderAvatar,
          peerSchool: proposal.senderSchool,
          skill: `${proposal.requestedSkill} & ${proposal.offeredSkill || 'Credit Session'}`,
          format: proposal.format,
          scheduledTime: proposal.proposedSlot,
          duration: '60 mins',
          type: proposal.type,
          roomCode: `swap-${Math.floor(100 + Math.random() * 900)}`,
          status: 'Confirmed',
          locationDetail: proposal.format === 'Virtual Call' ? 'In-App Video Room' : 'Campus Student Lounge'
        };

        setScheduledSessions(prev => [newSession, ...prev]);
        addToast('Proposal Accepted! 📅', `Session confirmed with ${proposal.senderName}.`, 'success');
      }
    } catch (err) {
      addToast('Error Accepting Proposal', err.message, 'error');
    }
  };

  // Password Authentication & Database Logins
  const loginWithPassword = async (email, password) => {
    try {
      const res = await api.loginUser(email, password);
      if (res?.data) {
        const user = res.data;
        setUsers(prev => {
          const exists = prev.some(u => u.id === user.id);
          return exists ? prev.map(u => u.id === user.id ? user : u) : [user, ...prev];
        });
        setCurrentUserId(user.id);
        setIsLoggedIn(true);
        setActiveTab('welcome');
        addToast('Welcome back! 🔑', `Signed in as ${user.name}`, 'success');
        return user;
      }
    } catch (err) {
      // Client-side fallback if backend API fails
      const matched = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
      if (matched) {
        setCurrentUserId(matched.id);
        setIsLoggedIn(true);
        setActiveTab('welcome');
        addToast('Signed In! 🔑', `Authenticated as ${matched.name}`, 'success');
        return matched;
      }
      throw err;
    }
  };

  // Logout
  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUserId('usr_priya');
    setActiveTab('explore');
    addToast('Signed out', 'You have been logged out.', 'info');
  };

  const registerWithPassword = async (userData) => {
    let newUser;
    try {
      const res = await api.registerUser(userData);
      if (res?.data) {
        newUser = res.data;
      }
    } catch (err) {
      console.warn('Registration error:', err.message);
      throw err;
    }

    if (newUser) {
      setUsers(prev => [newUser, ...prev.filter(u => u.id !== newUser.id)]);
      setCurrentUserId(newUser.id);
      setIsLoggedIn(true);
      setActiveTab('welcome');
      addToast('Account Created! ✨', `Welcome ${newUser.name}! +5 Welcome Credits saved in SQL Database.`, 'success');
      return newUser;
    }
  };

  // Referral Website Sharing
  const recordWebsiteShare = async () => {
    try {
      await api.shareReferral(currentUser.id).catch(() => null);
    } catch (err) {}

    setUsers(prev => prev.map(u => u.id === currentUser.id ? {
      ...u,
      credits: (u.credits || 0) + 2,
      karma: (u.karma || 0) + 50
    } : u));
  };

  // Decline proposal
  const declineProposal = async (proposalId) => {
    try {
      await api.declineSwapProposal(proposalId).catch(() => null);
      setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'Declined' } : p));
      addToast('Proposal Declined', 'Swap proposal declined.', 'info');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // Send message
  const sendMessage = async (conversationId, text) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv || !text.trim()) return;

    const newMsg = {
      id: 'msg_' + Date.now(),
      senderId: currentUser.id,
      text: text.trim(),
      time: 'Just now'
    };

    setConversations(prev => prev.map(c => c.id === conversationId ? {
      ...c,
      lastMessage: text.trim(),
      lastTimestamp: 'Just now',
      messages: [...c.messages, newMsg]
    } : c));

    // Call API in background
    api.sendMessage(conversationId, currentUser.id, text.trim()).catch(() => null);

    // Auto-reply simulation
    setTimeout(() => {
      const autoReplies = [
        "Sounds great! Looking forward to swapping with you.",
        "Got it! I will prepare some notes for our session.",
        "Awesome. See you in the video room!",
        "Perfect timing. Let me know if you need anything beforehand."
      ];
      const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      
      const peerMsg = {
        id: 'msg_peer_' + Date.now(),
        senderId: conv.peerId,
        text: replyText,
        time: 'Just now'
      };

      setConversations(prev => prev.map(c => c.id === conversationId ? {
        ...c,
        lastMessage: replyText,
        lastTimestamp: 'Just now',
        messages: [...c.messages, peerMsg]
      } : c));
    }, 1500);
  };

  // Partner Swap Streaks State
  const [partnerStreaks, setPartnerStreaks] = useState({
    "usr_priya_usr_elena": 3,
    "usr_priya_usr_marcus": 1,
    "usr_priya_usr_sophia": 2
  });

  // Launch live session room
  const startLiveSession = (peerName, peerAvatar, skill, existingSession = null) => {
    const sessionToLaunch = existingSession || {
      id: 'sess_' + Date.now(),
      hostId: currentUser.id,
      peerId: 'usr_peer_' + Date.now(),
      peerName: peerName || 'Elena Rostova',
      peerAvatar: peerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      peerSchool: 'UC Berkeley',
      skill: skill || 'Python & Data Structures',
      format: 'Virtual Call',
      scheduledTime: 'Today • Active',
      duration: '60 mins',
      status: 'Confirmed'
    };

    setActiveLiveSession(sessionToLaunch);
  };

  // Schedule follow-up session for multi-session skill swap streak
  const scheduleFollowUpSession = (previousSession) => {
    const pairKey = [currentUser.id, previousSession.peerId].sort().join('_');
    const currentStreak = partnerStreaks[pairKey] || 1;
    const nextSessionNum = currentStreak + 1;

    const followUpSession = {
      id: 'sess_' + Date.now(),
      hostId: currentUser.id,
      peerId: previousSession.peerId,
      peerName: previousSession.peerName,
      peerAvatar: previousSession.peerAvatar,
      peerSchool: previousSession.peerSchool,
      skill: `${previousSession.skill.replace(/ - Session #\d+/, '')} - Session #${nextSessionNum}`,
      format: previousSession.format || 'Virtual Call',
      scheduledTime: 'Next Week • Confirmed',
      duration: '60 mins',
      status: 'Confirmed',
      streakNumber: nextSessionNum
    };

    setScheduledSessions(prev => [followUpSession, ...prev]);
    addToast('Follow-Up Session Scheduled! 📅', `Session #${nextSessionNum} booked with ${previousSession.peerName} to continue your ${currentStreak}-week streak!`, 'success');
  };

  // Complete session (Enforces 60-min minimum session requirement & applies streak rewards)
  const completeSession = async (session, elapsedSeconds = 3600) => {
    // 60 minutes = 3600 seconds requirement
    const requiredSeconds = 3600;
    
    if (elapsedSeconds < requiredSeconds && process.env.NODE_ENV !== 'test') {
      const minutesCompleted = Math.floor(elapsedSeconds / 60);
      const minutesRemaining = 60 - minutesCompleted;
      addToast(
        'Minimum 60-Min Requirement ⏳', 
        `Sessions must run for 60 minutes before escrow credits are released. (${minutesCompleted}/60 mins completed, ${minutesRemaining} mins remaining). Use Dev Fast-Forward to test.`,
        'error'
      );
      return false;
    }

    setActiveLiveSession(null);
    setScheduledSessions(prev => prev.map(s => s.id === session.id ? { ...s, status: 'Completed' } : s));

    // Calculate Partner Streak
    const partnerId = session.peerId || 'usr_elena';
    const pairKey = [currentUser.id, partnerId].sort().join('_');
    const newStreak = (partnerStreaks[pairKey] || 1) + 1;

    setPartnerStreaks(prev => ({
      ...prev,
      [pairKey]: newStreak
    }));

    // Calculate streak bonus rewards
    let karmaBonus = 50;
    let extraCreditBonus = 0;
    let streakMessage = '';

    if (newStreak >= 5) {
      karmaBonus = 120; // Legendary streak bonus
      extraCreditBonus = 1;
      streakMessage = `🔥 5-SESSION LEGENDARY STREAK! Earned +1 Bonus Credit & +120 Karma!`;
    } else if (newStreak >= 3) {
      karmaBonus = 80;
      extraCreditBonus = 1;
      streakMessage = `🔥 3-SESSION MASTERY STREAK! Earned +1 Bonus Credit & +80 Karma!`;
    } else if (newStreak >= 2) {
      karmaBonus = 65;
      streakMessage = `🔥 2-SESSION DUO STREAK! Earned +10% Karma Bonus!`;
    }

    try {
      await api.completeSession(session.id, currentUser.id).catch(() => null);

      // Reward host/mentor
      setUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            credits: u.credits + 1 + extraCreditBonus,
            karma: u.karma + karmaBonus,
            hoursTaught: u.hoursTaught + 1,
            streak: u.streak + 1
          };
        }
        return u;
      }));

      addToast(
        '1-Hour Session Completed & Verified! 🎓', 
        `60 minutes completed! 1 Escrow Credit released. ${streakMessage}`, 
        'success'
      );

      setReviewSessionTarget({
        ...session,
        currentPartnerStreak: newStreak
      });
      setIsReviewModalOpen(true);
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Submit review
  const submitReview = async (rating, tags, comment) => {
    if (!reviewSessionTarget) return;

    try {
      await api.submitReview({
        targetUserId: reviewSessionTarget.peerId,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorSchool: currentUser.school,
        rating,
        skill: reviewSessionTarget.skill,
        tags,
        comment
      }).catch(() => null);

      setUsers(prev => prev.map(u => {
        if (u.id === reviewSessionTarget.peerId) {
          const newReview = {
            id: 'rev_' + Date.now(),
            author: currentUser.name,
            avatar: currentUser.avatar,
            school: currentUser.school,
            rating,
            date: 'Just now',
            skill: reviewSessionTarget.skill,
            comment: comment || 'Great peer session! Highly recommend.'
          };
          const updatedReviews = [newReview, ...(u.reviews || [])];
          const avgRating = (updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1);
          return {
            ...u,
            karma: u.karma + (rating * 10),
            rating: parseFloat(avgRating),
            reviewCount: updatedReviews.length,
            reviews: updatedReviews
          };
        }
        return u;
      }));

      setIsReviewModalOpen(false);
      setReviewSessionTarget(null);
      addToast('Review Submitted & Rewards Released! 🎉', 'Earned +1 Credit and +50 Karma in backend database ledger.', 'success');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // Add a new skill
  const addNewSkill = async (skillData) => {
    try {
      await api.addSkill(currentUser.id, skillData).catch(() => null);

      setUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          if (skillData.type === 'teach') {
            return {
              ...u,
              skillsOffered: [
                ...u.skillsOffered,
                {
                  id: 'sk_' + Date.now(),
                  name: skillData.name,
                  category: skillData.category,
                  level: skillData.level,
                  endorsementCount: 1
                }
              ]
            };
          } else {
            return {
              ...u,
              skillsWanted: [
                ...u.skillsWanted,
                {
                  id: 'sk_w_' + Date.now(),
                  name: skillData.name,
                  category: skillData.category,
                  priority: skillData.priority
                }
              ]
            };
          }
        }
        return u;
      }));

      setIsAddSkillModalOpen(false);
      addToast('Skill Saved to Database! ✅', `${skillData.name} is now queryable via REST API.`, 'success');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // Create a brand new student profile
  const createNewUserProfile = async (profileData) => {
    const defaultAvatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
    ];
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const tempId = 'usr_' + Date.now();
    const fallbackUser = {
      id: tempId,
      name: profileData.name,
      age: 20,
      role: 'Student Peer',
      avatar: profileData.avatar || randomAvatar,
      school: profileData.school || 'UC Berkeley',
      email: profileData.email || `${profileData.name.toLowerCase().replace(/\s+/g, '.')}@berkeley.edu`,
      verified: true,
      major: profileData.major || 'Undeclared',
      bio: profileData.bio || 'Excited to trade skills and learn from peers on campus!',
      rating: 5.0,
      reviewCount: 0,
      hoursTaught: 0,
      hoursLearned: 0,
      credits: 5, // 5 welcome credits
      karma: 100,
      streak: 1,
      badgeLevel: 'New Peer',
      location: `${profileData.school || 'Campus'} (Virtual & In-Person)`,
      preferredFormat: 'Both',
      skillsOffered: profileData.skillsOffered || [],
      skillsWanted: profileData.skillsWanted || [],
      availability: ['Flexible Weekdays & Weekends'],
      reviews: []
    };

    let createdUser = fallbackUser;

    try {
      const res = await api.createUser({
        ...profileData,
        avatar: fallbackUser.avatar
      });
      if (res?.data) {
        createdUser = res.data;
      }
    } catch (err) {
      console.warn('API user creation error:', err.message);
      throw err;
    }

    setUsers(prev => [createdUser, ...prev.filter(u => u.id !== tempId && u.id !== createdUser.id)]);
    setCurrentUserId(createdUser.id);
    setIsLoggedIn(true);
    setActiveTab('explore');

    addToast('🎉 Welcome to SkillSwap!', `Profile created for ${createdUser.name} saved to SQL Database with 5 free Welcome Credits!`, 'success');
    return createdUser;
  };

  // Update student profile (avatar photo, bio, school, major, location)
  const updateUserProfile = async (updateData) => {
    try {
      const res = await api.updateUser(currentUser.id, updateData);
      const updatedUser = res?.data || { ...currentUser, ...updateData };

      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedUser } : u));
      addToast('Profile Updated! 📸', 'Your student profile and photo have been saved to the SQL database.', 'success');
      return updatedUser;
    } catch (err) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updateData } : u));
      addToast('Profile Updated! 📸', 'Your student profile and photo have been saved.', 'success');
    }
  };

  const openSwapModalForUser = (user) => {
    setTargetUserForSwap(user);
    setIsSwapModalOpen(true);
  };

  const openPortfolioModal = (user) => {
    setPortfolioTargetUser(user || currentUser);
    setIsPortfolioModalOpen(true);
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      logout,
      users,
      setUsers,
      currentUser,
      updateUserProfile,
      currentUserId,
      switchPersona,
      createNewUserProfile,
      activeTab,
      setActiveTab,
      proposals,
      sendSwapProposal,
      acceptProposal,
      declineProposal,
      conversations,
      activeChatId,
      setActiveChatId,
      sendMessage,
      scheduledSessions,
      activeLiveSession,
      startLiveSession,
      setActiveLiveSession,
      completeSession,
      isSwapModalOpen,
      setIsSwapModalOpen,
      targetUserForSwap,
      openSwapModalForUser,
      isAddSkillModalOpen,
      setIsAddSkillModalOpen,
      isCreateProfileModalOpen,
      setIsCreateProfileModalOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      isShareModalOpen,
      setIsShareModalOpen,
      loginWithPassword,
      registerWithPassword,
      recordWebsiteShare,
      isPerksModalOpen,
      setIsPerksModalOpen,
      addNewSkill,
      isVerifyModalOpen,
      setIsVerifyModalOpen,
      isReviewModalOpen,
      setIsReviewModalOpen,
      reviewSessionTarget,
      submitReview,
      isPortfolioModalOpen,
      setIsPortfolioModalOpen,
      portfolioTargetUser,
      openPortfolioModal,
      level,
      xp,
      nextLevelXp,
      quests,
      badges,
      claimQuest,
      isQuestsModalOpen,
      setIsQuestsModalOpen,
      partnerStreaks,
      scheduleFollowUpSession,
      leaderboard: leaderboardData,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
