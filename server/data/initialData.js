// Initial database seed for SkillSwap backend
export const initialData = {
  users: [
    {
      id: "usr_priya",
      name: "Priya Sharma",
      age: 20,
      role: "The Specialist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      school: "UC Berkeley",
      email: "priya.sharma@berkeley.edu",
      password: "password123",
      verified: true,
      major: "Computer Science (Junior)",
      bio: "Passionate about full-stack web dev, Python backend, and algorithms. Prepping for study abroad in Madrid next spring — eager to practice conversational Spanish!",
      rating: 4.9,
      reviewCount: 24,
      hoursTaught: 32,
      hoursLearned: 18,
      credits: 8,
      karma: 940,
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
        { id: "sk_speech", name: "Public Speaking & Pitching", category: "Writing & Test Prep", priority: "Medium" }
      ],
      availability: ["Tue & Thu Afternoons", "Saturday Mornings"],
      reviews: [
        {
          id: "rev_1",
          author: "Alex Chen",
          avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
          school: "Stanford",
          rating: 5,
          date: "3 days ago",
          skill: "Python & Data Structures",
          comment: "Priya is an incredible mentor! She helped me debug dynamic programming problems in 45 minutes that I was stuck on for a week."
        },
        {
          id: "rev_2",
          author: "Elena Rostova",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          school: "UT Austin",
          rating: 5,
          date: "1 week ago",
          skill: "React & Modern Web",
          comment: "Very patient with frontend state management concepts. Super fun session!"
        }
      ]
    },
    {
      id: "usr_jordan",
      name: "Jordan Miller",
      age: 17,
      role: "The Multi-Hyphenate",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      school: "Oakland Tech / UC Berkeley Dual",
      email: "jordan.m@oaklandtech.edu",
      verified: true,
      major: "High School Senior / Pre-Eng",
      bio: "Varsity soccer captain & math nerd. Happy to run footwork/conditioning drills or explain Algebra II & AP Calculus in exchange for college essay feedback.",
      rating: 4.8,
      reviewCount: 14,
      hoursTaught: 16,
      hoursLearned: 12,
      credits: 4,
      karma: 560,
      streak: 4,
      badgeLevel: "Senior Peer",
      location: "Oakland / Berkeley, CA",
      preferredFormat: "Both",
      skillsOffered: [
        { id: "sk_soccer", name: "Soccer Technique & Footwork Drills", category: "Sports & Fitness", level: "Expert", endorsementCount: 12 },
        { id: "sk_alg", name: "Algebra II & Pre-Calculus", category: "Academic & STEM", level: "Advanced", endorsementCount: 9 }
      ],
      skillsWanted: [
        { id: "sk_essay", name: "College App Essay Brainstorming", category: "Writing & Test Prep", priority: "High" },
        { id: "sk_chem", name: "AP Chemistry Problem Sets", category: "Academic & STEM", priority: "Medium" }
      ],
      availability: ["Weekdays 4:30 PM - 7:00 PM", "Sunday Afternoons"],
      reviews: [
        {
          id: "rev_3",
          author: "Sam Rivera",
          avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
          school: "NYU",
          rating: 5,
          date: "5 days ago",
          skill: "Soccer Technique & Footwork Drills",
          comment: "Jordan's drills helped me sharpen my ball control before intramural tryouts. Great energy!"
        }
      ]
    },
    {
      id: "usr_alex",
      name: "Alex Chen",
      age: 22,
      role: "The Mentor",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      school: "Stanford University",
      email: "alex.chen@stanford.edu",
      verified: true,
      major: "Design & Product Systems (Senior)",
      bio: "Senior passionate about mentorship and portfolio design. Building my teaching track record for grad school. Top-rated UI/UX mentor with 40+ completed student sessions.",
      rating: 5.0,
      reviewCount: 38,
      hoursTaught: 54,
      hoursLearned: 10,
      credits: 19,
      karma: 1420,
      streak: 12,
      badgeLevel: "Honorary Fellow",
      location: "Palo Alto, CA (Virtual-friendly)",
      preferredFormat: "Virtual",
      skillsOffered: [
        { id: "sk_figma", name: "Figma UI/UX & Design Systems", category: "Creative & Arts", level: "Expert", endorsementCount: 31 },
        { id: "sk_portfolio", name: "Product Design Portfolio Review", category: "Writing & Test Prep", level: "Expert", endorsementCount: 28 },
        { id: "sk_pm", name: "Intro to Product Management", category: "Coding & Tech", level: "Advanced", endorsementCount: 16 }
      ],
      skillsWanted: [
        { id: "sk_audio", name: "Ableton Live & Audio Mixing", category: "Creative & Arts", priority: "High" },
        { id: "sk_tennis", name: "Tennis Serve Mechanics", category: "Sports & Fitness", priority: "Low" }
      ],
      availability: ["Mon, Wed, Fri Evenings", "Sunday All Day"],
      reviews: [
        {
          id: "rev_4",
          author: "Priya Sharma",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          school: "UC Berkeley",
          rating: 5,
          date: "2 days ago",
          skill: "Figma UI/UX & Design Systems",
          comment: "Alex helped me revamp my developer portfolio into a recruiter-ready showcase. Best swap I've had!"
        }
      ]
    },
    {
      id: "usr_sam",
      name: "Sam Rivera",
      age: 19,
      role: "The Explorer",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
      school: "New York University",
      email: "sam.rivera@nyu.edu",
      verified: true,
      major: "Liberal Studies (Sophomore)",
      bio: "Exploring creative arts & storytelling. Love shooting street photography and editing Reels/TikToks in Premiere. Wanting to pick up acoustic guitar and basics of investing.",
      rating: 4.7,
      reviewCount: 9,
      hoursTaught: 11,
      hoursLearned: 14,
      credits: 3,
      karma: 390,
      streak: 2,
      badgeLevel: "Active Swapper",
      location: "New York, NY",
      preferredFormat: "Both",
      skillsOffered: [
        { id: "sk_photo", name: "Street Photography & Light Composition", category: "Creative & Arts", level: "Advanced", endorsementCount: 8 },
        { id: "sk_video", name: "Premiere Pro & Short-form Video Editing", category: "Creative & Arts", level: "Advanced", endorsementCount: 11 }
      ],
      skillsWanted: [
        { id: "sk_guitar", name: "Acoustic Guitar Basics", category: "Creative & Arts", priority: "High" },
        { id: "sk_finance", name: "Personal Budgeting & Index Funds 101", category: "Academic & STEM", priority: "Medium" }
      ],
      availability: ["Flexible Evenings", "Fridays all day"],
      reviews: []
    },
    {
      id: "usr_elena",
      name: "Elena Rostova",
      age: 20,
      role: "Language Polyglot",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      school: "UT Austin",
      email: "elena.rostova@utexas.edu",
      verified: true,
      major: "Linguistics & Data Science (Junior)",
      bio: "Native Spanish & Russian speaker. Certified DELE Spanish coach with 15+ university conversation labs. Looking for data visualization tips in Tableau/Python.",
      rating: 4.95,
      reviewCount: 31,
      hoursTaught: 42,
      hoursLearned: 19,
      credits: 11,
      karma: 1180,
      streak: 9,
      badgeLevel: "Master Mentor",
      location: "Austin, TX (Virtual-first)",
      preferredFormat: "Virtual",
      skillsOffered: [
        { id: "sk_span_adv", name: "Conversational Spanish (All Levels)", category: "Languages", level: "Native / Expert", endorsementCount: 29 },
        { id: "sk_rus", name: "Russian Pronunciation & Grammar", category: "Languages", level: "Native", endorsementCount: 14 }
      ],
      skillsWanted: [
        { id: "sk_py_dataviz", name: "Data Visualization in Python (Seaborn/Plotly)", category: "Coding & Tech", priority: "High" },
        { id: "sk_sql", name: "SQL Query Optimization", category: "Coding & Tech", priority: "Medium" }
      ],
      availability: ["Mon/Wed 10:00 AM - 1:00 PM CST", "Weekends"],
      reviews: []
    },
    {
      id: "usr_marcus",
      name: "Marcus Vance",
      age: 21,
      role: "STEM Specialist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      school: "MIT",
      email: "mvance@mit.edu",
      verified: true,
      major: "Mechanical Engineering (Junior)",
      bio: "Tutor for Multivariable Calc and Classical Mechanics. Fast at CAD (SolidWorks/Fusion360). Looking to learn Japanese for a robotics internship in Tokyo.",
      rating: 4.88,
      reviewCount: 22,
      hoursTaught: 30,
      hoursLearned: 15,
      credits: 7,
      karma: 820,
      streak: 5,
      badgeLevel: "Senior Peer",
      location: "Cambridge, MA",
      preferredFormat: "Both",
      skillsOffered: [
        { id: "sk_calc3", name: "Multivariable Calculus (Calc III)", category: "Academic & STEM", level: "Expert", endorsementCount: 22 },
        { id: "sk_cad", name: "CAD Modeling (SolidWorks & Fusion 360)", category: "Academic & STEM", level: "Advanced", endorsementCount: 17 }
      ],
      skillsWanted: [
        { id: "sk_jap", name: "Conversational Japanese (JLPT N5-N4)", category: "Languages", priority: "High" },
        { id: "sk_write", name: "Creative Non-Fiction Writing", category: "Writing & Test Prep", priority: "Low" }
      ],
      availability: ["Tue/Thu Nights", "Saturday Afternoon"],
      reviews: []
    }
  ],
  swaps: [
    {
      id: "prop_101",
      senderId: "usr_elena",
      senderName: "Elena Rostova",
      senderAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      senderSchool: "UT Austin",
      receiverId: "usr_priya",
      type: "Direct Swap",
      offeredSkill: "Conversational Spanish (All Levels)",
      requestedSkill: "Python & Data Structures",
      format: "Virtual Call",
      proposedSlot: "Thursday, Aug 20 • 4:00 PM EST",
      status: "Pending",
      message: "Hola Priya! I saw you're studying for your Madrid exchange. I'd love to do 45 mins of Spanish conversation in exchange for help setting up a Python web scraper for my linguistics project!",
      timestamp: "2 hours ago"
    },
    {
      id: "prop_102",
      senderId: "usr_marcus",
      senderName: "Marcus Vance",
      senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      senderSchool: "MIT",
      receiverId: "usr_priya",
      type: "Credit Exchange",
      offeredSkill: "Multivariable Calculus (Calc III)",
      requestedSkill: "React & Modern Web",
      creditAmount: 1,
      format: "Virtual Call",
      proposedSlot: "Saturday, Aug 22 • 11:00 AM EST",
      status: "Accepted",
      message: "Hey Priya, I'm building a robotics telemetry web dashboard and need 1 hr of React consultation. Offering 1 credit!",
      timestamp: "1 day ago"
    }
  ],
  sessions: [
    {
      id: "sess_upcoming_1",
      hostId: "usr_priya",
      peerId: "usr_marcus",
      peerName: "Marcus Vance",
      peerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      peerSchool: "MIT",
      skill: "React & Modern Web Consultation",
      format: "Virtual Call",
      scheduledTime: "Saturday, Aug 22 • 11:00 AM EST",
      duration: "60 mins",
      type: "Credit Exchange (+1 Credit upon completion)",
      roomCode: "swap-marcus-priya-982",
      status: "Confirmed",
      locationDetail: "In-App Video Room #982"
    },
    {
      id: "sess_upcoming_2",
      hostId: "usr_priya",
      peerId: "usr_jordan",
      peerName: "Jordan Miller",
      peerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      peerSchool: "Oakland Tech",
      skill: "Soccer Footwork / Algebra Quick Review",
      format: "On-Campus Meetup",
      scheduledTime: "Sunday, Aug 23 • 3:00 PM PST",
      duration: "45 mins",
      type: "Direct Swap",
      roomCode: "campus-qr-jordan-771",
      status: "Confirmed",
      locationDetail: "UC Berkeley Memorial Glade (QR Check-in)"
    }
  ],
  conversations: [
    {
      id: "conv_elena",
      participants: ["usr_priya", "usr_elena"],
      peerId: "usr_elena",
      peerName: "Elena Rostova",
      peerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      peerSchool: "UT Austin",
      skillContext: "Spanish ⇄ Python Swap",
      lastMessage: "Hola Priya! I'd love to do 45 mins of Spanish conversation in exchange for Python help!",
      lastTimestamp: "2h ago",
      unread: true,
      messages: [
        {
          id: "m1",
          senderId: "usr_elena",
          text: "¡Hola Priya! I saw your profile and noticed you are heading to Madrid. Super exciting!",
          time: "1:45 PM"
        },
        {
          id: "m2",
          senderId: "usr_elena",
          text: "I sent a swap request for Thursday 4 PM. We can do half Spanish conversation and half Python web scraping?",
          time: "1:47 PM"
        }
      ]
    },
    {
      id: "conv_alex",
      participants: ["usr_priya", "usr_alex"],
      peerId: "usr_alex",
      peerName: "Alex Chen",
      peerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      peerSchool: "Stanford",
      skillContext: "Figma UI/UX Workshop",
      lastMessage: "The session was awesome! Left you 5 stars and 50 karma.",
      lastTimestamp: "2d ago",
      unread: false,
      messages: [
        {
          id: "m3",
          senderId: "usr_alex",
          text: "Hey Priya! Great working with you on your design portfolio yesterday.",
          time: "Tuesday 6:30 PM"
        },
        {
          id: "m4",
          senderId: "usr_priya",
          text: "Thanks Alex! The layout tips really cleaned up my project cards.",
          time: "Tuesday 6:35 PM"
        },
        {
          id: "m5",
          senderId: "usr_alex",
          text: "The session was awesome! Left you 5 stars and 50 karma.",
          time: "Tuesday 6:40 PM"
        }
      ]
    }
  ],
  walletLedger: [
    { id: "tx_1", userId: "usr_priya", amount: 1, type: "CREDIT_EARNED", description: "Completed Python session with Alex Chen", timestamp: "2 days ago" },
    { id: "tx_2", userId: "usr_priya", amount: -1, type: "CREDIT_REDEEMED", description: "Booked Spanish session with Elena Rostova", timestamp: "3 days ago" }
  ]
};
