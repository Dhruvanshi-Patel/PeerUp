// Comprehensive Database State for PeerUp
export const INITIAL_PERSONAS = [
  {
    id: "usr_priya",
    name: "Priya Sharma",
    age: 20,
    role: "The Python Specialist",
    characterClass: "MAGE",
    spriteColor: "#8B53FF",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    school: "UC Berkeley",
    email: "priya.sharma@berkeley.edu",
    verified: true,
    major: "Computer Science (Junior)",
    bio: "Passionate about full-stack web dev, Python backend, and algorithms. Prepping for study abroad in Madrid next spring — eager to practice conversational Spanish!",
    rating: 5.0,
    reviewCount: 3,
    hoursTaught: 32,
    hoursLearned: 18,
    credits: 8,
    karma: 990,
    streak: 6,
    badgeLevel: "Master Mentor",
    location: "Berkeley, CA (Virtual & On-Campus)",
    preferredFormat: "Both",
    skillsOffered: [
      { id: "sk_py", name: "Python & Data Structures", category: "Coding & Tech", level: "Advanced", endorsementCount: 19 },
      { id: "sk_react", name: "React & Modern Web", category: "Coding & Tech", level: "Advanced", endorsementCount: 15 },
      { id: "sk_algo", name: "LeetCode & Technical Interview Prep", category: "Coding & Tech", level: "Intermediate", endorsementCount: 11 }
    ],
    skillsWanted: [
      { id: "sk_es", name: "Conversational Spanish", category: "Languages", priority: "High" },
      { id: "sk_speech", name: "Public Speaking", category: "Writing & Test Prep", priority: "Medium" }
    ],
    availability: ["Tue & Thu 16:00", "Sat 11:00"],
    reviews: [
      {
        id: "rev_1",
        author: "kk",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        school: "UC Berkeley",
        rating: 5,
        date: "3 days ago",
        skill: "Python & Data Structures",
        comment: "Priya helped me conquer Dynamic Programming algorithms in 45 mins! +50 XP!"
      }
    ]
  },
  {
    id: "usr_1786965735374",
    name: "kk",
    age: 21,
    role: "Peer Learner & Developer",
    characterClass: "SCHOLAR",
    spriteColor: "#839958",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    school: "UC Berkeley",
    email: "kk@univ.edu",
    verified: true,
    major: "Computer Science",
    bio: "Passionate about peer learning and trading tech & science skills on campus!",
    rating: 5.0,
    reviewCount: 1,
    hoursTaught: 5,
    hoursLearned: 2,
    credits: 5,
    karma: 200,
    streak: 2,
    badgeLevel: "Verified Contributor",
    location: "UC Berkeley Campus",
    preferredFormat: "Both",
    skillsOffered: [
      { id: "sk_kk_1", name: "Computer Science & Full-Stack Web", category: "Coding & Tech", level: "Advanced", endorsementCount: 2 }
    ],
    skillsWanted: [
      { id: "sk_kk_w1", name: "Spanish Conversation & Public Speaking", category: "Languages", priority: "High" }
    ],
    availability: ["Weekdays 16:00"],
    reviews: []
  }
];

export const CATEGORIES = [
  { id: "all", name: "ALL SKILLS", icon: "Sparkles", count: 48 },
  { id: "Coding & Tech", name: "CODING & TECH", icon: "Code", count: 18 },
  { id: "Academic & STEM", name: "ACADEMIC & STEM", icon: "GraduationCap", count: 14 },
  { id: "Languages", name: "LANGUAGES", icon: "Languages", count: 12 },
  { id: "Creative & Arts", name: "CREATIVE & ARTS", icon: "Palette", count: 9 },
  { id: "Writing & Test Prep", name: "WRITING & PREP", icon: "BookOpen", count: 8 },
  { id: "Sports & Fitness", name: "SPORTS & DRILLS", icon: "Dumbbell", count: 6 }
];

export const CAMPUSES = [
  "All Campuses",
  "UC Berkeley",
  "Stanford University",
  "MIT",
  "Harvard University",
  "Columbia University",
  "New York University (NYU)",
  "Carnegie Mellon University (CMU)",
  "UCLA",
  "UC San Diego (UCSD)",
  "UT Austin",
  "Georgia Tech",
  "University of Michigan",
  "University of Washington",
  "University of Toronto",
  "University of Waterloo",
  "Oxford University",
  "Cambridge University",
  "Imperial College London",
  "ETH Zurich",
  "National University of Singapore (NUS)",
  "IIT Bombay / Delhi",
  "Oakland Tech / Dual",
  "Other Campus / Global"
];

