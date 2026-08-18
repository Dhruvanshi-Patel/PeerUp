import React, { useState } from 'react';
import {
  ArrowLeftRight, MessageSquare, Calendar, Coins, Flame, Trophy,
  Users, Check, Clock, ShieldCheck, ArrowRight, Lock, Sparkles,
  Linkedin, Github, Twitter, ExternalLink, Send, User, BookOpen,
  Zap, Star, ChevronRight, CheckCircle2, XCircle, Search, Filter,
  TrendingUp, Award, Layers, Globe, Eye
} from 'lucide-react';

/* ── MOCK DATA FOR LIVE SHOWCASE & WALKTHROUGH ── */
const MATCH_PEERS = [
  {
    id: 'm1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    school: 'UC Berkeley',
    major: 'Computer Science',
    matchScore: 98,
    canTeach: 'Python & Data Structures',
    canLearn: 'Organic Chemistry',
    rating: 4.9,
    reviews: 24,
    badge: 'Master Mentor'
  },
  {
    id: 'm2',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    school: 'Stanford',
    major: 'Artificial Intelligence',
    matchScore: 95,
    canTeach: 'Machine Learning & PyTorch',
    canLearn: 'Calculus III',
    rating: 5.0,
    reviews: 38,
    badge: 'Verified Specialist'
  },
  {
    id: 'm3',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    school: 'MIT',
    major: 'Applied Mathematics',
    matchScore: 92,
    canTeach: 'Linear Algebra & Proofs',
    canLearn: 'Spanish Conversation',
    rating: 4.8,
    reviews: 19,
    badge: 'Top Contributor'
  },
  {
    id: 'm4',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    school: 'Columbia',
    major: 'Neuroscience & Biology',
    matchScore: 89,
    canTeach: 'Biochemistry & Genetics',
    canLearn: 'Python Basics',
    rating: 4.9,
    reviews: 31,
    badge: 'Senior Tutor'
  }
];

const CHAT_CONVERSATIONS = [
  {
    id: 'c1',
    peerName: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skill: 'Python & Data Structures',
    lastMessage: 'Let’s meet tomorrow at 4 PM for the BFS tree review!',
    time: '10:42 AM',
    unread: 1,
    messages: [
      { id: 'm1', sender: 'peer', text: 'Hey! Saw you were looking for help with Graph BFS algorithms.' },
      { id: 'm2', sender: 'me', text: 'Yes! I have my midterm coming up on Friday. Would love a 1-hour walkthrough.' },
      { id: 'm3', sender: 'peer', text: 'Perfect. I submitted a 1-credit session request for tomorrow afternoon.' },
      {
        id: 'm4',
        sender: 'system_request',
        topic: 'Python Graph Algorithms (BFS/DFS)',
        slot: 'Tomorrow at 4:00 PM • 60 Mins',
        credits: 1,
        status: 'pending'
      },
      { id: 'm5', sender: 'peer', text: 'Let me know if that time works for you!' }
    ]
  },
  {
    id: 'c2',
    peerName: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    skill: 'Machine Learning',
    lastMessage: 'The PyTorch tensor cheatsheet is ready for our call.',
    time: 'Yesterday',
    unread: 0,
    messages: [
      { id: 'm10', sender: 'peer', text: 'Hi! Ready to trade Calculus tips for PyTorch basics?' },
      { id: 'm11', sender: 'me', text: 'Absolutely! I have full lecture notes for Multivariate Calc.' },
      { id: 'm12', sender: 'peer', text: 'Awesome, talk to you during our scheduled slot.' }
    ]
  },
  {
    id: 'c3',
    peerName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    skill: 'Biochemistry',
    lastMessage: 'Thanks for unlocking my lecture notes!',
    time: '2 days ago',
    unread: 0,
    messages: [
      { id: 'm20', sender: 'peer', text: 'Thanks for unlocking my Biochemistry exam guide!' },
      { id: 'm21', sender: 'me', text: 'It was super helpful! Earned you +1 credit.' }
    ]
  }
];

