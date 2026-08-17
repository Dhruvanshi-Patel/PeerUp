import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeftRight, Dice6, Search, Users, Clock, Leaf, Coins,
  ArrowRight, ChevronRight, Sparkles
} from 'lucide-react';

const INTENT_OPTIONS = [
  {
    id: 'surprise',
    emoji: '🎲',
    label: 'Surprise me',
    sub: 'Random skill discovery',
    color: '#D3968C',
    bg: 'rgba(211,150,140,0.10)',
    border: 'rgba(211,150,140,0.25)',
    tab: 'explore'
  },
  {
    id: 'find_skill',
    emoji: '🔍',
    label: 'Find a skill',
    sub: 'Browse peer mentors',
    color: '#105666',
    bg: 'rgba(16,86,102,0.09)',
    border: 'rgba(16,86,102,0.22)',
    tab: 'explore'
  },
  {
    id: 'find_someone',
    emoji: '👥',
    label: 'Find someone',
    sub: 'Search by name or campus',
    color: '#839958',
    bg: 'rgba(131,153,88,0.10)',
    border: 'rgba(131,153,88,0.25)',
    tab: 'explore'
  },
  {
    id: 'learn_60',
    emoji: '⚡',
    label: 'Learn in 60 min',
    sub: 'Start a live session now',
    color: '#0A3323',
    bg: 'rgba(10,51,35,0.07)',
    border: 'rgba(10,51,35,0.18)',
    tab: 'sessions'
  }
];

export default function WelcomeScreen() {
  const { currentUser, setActiveTab } = useApp();
  const [selected, setSelected] = useState(null);

  const handleSelect = (opt) => {
    setSelected(opt.id);
    setTimeout(() => setActiveTab(opt.tab), 350);
  };

  const credits = currentUser?.credits ?? 0;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Greeting */}
      <div className="text-center space-y-2 mb-10">
        <div className="inline-flex items-center gap-2 bg-white border border-[#839958]/25 rounded-full px-4 py-1.5 text-xs font-semibold text-[#839958] shadow-sm mb-2">
          <Leaf className="w-3.5 h-3.5" />
          Welcome back, {currentUser?.name?.split(' ')[0]}!
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0A3323] tracking-tight leading-tight">
          What do you want to<br />
          <span className="text-[#105666]">learn today?</span>
        </h1>
        <p className="text-[#839958] text-sm mt-1">
          Teach → Earn → Learn → Level Up → Teach something new
        </p>
      </div>

      {/* Credit balance card */}
      <div className="w-full max-w-xs mb-8">
        <div className="bg-[#0A3323] text-[#F7F4D5] rounded-3xl p-6 shadow-xl text-center space-y-1 border border-[#0A3323]">
          <div className="text-[11px] uppercase tracking-widest text-[#839958] font-semibold mb-1">Your Credit Balance</div>
          <div className="text-5xl font-black">{credits}</div>
          <div className="text-[11px] text-[#F7F4D5]/50 space-y-0.5 pt-2 border-t border-white/10">
            <div>Earn by teaching · Spend by learning</div>
            <div className="text-[#D3968C]">1 Hour = 1 Credit</div>
          </div>
        </div>
      </div>

      {/* 2×2 intent grid */}
      <div className="w-full max-w-sm grid grid-cols-2 gap-3 mb-8">
        {INTENT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt)}
            className={`rounded-2xl p-5 text-left transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm ${
              selected === opt.id ? 'scale-95 opacity-60' : ''
            }`}
            style={{ background: opt.bg, border: `1.5px solid ${opt.border}` }}
          >
            <div className="text-3xl mb-2.5">{opt.emoji}</div>
            <div className="text-sm font-bold text-[#0A3323]">{opt.label}</div>
            <div className="text-[11px] text-[#839958] mt-0.5">{opt.sub}</div>
          </button>
        ))}
      </div>

      {/* Quick actions row */}
      <div className="w-full max-w-sm flex gap-2">
        <button
          onClick={() => setActiveTab('notes')}
          className="flex-1 bg-white border border-[#839958]/25 rounded-2xl py-3 px-4 text-left hover:bg-[#FAF8ED] transition-colors shadow-sm"
        >
          <div className="text-lg mb-1">📚</div>
          <div className="text-xs font-bold text-[#0A3323]">Browse Notes</div>
          <div className="text-[10px] text-[#839958]">PYQs & resources</div>
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className="flex-1 bg-white border border-[#839958]/25 rounded-2xl py-3 px-4 text-left hover:bg-[#FAF8ED] transition-colors shadow-sm"
        >
          <div className="text-lg mb-1">🏆</div>
          <div className="text-xs font-bold text-[#0A3323]">Leaderboard</div>
          <div className="text-[10px] text-[#839958]">Top earners</div>
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className="flex-1 bg-white border border-[#839958]/25 rounded-2xl py-3 px-4 text-left hover:bg-[#FAF8ED] transition-colors shadow-sm"
        >
          <div className="text-lg mb-1">🎓</div>
          <div className="text-xs font-bold text-[#0A3323]">My Profile</div>
          <div className="text-[10px] text-[#839958]">Portfolio & credits</div>
        </button>
      </div>

      <p className="mt-8 text-[11px] text-[#839958]/60 flex items-center gap-1.5">
        <Leaf className="w-3.5 h-3.5" />
        Zero tuition · Verified campus network · Season 1
      </p>
    </div>
  );
}