export const INITIAL_PROPOSALS = [
  {
    id: "prop_101",
    senderId: "usr_elena",
    senderName: "Elena Rostova",
    senderAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Elena&backgroundColor=d1d4f9",
    senderSchool: "UT Austin",
    receiverId: "usr_priya",
    type: "Direct Swap",
    offeredSkill: "Spanish Conversation Labs",
    requestedSkill: "Python & Data Structures",
    format: "Virtual Call",
    proposedSlot: "Thursday 16:00 EST",
    status: "Pending",
    message: "Hola Priya! Let's trade 45 mins of Spanish dialogue for Python scraper tips!",
    timestamp: "2h ago"
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: "conv_elena",
    peerId: "usr_elena",
    peerName: "Elena Rostova",
    peerAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Elena&backgroundColor=d1d4f9",
    peerSchool: "UT Austin",
    skillContext: "Spanish ⇄ Python Swap",
    lastMessage: "Hola Priya! Looking forward to our co-op swap raid!",
    lastTimestamp: "2h ago",
    unread: true,
    messages: [
      {
        id: "m1",
        senderId: "usr_elena",
        text: "¡Hola Priya! I saw you are heading to Madrid next semester. Super exciting!",
        time: "13:45"
      },
      {
        id: "m2",
        senderId: "usr_elena",
        text: "Sent a co-op proposal for Thursday 16:00. Let's do 45 mins Spanish & 45 mins Python?",
        time: "13:47"
      }
    ]
  }
];

export const INITIAL_SCHEDULED_SESSIONS = [
  {
    id: "sess_upcoming_1",
    peerId: "usr_marcus",
    peerName: "Marcus Vance",
    peerAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Marcus&backgroundColor=b6e3f4",
    peerSchool: "MIT",
    skill: "React & Modern Web Co-Op",
    format: "Virtual Call",
    scheduledTime: "Saturday 11:00 AM EST",
    duration: "60 mins",
    type: "Credit Raid (+1 Coin on clear)",
    roomCode: "swap-982",
    status: "Confirmed",
    locationDetail: "Arcade Room #982"
  }
];

export const LEADERBOARD = [
  { rank: 1, name: "Alex Chen", school: "Stanford", karma: 1420, hours: 54, badge: "👑 GRANDMASTER", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Alex&backgroundColor=c0aede" },
  { rank: 2, name: "Elena Rostova", school: "UT Austin", karma: 1180, hours: 42, badge: "🌟 MASTER SAGE", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Elena&backgroundColor=d1d4f9" },
  { rank: 3, name: "Priya Sharma", school: "UC Berkeley", karma: 940, hours: 32, badge: "⚡ MASTER MAGE", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Priya&backgroundColor=b6e3f4" },
  { rank: 4, name: "Marcus Vance", school: "MIT", karma: 820, hours: 30, badge: "🎯 ENGINEER", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Marcus&backgroundColor=b6e3f4" },
  { rank: 5, name: "Jordan Miller", school: "Oakland Tech", karma: 560, hours: 16, badge: "🚀 STRIKER", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Jordan&backgroundColor=ffd5dc" }
];

export const INITIAL_QUESTS = [
  {
    id: "q_swap",
    title: "⚡ PEER SPARK: PROPOSE 1 SWAP",
    desc: "Send a swap proposal to any student mentor.",
    progress: 1,
    target: 1,
    completed: true,
    claimed: false,
    rewardXp: 100,
    rewardCredits: 1,
    icon: "Zap"
  },
  {
    id: "q_notes",
    title: "📖 STUDY GUILD: TRADE NOTES",
    desc: "Unlock or publish 1 verified exam study guide.",
    progress: 0,
    target: 1,
    completed: false,
    claimed: false,
    rewardXp: 75,
    rewardKarma: 25,
    icon: "BookOpen"
  },
  {
    id: "q_session",
    title: "🎯 60-MIN CO-OP RAID",
    desc: "Complete a live peer video session and release credit.",
    progress: 1,
    target: 1,
    completed: true,
    claimed: false,
    rewardXp: 150,
    rewardKarma: 50,
    icon: "Video"
  }
];

export const INITIAL_BADGES = [
  {
    id: "b_spark",
    name: "FIRST SPARK",
    rarity: "COMMON",
    tierColor: "#2CE885",
    icon: "Zap",
    desc: "Cleared your 1st peer swap session.",
    unlocked: true
  },
  {
    id: "b_algo",
    name: "ALGORITHM SAGE",
    rarity: "RARE",
    tierColor: "#8B53FF",
    icon: "Code",
    desc: "Taught 10+ hours of Python & Algorithms.",
    unlocked: true
  },
  {
    id: "b_polyglot",
    name: "POLYGLOT II",
    rarity: "EPIC",
    tierColor: "#FF5DA2",
    icon: "Languages",
    desc: "Conducted 5+ language conversation labs.",
    unlocked: true
  },
  {
    id: "b_foodie",
    name: "CAMPUS FOODIE",
    rarity: "RARE",
    tierColor: "#FFE600",
    icon: "Utensils",
    desc: "Redeemed your 1st campus food perk voucher.",
    unlocked: false
  },
  {
    id: "b_grandmaster",
    name: "GRANDMASTER",
    rarity: "LEGENDARY",
    tierColor: "#FFE600",
    icon: "Crown",
    desc: "Surpassed 1,000 Karma with 4.9+ rating.",
    unlocked: false
  }
];
