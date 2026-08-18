import React, { useState } from 'react';
import {
  ArrowLeftRight, BookOpen, Video, Star, ShieldCheck,
  Coins, Flame, Trophy, Users, Clock, FileText, Linkedin,
  Github, ArrowRight, Lock, Sparkles, Leaf, ChevronRight,
  GraduationCap, Zap, Check, Award
} from 'lucide-react';

/* ── blurred "ghost" peer card to tease the explore view ── */
function GhostPeerCard({ name, school, skill, rating, avatar, onCTA }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-white border border-[#839958]/20 shadow-sm">
      {/* Lock overlay */}
      <div
        className="absolute inset-0 z-10 backdrop-blur-[3px] bg-white/40 flex flex-col items-center justify-center gap-2 cursor-pointer group"
        onClick={onCTA}
      >
        <div className="w-10 h-10 rounded-full bg-[#0A3323] flex items-center justify-center group-hover:bg-[#105666] transition-colors shadow-lg">
          <Lock className="w-4.5 h-4.5 text-[#F7F4D5]" />
        </div>
        <span className="text-[11px] font-bold text-[#0A3323] bg-white/90 px-3 py-1 rounded-full shadow-sm">
          Sign in to connect
        </span>
      </div>

      {/* Card content (blurred underneath) */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <img src={avatar} alt={name} className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <div className="text-sm font-bold text-[#0A3323]">{name}</div>
            <div className="text-[10px] text-[#839958]">{school}</div>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs font-bold text-[#0A3323]">
            <Star className="w-3 h-3 text-[#D3968C] fill-[#D3968C]" />
            {rating}
          </div>
        </div>
        <div className="text-xs text-[#0A3323]/80 bg-[#FAF8ED] rounded-xl px-3 py-2">
          Offers: <span className="font-semibold">{skill}</span>
        </div>
        <div className="w-full bg-[#0A3323] text-[#F7F4D5] rounded-xl py-2 text-xs font-bold text-center">
          Request Swap
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    emoji: '🔄',
    title: '1-for-1 Skill Swaps',
    desc: 'Trade what you know for what you want to learn. Propose a swap with any verified campus peer in seconds.',
    color: '#105666',
    bg: 'rgba(16,86,102,0.08)',
  },
  {
    emoji: '⏱️',
    title: '1 Hour = 1 Credit',
    desc: 'Every hour you teach earns one simple credit. Spend credits to learn from others — no money ever changes hands.',
    color: '#0A3323',
    bg: 'rgba(10,51,35,0.07)',
  },
  {
    emoji: '📚',
    title: 'Notes & PYQ Bank',
    desc: 'Upload past exam papers, cheatsheets, and study notes. Get credits when peers unlock and learn from your material.',
    color: '#839958',
    bg: 'rgba(131,153,88,0.10)',
  },
  {
    emoji: '🎥',
    title: 'Live 60-Min Sessions',
    desc: 'Video-powered live tutoring rooms with a built-in timer. Credits release only after a full hour — fair for everyone.',
    color: '#D3968C',
    bg: 'rgba(211,150,140,0.10)',
  },
  {
    emoji: '🔥',
    title: 'Streak & Badges',
    desc: 'Multi-session streaks with the same partner unlock bonus karma and "Mastery Duo" badges that show on your profile.',
    color: '#105666',
    bg: 'rgba(16,86,102,0.08)',
  },
  {
    emoji: '🏆',
    title: 'Campus Leaderboard',
    desc: 'Climb the ranks by teaching more and earning top reviews. The best mentors gain verified "Senior Tutor" status.',
    color: '#0A3323',
    bg: 'rgba(10,51,35,0.07)',
  },
];

const STEPS = [
  { n: '01', title: 'Sign up & list a skill', desc: 'Create your free profile and add one skill you can teach — anything from Python to Piano.' },
  { n: '02', title: 'Match with a peer', desc: 'Browse campus peers, filter by skill or format, and send a swap proposal or use a credit.' },
  { n: '03', title: 'Teach, earn, repeat', desc: 'Complete a 60-min session, get your credit released, and unlock the skills you want next.' },
];

const GHOST_PEERS = [
  { name: 'Priya S.', school: 'UC Berkeley', skill: 'Python & Data Structures', rating: '4.9', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { name: 'Alex C.', school: 'Stanford', skill: 'Machine Learning', rating: '5.0', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { name: 'Marcus V.', school: 'MIT', skill: 'Linear Algebra', rating: '4.8', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
];

export default function PublicHomePage({ onGetStarted }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <div className="min-h-screen bg-[#F7F4D5] text-[#0A3323]"
      style={{ backgroundImage: 'radial-gradient(#839958 0.4px, transparent 0.4px)', backgroundSize: '28px 28px' }}>

      {/* ── TOP NAV ── */}
      <header className="sticky top-0 z-40 bg-[#FAF8ED]/95 backdrop-blur-md border-b border-[#839958]/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0A3323] flex items-center justify-center">
              <ArrowLeftRight className="w-4.5 h-4.5 text-[#F7F4D5]" />
            </div>
            <div>
              <div className="font-black text-base text-[#0A3323] leading-none">PeerUp</div>
              <div className="text-[10px] text-[#839958] font-medium">Campus Peer Network</div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#0A3323]/70">
            <a href="#features" className="hover:text-[#0A3323] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#0A3323] transition-colors">How It Works</a>
            <a href="#peers" className="hover:text-[#0A3323] transition-colors">Find Peers</a>
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onGetStarted}
              className="text-xs font-semibold text-[#0A3323]/70 hover:text-[#0A3323] px-3 py-2 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="bg-[#0A3323] text-[#F7F4D5] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#105666] transition-colors shadow-sm flex items-center gap-1.5"
            >
              Get Started Free
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#839958]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#105666]/10 rounded-full blur-3xl pointer-events-none translate-y-1/3" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border border-[#839958]/25 rounded-full px-4 py-1.5 text-xs font-semibold text-[#839958] shadow-sm mb-6">
            <Leaf className="w-3.5 h-3.5" />
            Verified .edu campus network · Zero tuition
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#0A3323] tracking-tight leading-[1.1] mb-6">
            Learn anything from peers.<br />
            <span className="text-[#105666]">Teach. Earn. Repeat.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#0A3323]/70 leading-relaxed max-w-2xl mx-auto mb-10">
            PeerUp is a peer-to-peer skill exchange platform for university students.
            Trade coding, calculus, languages and more — 1 hour taught = 1 credit earned.
            No money. No middlemen. Just students helping students.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-[#0A3323] text-[#F7F4D5] px-8 py-4 rounded-2xl text-sm font-black hover:bg-[#105666] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#D3968C]" />
              Start Swapping — It's Free
            </button>
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-white border border-[#839958]/30 text-[#0A3323] px-8 py-4 rounded-2xl text-sm font-bold hover:bg-[#FAF8ED] transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-[#839958]" />
              Browse Campus Peers
            </button>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { n: '2,400+', l: 'Students' },
              { n: '8', l: 'Campuses' },
              { n: '12K hrs', l: 'Exchanged' },
              { n: '4.8★', l: 'Avg Rating' },
            ].map(({ n, l }) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-black text-[#0A3323]">{n}</div>
                <div className="text-[11px] text-[#839958] font-semibold uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#839958] uppercase tracking-widest mb-3">
            <Zap className="w-3.5 h-3.5" /> Everything you need
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A3323] tracking-tight">
            The full skill exchange stack
          </h2>
          <p className="text-sm text-[#0A3323]/60 mt-3 max-w-xl mx-auto">
            From finding a tutor to sharing notes and booking live sessions — everything in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="bg-white border border-[#839958]/20 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: f.bg, border: `1px solid ${f.color}20` }}>
                {f.emoji}
              </div>
              <h3 className="font-bold text-sm text-[#0A3323] mb-2">{f.title}</h3>
              <p className="text-xs text-[#0A3323]/65 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-[#0A3323] py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#839958 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#839958] uppercase tracking-widest mb-3">
              <Clock className="w-3.5 h-3.5" /> Simple process
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How PeerUp works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-white/8 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-4xl font-black text-[#839958]/40 mb-3">{s.n}</div>
                <h3 className="font-bold text-white text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-white/55 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Credit economy explainer */}
          <div className="bg-white/8 border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">⚡</div>
            <div className="text-white font-black text-xl mb-2">
              Teach → Earn → Learn → Level Up → Teach something new
            </div>
            <p className="text-white/50 text-sm max-w-lg mx-auto">
              The credit economy means every hour of teaching earns you an hour of learning. It's sustainable, fair, and entirely student-powered.
            </p>
          </div>
        </div>
      </section>

      {/* ── LOCKED PEER PREVIEW ── */}
      <section id="peers" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#839958] uppercase tracking-widest mb-3">
            <Users className="w-3.5 h-3.5" /> Live on campus
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A3323] tracking-tight mb-3">
            Peers ready to swap with you
          </h2>
          <p className="text-sm text-[#0A3323]/60">Sign in to see full profiles and send swap requests.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {GHOST_PEERS.map((p) => (
            <GhostPeerCard key={p.name} {...p} onCTA={onGetStarted} />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onGetStarted}
            className="bg-[#0A3323] text-[#F7F4D5] px-8 py-4 rounded-2xl text-sm font-black hover:bg-[#105666] transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
          >
            <Lock className="w-4 h-4 text-[#D3968C]" />
            Sign in to unlock all {2400}+ peers
          </button>
        </div>
      </section>

      {/* ── SOCIAL BADGE TEASER ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white border border-[#839958]/20 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 shadow-sm">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-[#0077B5]" />
              <Github className="w-5 h-5 text-[#0A3323]" />
              <span className="text-xs font-bold text-[#839958] uppercase tracking-wider">Share your progress</span>
            </div>
            <h3 className="text-xl font-black text-[#0A3323]">
              Add your credits & karma to LinkedIn and GitHub
            </h3>
            <p className="text-sm text-[#0A3323]/65 leading-relaxed">
              Generate verified credential badges, export your teaching hours as LinkedIn Experience entries, and create GitHub README badges that show your PeerUp rank — all with one click.
            </p>
          </div>

          {/* mock badge preview */}
          <div className="shrink-0 space-y-3">
            <div className="bg-[#0A3323] text-[#F7F4D5] rounded-2xl px-5 py-3 text-center shadow-lg">
              <div className="text-[10px] text-[#839958] uppercase tracking-wider mb-1">PeerUp Rank</div>
              <div className="text-2xl font-black">🏆 Level 7</div>
              <div className="flex items-center justify-center gap-3 mt-1.5 text-[11px] text-[#F7F4D5]/70">
                <span>14 Credits</span>
                <span>·</span>
                <span>1,820 Karma</span>
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="w-full bg-[#0077B5] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#005885] transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              Share on LinkedIn
            </button>
            <button
              onClick={onGetStarted}
              className="w-full bg-[#0A3323] text-[#F7F4D5] text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#105666] transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              Copy GitHub Badge
            </button>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[#0A3323] py-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Ready to start learning for free?
          </h2>
          <p className="text-white/55 text-sm mb-8 leading-relaxed">
            Join 2,400+ students already trading skills across 8 campuses. It takes less than a minute to sign up.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-[#D3968C] text-[#0A3323] font-black text-sm px-10 py-4 rounded-2xl hover:bg-[#c48378] transition-all shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-white/35">
            <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Free forever</span>
            <span className="flex items-center gap-1"><Check className="w-3 h-3" /> No credit card</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> .edu verified</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#839958]/15 bg-[#FAF8ED] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#0A3323]/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#0A3323] flex items-center justify-center">
              <ArrowLeftRight className="w-3 h-3 text-[#F7F4D5]" />
            </div>
            <span className="font-bold text-[#0A3323]">PeerUp</span>
            <span>· Peer Skill Exchange · Season 1</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#105666]" /> Verified .edu network</span>
            <span>1 Hr = 1 Credit</span>
            <span>Zero tuition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