export default function PublicHomePage({ onGetStarted }) {
  /* ── INTERACTIVE LIVE SHOWCASE STATE ── */
  const [activeShowcaseTab, setActiveShowcaseTab] = useState('messenger'); // 'matcher' | 'messenger' | 'calendar' | 'economy' | 'gamification'

  // Messenger State
  const [selectedChat, setSelectedChat] = useState(CHAT_CONVERSATIONS[0]);
  const [requestStatus, setRequestStatus] = useState('pending'); // 'pending' | 'accepted' | 'declined'

  // Calendar State
  const [calendarTab, setCalendarTab] = useState('upcoming');
  const [bookingPeer, setBookingPeer] = useState('Priya Sharma');
  const [bookingSkill, setBookingSkill] = useState('Python & Data Structures');
  const [bookingDate, setBookingDate] = useState('2026-08-20');
  const [bookingSlot, setBookingSlot] = useState('16:00');
  const [bookingToast, setBookingToast] = useState('');

  // Toast feedback state for showcase interactions
  const [actionFeedback, setActionFeedback] = useState('');

  const triggerFeedback = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(''), 3000);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingToast(`Session request sent to ${bookingPeer} for ${bookingDate} at ${bookingSlot}!`);
    setTimeout(() => setBookingToast(''), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">

      {/* ── TOP NAV BAR ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">PeerUp</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
              Campus SaaS
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Walkthrough</a>
            <a href="#live-showcase" className="hover:text-slate-900 transition-colors">Live UI Demo</a>
            <a href="#philosophy" className="hover:text-slate-900 transition-colors">Philosophy</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={onGetStarted}
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </header>

      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-slate-900 text-white">
        {/* Soft, ambient looping CSS motion background */}
        <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500 blur-[120px] animate-pulse" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-indigo-500 blur-[120px] animate-pulse delay-1000" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-teal-400 blur-[100px] animate-pulse delay-700" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-emerald-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Peer-to-Peer Campus Skill Exchange Network
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Learn anything from peers.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300">
              Teach what you know best.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            A zero-tuition skill exchange platform for university students. Trade 1-on-1 knowledge using simple credits — no money ever changes hands.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#live-showcase"
              className="w-full sm:w-auto text-slate-300 hover:text-white font-semibold px-6 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 group"
            >
              See how it works
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <div className="pt-10 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-400 border-t border-white/10 max-w-3xl mx-auto">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified .EDU Email Guard</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Hour Taught = 1 Credit Earned</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Tuition & Fees</div>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURE WALKTHROUGH (Alternating Rows with Product UI Chrome) ── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest">End-to-End Walkthrough</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How PeerUp powers student skill exchange
          </h2>
          <p className="text-slate-600 text-sm">
            Explore the 6 core stages of matching, booking, and trading knowledge on campus.
          </p>
        </div>

        {/* Row 1: Profile Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            {/* Realistic Product UI Chrome Card */}
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-1">
              <div className="px-4 py-2.5 bg-slate-800/80 rounded-t-xl flex items-center justify-between border-b border-slate-700/60 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400">peerup.app/profile/setup</span>
                </div>
                <span className="badge font-mono text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">.EDU VERIFIED</span>
              </div>
              <div className="p-6 bg-slate-900 text-white rounded-b-xl space-y-4 text-xs">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" className="w-14 h-14 rounded-xl object-cover ring-2 ring-emerald-500/50" alt="Priya" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">Priya Sharma</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">UC BERKELEY</span>
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">Computer Science Major • Class of 2026</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 space-y-1.5">
                    <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">I Can Teach</div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">Python Data Structures</span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">Algorithms</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 space-y-1.5">
                    <div className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider">I Want to Learn</div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">Organic Chemistry</span>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">UI Design</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Stage 01</span>
            <h3 className="text-2xl font-bold text-slate-900">
              <strong className="font-extrabold">Verified Profile Setup.</strong> Create your academic card in seconds.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Sign up with your official university email (`.edu`). Select the courses and skills you feel confident teaching, alongside the subjects you want to learn this term.
            </p>
          </div>
        </div>

        {/* Row 2: Intelligent Matching (Text Left, Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Stage 02</span>
            <h3 className="text-2xl font-bold text-slate-900">
              <strong className="font-extrabold">Algorithmic Peer Matching.</strong> Find complementary partners instantly.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our matching engine cross-references your offered skills against peer learning requests on your campus, highlighting candidates with high compatibility scores and reciprocal availability.
            </p>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-1">
              <div className="px-4 py-2.5 bg-slate-100/90 rounded-t-xl flex items-center justify-between border-b border-slate-200 text-xs text-slate-500">
                <span className="font-mono text-[11px]">peerup.app/match/discover</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">98% MATCH SCORE</span>
              </div>
              <div className="p-5 space-y-3 bg-white">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-12 h-12 rounded-xl object-cover" alt="Alex" />
                    <div>
                      <div className="font-bold text-sm text-slate-900">Alex Chen (Stanford)</div>
                      <div className="text-xs text-slate-500">Teaches: <span className="font-medium text-slate-800">Machine Learning</span></div>
                      <div className="text-xs text-emerald-600 font-medium">Wants your skill: <span className="font-semibold">Python Algorithms</span></div>
                    </div>
                  </div>
                  <button onClick={onGetStarted} className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shrink-0">
                    Propose Swap
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Direct Messaging */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-1">
              <div className="px-4 py-2.5 bg-slate-800 rounded-t-xl flex items-center justify-between border-b border-slate-700 text-xs text-slate-400">
                <span className="font-mono text-[11px]">peerup.app/messages/thread_942</span>
                <span className="text-emerald-400 font-medium">● Online</span>
              </div>
              <div className="p-5 bg-slate-900 space-y-3 text-xs">
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tl-none max-w-sm">
                    Hey! Saw you had high reviews in Python tree traversal. Free tomorrow for a 1-hour session?
                  </div>
                </div>
                {/* Inline Session Request Card */}
                <div className="p-3.5 rounded-xl bg-slate-800/90 border border-emerald-500/40 text-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">📅 Session Request Proposal</span>
                    <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold">1 CREDIT</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <div><strong>Topic:</strong> Graph BFS & Algorithm Breakdown</div>
                    <div><strong>Time:</strong> Tomorrow at 4:00 PM (60 mins)</div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={onGetStarted} className="bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-400 transition-colors">
                      Accept Session
                    </button>
                    <button onClick={onGetStarted} className="bg-slate-700 text-slate-300 font-medium px-3 py-1.5 rounded-lg text-xs hover:bg-slate-600 transition-colors">
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Stage 03</span>
            <h3 className="text-2xl font-bold text-slate-900">
              <strong className="font-extrabold">Direct Peer Messaging.</strong> Chat and propose sessions in context.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Communicate in real time with fellow students. Send structured 1-click session requests right inside chat bubbles so times and credit terms are agreed upon transparently.
            </p>
          </div>
        </div>

        {/* Row 4: Scheduling & Booking (Text Left, Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Stage 04</span>
            <h3 className="text-2xl font-bold text-slate-900">
              <strong className="font-extrabold">Frictionless Scheduling.</strong> Automated calendar & QR check-in.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Confirm tutoring slots with interactive calendar controls. Each confirmed session automatically generates a unique room link and QR check-in code.
            </p>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-1">
              <div className="px-4 py-2.5 bg-slate-100 rounded-t-xl flex items-center justify-between border-b border-slate-200 text-xs text-slate-600">
                <span className="font-mono text-[11px]">peerup.app/calendar/booking</span>
                <span className="font-bold text-slate-800">August 2026</span>
              </div>
              <div className="p-5 bg-white space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="text-[10px] text-emerald-700 font-bold uppercase">Wed, Aug 19</div>
                    <div className="font-extrabold text-slate-900 mt-1">4:00 PM</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">With Priya S.</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl opacity-75">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Thu, Aug 20</div>
                    <div className="font-bold text-slate-800 mt-1">2:30 PM</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">With Alex C.</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl opacity-75">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Fri, Aug 21</div>
                    <div className="font-bold text-slate-800 mt-1">6:00 PM</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">With Marcus V.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: Live 60-Min Session Room */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-1">
              <div className="px-4 py-2.5 bg-slate-800 rounded-t-xl flex items-center justify-between border-b border-slate-700 text-xs text-slate-300">
                <span className="font-mono text-[11px]">peerup.app/room/live-sess-882</span>
                <span className="bg-rose-500/20 text-rose-300 font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" /> LIVE 60:00 TIMER
                </span>
              </div>
              <div className="p-5 bg-slate-900 text-slate-100 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-video bg-slate-800 rounded-xl border border-slate-700 relative overflow-hidden flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Peer" />
                    <span className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-white">Priya (Host)</span>
                  </div>
                  <div className="aspect-video bg-slate-800 rounded-xl border border-slate-700 relative overflow-hidden flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="You" />
                    <span className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-white">You (Learner)</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 font-mono text-[11px] text-emerald-400">
                  // Live Collaborative Scratchpad: def traverse_bfs(graph, root): ...
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Stage 05</span>
            <h3 className="text-2xl font-bold text-slate-900">
              <strong className="font-extrabold">The Live Learning Workspace.</strong> Built-in video & shared code.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Conduct full 60-minute tutoring sessions right inside your browser. Integrated video, collaborative Markdown notes, and live code scratchpads ensure high-quality learning.
            </p>
          </div>
        </div>

        {/* Row 6: Ongoing Growth & Verifiable Credentials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Stage 06</span>
            <h3 className="text-2xl font-bold text-slate-900">
              <strong className="font-extrabold">Verifiable Resume Credentials.</strong> Export your teaching history.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Turn your tutoring hours into tangible career assets. Generate cryptographically signed LinkedIn Experience entries and GitHub README badges that prove your mentoring impact.
            </p>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-1">
              <div className="px-4 py-2.5 bg-slate-100 rounded-t-xl flex items-center justify-between border-b border-slate-200 text-xs text-slate-600">
                <span className="font-mono text-[11px]">peerup.app/portfolio/badge</span>
                <span className="font-bold text-emerald-700">LINKEDIN VERIFIED</span>
              </div>
              <div className="p-6 bg-white space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl">
                  <div>
                    <div className="text-xs font-mono text-emerald-400">CREDENTIAL ID: PEERUP-CERT-2026-L7</div>
                    <div className="font-bold text-base mt-0.5">Senior Peer Mentor & Academic Contributor</div>
                    <div className="text-xs text-slate-400 mt-0.5">14 Hours Taught • 1,820 Karma XP • 5.0 Rating</div>
                  </div>
                  <Linkedin className="w-8 h-8 text-[#0077B5] shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. LIVE UI SHOWCASE SECTION (HEAVY LIFTING FUNCTIONING MOCKUPS) ── */}
      <section id="live-showcase" className="py-24 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <Eye className="w-3.5 h-3.5" />
              Interactive Product Demonstration
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Test drive the real PeerUp UI components
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Click through our functioning mockups below — real HTML/CSS interfaces built directly into this landing page.
            </p>
          </div>

          {/* Action Feedback Banner if user clicks buttons in mockups */}
          {actionFeedback && (
            <div className="max-w-xl mx-auto p-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs text-center shadow-lg animate-bounce">
              ⚡ {actionFeedback}
            </div>
          )}

          {/* Showcase Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
            {[
              { id: 'messenger', label: 'In-Chat Booking', icon: MessageSquare },
              { id: 'matcher', label: 'Peer Match Cards', icon: Users },
              { id: 'calendar', label: 'Scheduling System', icon: Calendar },
              { id: 'economy', label: 'Credit Economy Ledger', icon: Coins },
              { id: 'gamification', label: 'Karma & Badges', icon: Trophy }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveShowcaseTab(id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeShowcaseTab === id
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* TAB 1: MESSENGER MOCKUP WITH INLINE REQUEST CARD */}
          {activeShowcaseTab === 'messenger' && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-w-5xl mx-auto">
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  PeerUp Messenger & Session Request Protocol v2.4
                </div>
                <span>Active Peer Session Request</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[440px]">
                {/* Conversation List Sidebar */}
                <div className="md:col-span-4 border-r border-slate-800 bg-slate-900/60 p-3 space-y-2">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2 py-1">Conversations</div>
                  {CHAT_CONVERSATIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedChat(c);
                        setRequestStatus('pending');
                      }}
                      className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                        selectedChat.id === c.id ? 'bg-slate-800 border border-slate-700 text-white' : 'text-slate-400 hover:bg-slate-900/80'
                      }`}
                    >
                      <img src={c.avatar} className="w-10 h-10 rounded-xl object-cover shrink-0" alt={c.peerName} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                          <span className="truncate">{c.peerName}</span>
                          <span className="text-[10px] text-slate-500 font-normal">{c.time}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{c.lastMessage}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active Chat Thread */}
                <div className="md:col-span-8 p-5 flex flex-col justify-between bg-slate-950">
                  <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={selectedChat.avatar} className="w-10 h-10 rounded-xl object-cover" alt={selectedChat.peerName} />
                      <div>
                        <div className="font-bold text-sm text-white">{selectedChat.peerName}</div>
                        <div className="text-xs text-emerald-400">Trading: {selectedChat.skill}</div>
                      </div>
                    </div>
                    <button onClick={() => triggerFeedback(`Opened profile modal for ${selectedChat.peerName}`)} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      View Profile
                    </button>
                  </div>

                  <div className="py-4 space-y-3 overflow-y-auto max-h-[300px] text-xs">
                    {selectedChat.messages.map((m) => {
                      if (m.sender === 'peer') {
                        return (
                          <div key={m.id} className="flex justify-start">
                            <div className="bg-slate-800 text-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tl-none max-w-md">
                              {m.text}
                            </div>
                          </div>
                        );
                      }
                      if (m.sender === 'me') {
                        return (
                          <div key={m.id} className="flex justify-end">
                            <div className="bg-emerald-600 text-slate-950 font-medium px-3.5 py-2.5 rounded-2xl rounded-tr-none max-w-md">
                              {m.text}
                            </div>
                          </div>
                        );
                      }
                      if (m.sender === 'system_request') {
                        return (
                          <div key={m.id} className="my-2 p-4 rounded-xl bg-slate-900 border border-emerald-500/50 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" /> 1-on-1 Session Proposal Request
                              </span>
                              <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                                {m.credits} SIMPLE CREDIT
                              </span>
                            </div>
                            <div className="text-slate-300 space-y-0.5">
                              <div><strong>Topic:</strong> {m.topic}</div>
                              <div><strong>Proposed Slot:</strong> {m.slot}</div>
                            </div>
                            {requestStatus === 'pending' && (
                              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                                <button
                                  onClick={() => {
                                    setRequestStatus('accepted');
                                    triggerFeedback(`Accepted 1-credit session request from ${selectedChat.peerName}!`);
                                  }}
                                  className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs hover:bg-emerald-400 transition-all flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" /> Accept Request
                                </button>
                                <button
                                  onClick={() => {
                                    setRequestStatus('declined');
                                    triggerFeedback(`Declined request.`);
                                  }}
                                  className="bg-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-lg text-xs hover:bg-slate-700 transition-colors"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                            {requestStatus === 'accepted' && (
                              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Session Confirmed! Scheduled in calendar & QR room generated.
                              </div>
                            )}
                            {requestStatus === 'declined' && (
                              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center gap-2">
                                <XCircle className="w-4 h-4 text-rose-400" /> Session Proposal Declined.
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="Type a message or send a session request..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-400 focus:outline-none"
                    />
                    <button onClick={() => triggerFeedback("Interactive showcase chat message sent!")} className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-xl">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MATCH CARD ROW (HORIZONTAL SCROLLABLE CARDS) */}
          {activeShowcaseTab === 'matcher' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>Horizontal Scrollable Peer Cards</span>
                <span>4 Matches Available</span>
              </div>
              <div className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 snap-x">
                {MATCH_PEERS.map((p) => (
                  <div key={p.id} className="min-w-[320px] max-w-[320px] bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 snap-start shrink-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          {p.matchScore}% MATCH
                        </span>
                        <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          {p.rating} ({p.reviews})
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <img src={p.avatar} className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-800" alt={p.name} />
                        <div>
                          <div className="font-bold text-sm text-white">{p.name}</div>
                          <div className="text-xs text-slate-400">{p.school} • {p.major}</div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">You can learn from {p.name.split(' ')[0]}:</span>
                          <span className="font-bold text-emerald-400 mt-0.5 block">{p.canTeach}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">You can teach {p.name.split(' ')[0]}:</span>
                          <span className="font-bold text-indigo-400 mt-0.5 block">{p.canLearn}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => {
                          setActiveShowcaseTab('messenger');
                          triggerFeedback(`Started conversation thread with ${p.name}!`);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-colors text-center"
                      >
                        Start Chat
                      </button>
                      <button
                        onClick={() => triggerFeedback(`Viewing public verified profile of ${p.name}`)}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs py-2.5 rounded-xl border border-slate-800 transition-colors text-center"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CALENDAR & BOOKING MOCKUP */}
          {activeShowcaseTab === 'calendar' && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Month Grid & Filter Tabs */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex gap-2">
                    {['upcoming', 'requests', 'history'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setCalendarTab(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                          calendarTab === t ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-slate-400">Aug 2026</span>
                </div>

                {calendarTab === 'upcoming' && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-white">Python Graph Algorithms</div>
                        <div className="text-[11px] text-slate-400">With Priya Sharma • Wed, Aug 19 at 4:00 PM</div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">CONFIRMED</span>
                    </div>
                    <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-white">Organic Chemistry Midterm Prep</div>
                        <div className="text-[11px] text-slate-400">With Elena Rostova • Fri, Aug 21 at 2:30 PM</div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">SCHEDULED</span>
                    </div>
                  </div>
                )}

                {calendarTab === 'requests' && (
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                    <div className="font-bold text-emerald-400">1 Pending Request</div>
                    <div>Marcus Vance requested 1-hour Linear Algebra review for Saturday.</div>
                  </div>
                )}

                {calendarTab === 'history' && (
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                    <div className="text-slate-200 font-bold">Previous Completed Sessions (14)</div>
                    <div>• Alex Chen (ML Intro) — 60 mins completed (+1 Credit)</div>
                  </div>
                )}
              </div>

              {/* Right Column: New Session Request Form */}
              <div className="lg:col-span-6 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" /> Schedule New Peer Session
                </h3>
                <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Select Campus Peer</label>
                    <select
                      value={bookingPeer}
                      onChange={(e) => setBookingPeer(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
                    >
                      <option value="Priya Sharma">Priya Sharma (UC Berkeley)</option>
                      <option value="Alex Chen">Alex Chen (Stanford)</option>
                      <option value="Marcus Vance">Marcus Vance (MIT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Target Skill</label>
                    <input
                      type="text"
                      value={bookingSkill}
                      onChange={(e) => setBookingSkill(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1 font-semibold">Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-semibold">Time Slot</label>
                      <input
                        type="time"
                        value={bookingSlot}
                        onChange={(e) => setBookingSlot(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg transition-colors mt-2">
                    Send Booking Request (1 Credit)
                  </button>
                  {bookingToast && (
                    <div className="p-2 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[11px] text-center">
                      {bookingToast}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: ECONOMY WIDGET (RECENT ACTIVITY & CREDIT BALANCE) */}
          {activeShowcaseTab === 'economy' && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-to-r from-slate-900 to-slate-850 rounded-xl border border-slate-800 gap-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Simple Credit Balance</div>
                  <div className="text-4xl font-extrabold text-white mt-1">14 <span className="text-emerald-400 text-2xl">Credits</span></div>
                  <div className="text-xs text-slate-400 mt-1">1 Hour Taught = +1 Credit • 1 Hour Learned = -1 Credit</div>
                </div>
                <button onClick={() => triggerFeedback("Referral link copied! Earn +2 credits when a peer registers using your code.")} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-lg">
                  Share & Earn (+2 Cr on Join)
                </button>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity Feed</div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Taught 60-min Python Session</span>
                      <span className="text-slate-400 block text-[11px]">Partner: Priya Sharma</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-sm">+1.0 CR</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Learned Organic Chemistry</span>
                      <span className="text-slate-400 block text-[11px]">Partner: Elena Rostova</span>
                    </div>
                    <span className="font-mono font-bold text-rose-400 text-sm">-1.0 CR</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Notes Unlock Reward</span>
                      <span className="text-slate-400 block text-[11px]">3 peers unlocked Calculus Cheatsheet</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-sm">+3.0 CR</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GAMIFICATION STRIP (BADGES & STREAKS) */}
          {activeShowcaseTab === 'gamification' && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-extrabold text-xl border border-amber-500/20">
                    🔥 7
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">7-Session Duo Streak</div>
                    <div className="text-xs text-slate-400">With study partner Priya Sharma • +20% Karma Bonus Active</div>
                  </div>
                </div>
                <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
                  MASTERY DUO
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { title: 'Verified Mentor', desc: '10+ Hours Taught', icon: Award, color: 'text-emerald-400' },
                  { title: 'Notes Scholar', desc: '100+ Downloads', icon: BookOpen, color: 'text-indigo-400' },
                  { title: '5-Star Tutor', desc: '4.9+ Rating', icon: Star, color: 'text-amber-400' },
                  { title: 'Campus Legend', desc: 'Top 1% Rank', icon: Trophy, color: 'text-teal-400' }
                ].map(({ title, desc, icon: Icon, color }) => (
                  <div key={title} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <Icon className={`w-6 h-6 mx-auto ${color}`} />
                    <div className="font-bold text-xs text-white">{title}</div>
                    <div className="text-[10px] text-slate-400">{desc}</div>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-slate-400 font-medium">
                Build consistent mentoring habits to unlock verified resume badges and campus rewards.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. PHILOSOPHY / DIFFERENTIATION BLOCK ── */}
      <section id="philosophy" className="py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Core Philosophy</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Zero money changes hands. You earn what you spend.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            By removing financial transactions entirely, PeerUp eliminates commercial incentives and elitist pricing. Every hour of peer tutoring you provide grants you exactly one credit to spend learning any topic from another student on campus. It's transparent, equitable, and completely student-powered.
          </p>
        </div>
      </section>

      {/* ── 5. CLOSING CTA BANNER ── */}
      <section className="py-20 bg-slate-900 text-white border-t border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to start learning for free with campus peers?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Start trading skills with campus peers today. Sign up takes less than 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg"
            >
              Sign Up Free
            </button>
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-3.5 rounded-xl border border-slate-700 transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. FOOTER (COMPLETE 4-COLUMN ARCHITECTURE) ── */}
      <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand & Social */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-extrabold text-base text-slate-900">PeerUp</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              The modern peer-to-peer campus skill exchange network. Trade 1-on-1 tutoring using simple credits.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Product</div>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-slate-900 transition-colors">Features & Walkthrough</a></li>
              <li><a href="#live-showcase" className="hover:text-slate-900 transition-colors">Live UI Showcase</a></li>
              <li><a href="#live-showcase" className="hover:text-slate-900 transition-colors">Peer Matcher Engine</a></li>
              <li><a href="#live-showcase" className="hover:text-slate-900 transition-colors">Notes & PYQ Bank</a></li>
              <li><a href="#live-showcase" className="hover:text-slate-900 transition-colors">Campus Perks & Rewards</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Resources</div>
            <ul className="space-y-2">
              <li><a href="#philosophy" className="hover:text-slate-900 transition-colors">Campus Network</a></li>
              <li><a href="#philosophy" className="hover:text-slate-900 transition-colors">Peer Guidelines</a></li>
              <li><a href="#philosophy" className="hover:text-slate-900 transition-colors">Our Philosophy</a></li>
              <li><a href="#live-showcase" className="hover:text-slate-900 transition-colors">API Documentation</a></li>
              <li><span className="text-emerald-600 font-semibold">● All Systems Operational</span></li>
            </ul>
          </div>

          {/* Column 4: Legal & Security */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Legal & Security</div>
            <ul className="space-y-2">
              <li><a href="#philosophy" className="hover:text-slate-900 transition-colors">Terms of Service</a></li>
              <li><a href="#philosophy" className="hover:text-slate-900 transition-colors">Privacy Policy</a></li>
              <li><a href="#philosophy" className="hover:text-slate-900 transition-colors">.EDU Email Guard</a></li>
              <li><a href="#philosophy" className="hover:text-slate-900 transition-colors">Security Audit</a></li>
              <li><a href="#philosophy" className="hover:text-slate-900 transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>© {new Date().getFullYear()} PeerUp Inc. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified .EDU Campus Learning Network</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
