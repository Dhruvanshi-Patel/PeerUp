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
    tab: 'explore'
  },
  {
    id: 'find_skill',
    emoji: '🔍',
    label: 'Find a skill',
    sub: 'Browse peer mentors',
    tab: 'explore'
  },
  {
    id: 'find_someone',
    emoji: '👥',
    label: 'Find someone',
    sub: 'Search by name or campus',
    tab: 'explore'
  },
  {
    id: 'learn_60',
    emoji: '⚡',
    label: 'Learn in 60 min',
    sub: 'Start a live session now',
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
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-10 text-slate-900 font-sans">
      {/* Greeting */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 text-xs font-extrabold text-emerald-700 shadow-xs mb-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Welcome back, {currentUser?.name?.split(' ')[0]}!
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          What do you want to<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">learn today?</span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
          Teach → Earn → Learn → Level Up → Teach something new
        </p>
      </div>

      {/* Credit balance card */}
      <div className="w-full max-w-xs mb-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl text-center space-y-1 border border-slate-800">
          <div className="text-[11px] uppercase tracking-widest text-emerald-400 font-extrabold mb-1">Your Simple Credit Balance</div>
          <div className="text-5xl font-extrabold text-white">{credits}</div>
          <div className="text-[11px] text-slate-400 space-y-0.5 pt-3 border-t border-slate-800">
            <div>Earn by teaching · Spend by learning</div>
            <div className="text-emerald-400 font-bold">1 Hour = 1 Credit</div>
          </div>
        </div>
      </div>

      {/* 2×2 intent grid */}
      <div className="w-full max-w-sm grid grid-cols-2 gap-3 mb-6">
        {INTENT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt)}
            className={`bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-md active:scale-95 shadow-xs ${
              selected === opt.id ? 'scale-95 opacity-60' : ''
            }`}
          >
            <div className="text-3xl mb-2.5">{opt.emoji}</div>
            <div className="text-sm font-extrabold text-slate-900">{opt.label}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">{opt.sub}</div>
          </button>
        ))}
      </div>

      {/* Quick actions row */}
      <div className="w-full max-w-sm flex gap-2">
        <button
          onClick={() => setActiveTab('notes')}
          className="flex-1 bg-white border border-slate-200/80 rounded-2xl py-3 px-3 text-left hover:bg-slate-50 transition-all shadow-xs"
        >
          <div className="text-lg mb-1">📚</div>
          <div className="text-xs font-bold text-slate-900">Browse Notes</div>
          <div className="text-[10px] text-slate-500">PYQs & guides</div>
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className="flex-1 bg-white border border-slate-200/80 rounded-2xl py-3 px-3 text-left hover:bg-slate-50 transition-all shadow-xs"
        >
          <div className="text-lg mb-1">🏆</div>
          <div className="text-xs font-bold text-slate-900">Leaderboard</div>
          <div className="text-[10px] text-slate-500">Top earners</div>
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className="flex-1 bg-white border border-slate-200/80 rounded-2xl py-3 px-3 text-left hover:bg-slate-50 transition-all shadow-xs"
        >
          <div className="text-lg mb-1">🎓</div>
          <div className="text-xs font-bold text-slate-900">My Profile</div>
          <div className="text-[10px] text-slate-500 font-medium">Portfolio & credits</div>
        </button>
      </div>

      <p className="mt-8 text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        Zero tuition · Verified campus network · Season 1
      </p>
    </div>
  );
}
