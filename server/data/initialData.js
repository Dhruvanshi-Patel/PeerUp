// Initial database seed for PeerUp backend
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
          author: "kk",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          school: "UC Berkeley",
          rating: 5,
          date: "3 days ago",
          skill: "Python & Data Structures",
          comment: "Priya is an incredible mentor! She helped me debug dynamic programming problems in 45 minutes."
        }
      ]
    },
    {
      id: "usr_1786965735374",
      name: "kk",
      age: 21,
      role: "Peer Learner & Developer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      school: "UC Berkeley",
      email: "kk@univ.edu",
      password: "password123",
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
