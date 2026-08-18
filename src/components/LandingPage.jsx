import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUSES, CATEGORIES } from '../data/mockData';
import {
  ArrowRight, ArrowLeftRight, BookOpen, Users, Zap,
  Lock, Mail, User, GraduationCap, ShieldCheck, Sparkles,
  Check, Eye, EyeOff, Dice6, Search, Clock, Leaf,
  Star, Trophy, ChevronRight, Gift
} from 'lucide-react';

import { isUniversityEmail } from './CreateProfileModal';

/* ───────────────────────── helpers ───────────────────────── */
const INTENT_OPTIONS = [
  {
    id: 'surprise',
    emoji: '🎲',
    label: 'Surprise me',
    sub: 'Random skill discovery',
    icon: Dice6,
    color: '#D3968C',
    bg: 'rgba(211,150,140,0.12)',
    border: 'rgba(211,150,140,0.3)',
    tab: 'explore'
  },
  {
    id: 'find_skill',
    emoji: '🔍',
    label: 'Find a skill',
    sub: 'Browse peer mentors',
    icon: Search,
    color: '#105666',
    bg: 'rgba(16,86,102,0.10)',
    border: 'rgba(16,86,102,0.25)',
    tab: 'explore'
  },
  {
    id: 'find_someone',
    emoji: '👥',
    label: 'Find someone',
    sub: 'Search by name or campus',
    icon: Users,
    color: '#839958',
    bg: 'rgba(131,153,88,0.12)',
    border: 'rgba(131,153,88,0.3)',
    tab: 'explore'
  },
  {
    id: 'learn_60',
    emoji: '⚡',
    label: 'Learn in 60 min',
    sub: 'Start a live session now',
    icon: Clock,
    color: '#0A3323',
    bg: 'rgba(10,51,35,0.08)',
    border: 'rgba(10,51,35,0.2)',
    tab: 'sessions'
  }
];

/* ───────────────────────── main component ───────────────────────── */
export default function LandingPage({ onBack }) {
  const {
    users,
    loginWithPassword,
    registerWithPassword,
    setActiveTab,
    addToast
  } = useApp();

  /* flow: 'intent' | 'auth' | 'welcome' */
  const [flow, setFlow] = useState('auth');          // start on auth page
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [mode, setMode] = useState('login');          // 'login' | 'register'

  /* form state */
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [regSchool, setRegSchool] = useState('UC Berkeley');
  const [regMajor, setRegMajor] = useState('');
  const [regSkill, setRegSkill] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* demo quick-fill */
  const fillDemo = (email) => {
    setLoginEmail(email);
    setLoginPassword('password123');
  };

  /* ---- submit handlers ---- */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setIsSubmitting(true);
    try {
      await loginWithPassword(loginEmail.trim(), loginPassword.trim());
      // App.jsx will automatically switch to main app + WelcomeScreen
    } catch (err) {
      addToast('Login Failed', err.message, 'error');
    }
    setIsSubmitting(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) return;

    if (!isUniversityEmail(regEmail.trim())) {
      addToast('University Email Required 🏫', 'Please enter your official campus email address (e.g. name@berkeley.edu, name@stanford.edu, or name@ox.ac.uk). Commercial emails (Gmail/Yahoo) are not accepted for student verification.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const skillsOffered = regSkill.trim()
        ? [{ id: 'sk_' + Date.now(), name: regSkill.trim(), category: 'Academic & STEM', level: 'Intermediate', endorsementCount: 1 }]
        : [];
      await registerWithPassword({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        school: regSchool,
        major: regMajor.trim() || 'Undeclared',
        bio: 'Excited to trade skills on campus!',
        skillsOffered
      });
      // App.jsx will automatically switch to main app + WelcomeScreen
    } catch (err) {
      addToast('Registration Error', err.message, 'error');
    }
    setIsSubmitting(false);
  };

  /* ---- intent selection ---- */
  const handleIntentSelect = (option) => {
    setSelectedIntent(option.id);
    setTimeout(() => {
      setActiveTab(option.tab);
      // signal parent that login is complete — handled via isLoggedIn state in App
    }, 400);
  };

  /* ========================= RENDER ========================= */

  /* ---- INTENT SCREEN (after login) ---- */
  if (flow === 'intent') {
    return (
      <div className="min-h-screen bg-[#F7F4D5] flex flex-col items-center justify-center px-4"
        style={{ backgroundImage: 'radial-gradient(#839958 0.5px, transparent 0.5px)', backgroundSize: '28px 28px' }}>

        {/* Header */}
        <div className="mb-10 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#0A3323] flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-[#F7F4D5]" />
            </div>
            <span className="text-xl font-bold text-[#0A3323]">PeerUp</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0A3323] tracking-tight">
            What do you want to learn today?
          </h1>
          <p className="text-[#839958] text-sm font-medium">
            Teach → Earn → Learn → Level Up → Teach something new
          </p>
        </div>

        {/* You have N Hours credit card */}
        <div className="w-full max-w-sm mb-8">
          <div className="bg-[#0A3323] text-[#F7F4D5] rounded-3xl p-6 shadow-xl text-center space-y-2">
            <div className="text-4xl font-black tracking-tight">4 Hours</div>
            <div className="text-[#839958] text-xs font-semibold uppercase tracking-widest">Available Credits</div>
            <div className="pt-2 border-t border-white/10 text-[11px] text-[#F7F4D5]/60 space-y-0.5">
              <div>Earn them by teaching.</div>
              <div>Spend them by learning.</div>
            </div>
          </div>
        </div>

        {/* 4 intent tiles */}
        <div className="w-full max-w-sm grid grid-cols-2 gap-3">
          {INTENT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleIntentSelect(opt)}
              className="rounded-2xl p-4 text-left transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
              style={{ background: opt.bg, border: `1px solid ${opt.border}` }}
            >
              <div className="text-2xl mb-2">{opt.emoji}</div>
              <div className="text-xs font-bold text-[#0A3323]">{opt.label}</div>
              <div className="text-[10px] text-[#839958] mt-0.5">{opt.sub}</div>
            </button>
          ))}
        </div>

        {/* Core loop reminder */}
        <div className="mt-8 flex items-center gap-2 text-[11px] text-[#0A3323]/50 font-medium">
          <Leaf className="w-3.5 h-3.5 text-[#839958]" />
          <span>1 Hr Taught = 1 Simple Credit · Zero Tuition Peer Exchange</span>
        </div>
      </div>
    );
  }

  /* ---- AUTH SCREEN (default) ---- */
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ===== Left panel – hero ===== */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A3323] flex-col justify-between p-12 relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#839958]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-[#105666]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <ArrowLeftRight className="w-5 h-5 text-[#D3968C]" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-none">PeerUp</div>
              <div className="text-[#839958] text-[11px]">Peer Learning Network</div>
            </div>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-white/40 hover:text-white/80 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              ← Back to home
            </button>
          )}
        </div>

        {/* Hero headline */}
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Learn anything<br />
              <span className="text-[#D3968C]">from peers.</span><br />
              Zero tuition.
            </h1>
            <p className="text-[#F7F4D5]/60 text-base mt-4 leading-relaxed max-w-sm">
              A trust-based skill economy for students. Teach what you know. Earn hours. Spend them learning something new.
            </p>
          </div>

          {/* 3 pillars */}
          <div className="space-y-3">
            {[
              { icon: ArrowLeftRight, label: '1:1 Skill Trade', sub: 'Reciprocal tutoring', color: '#D3968C' },
              { icon: Trophy, label: '1 Hr = 1 Credit', sub: 'Simple credit wallet', color: '#839958' },
              { icon: ShieldCheck, label: 'Verified .edu', sub: 'Campus network only', color: '#105666' }
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${p.color}20`, border: `1px solid ${p.color}40` }}>
                  <p.icon className="w-4 h-4" style={{ color: p.color }} />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">{p.label}</div>
                  <div className="text-white/40 text-[10px]">{p.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-6 pt-4 border-t border-white/10">
            {[['2,400+', 'Students'], ['8 Campuses', 'Verified'], ['12K hrs', 'Exchanged']].map(([n, l]) => (
              <div key={l}>
                <div className="text-white font-black text-xl">{n}</div>
                <div className="text-white/40 text-[10px] uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative z-10 text-[10px] text-white/30 flex items-center gap-1.5">
          <Leaf className="w-3 h-3 text-[#839958]" />
          Season 1 · Solarpunk · Campus Peer Exchange
        </div>
      </div>

      {/* ===== Right panel – auth form ===== */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#FAF8ED] p-6 sm:p-10 overflow-y-auto"
        style={{ backgroundImage: 'radial-gradient(#839958 0.4px, transparent 0.4px)', backgroundSize: '24px 24px' }}>

        {/* mobile header with back button */}
        <div className="lg:hidden flex items-center justify-between w-full max-w-md mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0A3323] flex items-center justify-center">
              <ArrowLeftRight className="w-4.5 h-4.5 text-[#F7F4D5]" />
            </div>
            <span className="text-[#0A3323] font-bold text-lg">PeerUp</span>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-[#0A3323]/50 hover:text-[#0A3323] text-xs font-semibold transition-colors"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-[#839958]/20 p-6 sm:p-8 space-y-6">

            {/* Heading */}
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#0A3323]">
                {mode === 'login' ? 'Welcome back 👋' : 'Join the network ✨'}
              </h2>
              <p className="text-[11px] text-[#839958]">
                {mode === 'login'
                  ? 'Sign in to your campus account'
                  : 'Create your free student profile'}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="grid grid-cols-2 gap-1.5 bg-[#FAF8ED] p-1.5 rounded-2xl border border-[#839958]/20">
              {['login', 'register'].map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === m
                      ? 'bg-[#0A3323] text-[#F7F4D5] shadow-sm'
                      : 'text-[#0A3323]/60 hover:text-[#0A3323]'
                  }`}
                >
                  {m === 'login' ? '🔐 Sign In' : '🌱 Register'}
                </button>
              ))}
            </div>

            {/* ===== LOGIN ===== */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0A3323]">Campus Email (.edu)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#839958]" />
                    <input
                      type="email" required
                      placeholder="priya@berkeley.edu"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] text-sm focus:outline-none focus:border-[#0A3323] transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0A3323]">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#839958]" />
                    <input
                      type={showLoginPw ? 'text' : 'password'} required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] text-sm focus:outline-none focus:border-[#0A3323] transition-colors"
                    />
                    <button type="button" onClick={() => setShowLoginPw(!showLoginPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#839958] hover:text-[#0A3323]">
                      {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Security Requirement */}
                <div className="bg-[#FAF8ED] border border-[#839958]/20 rounded-2xl p-3 space-y-1 text-xs">
                  <div className="text-[10px] font-bold text-[#105666] uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#839958]" /> Password Verification Required
                  </div>
                  <p className="text-[11px] text-[#0A3323]/80">
                    Sign in with your registered student email and account password.
                  </p>
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-[#0A3323] text-[#F7F4D5] py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#105666] transition-colors shadow-sm disabled:opacity-60">
                  {isSubmitting ? 'Signing in…' : 'Sign In to Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ===== REGISTER ===== */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0A3323]">Full Name *</label>
                    <input type="text" required placeholder="Maya Lin"
                      value={regName} onChange={e => setRegName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] text-sm focus:outline-none focus:border-[#0A3323] transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0A3323]">University</label>
                    <select value={regSchool} onChange={e => setRegSchool(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] text-sm focus:outline-none focus:border-[#0A3323] transition-colors">
                      {CAMPUSES.filter(c => c !== 'All Campuses').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0A3323] flex items-center justify-between">
                      <span>Campus Email (.edu) *</span>
                      {regEmail && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isUniversityEmail(regEmail) ? 'bg-[#839958]/20 text-[#0A3323]' : 'bg-rose-100 text-rose-700'}`}>
                          {isUniversityEmail(regEmail) ? '✓ Campus Mail Valid' : '⚠️ Must be campus mail'}
                        </span>
                      )}
                    </label>
                    <input type="email" required placeholder="maya@berkeley.edu"
                      value={regEmail} onChange={e => setRegEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border text-[#0A3323] text-sm focus:outline-none transition-colors ${
                        regEmail && !isUniversityEmail(regEmail) ? 'border-rose-400 focus:border-rose-600' : 'border-[#839958]/30 focus:border-[#0A3323]'
                      }`} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0A3323]">Password *</label>
                    <div className="relative">
                      <input type={showRegPw ? 'text' : 'password'} required placeholder="Min 6 chars"
                        value={regPassword} onChange={e => setRegPassword(e.target.value)}
                        className="w-full px-3.5 pr-9 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] text-sm focus:outline-none focus:border-[#0A3323] transition-colors" />
                      <button type="button" onClick={() => setShowRegPw(!showRegPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#839958]">
                        {showRegPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0A3323]">Major / Year</label>
                    <input type="text" placeholder="CS (Sophomore)"
                      value={regMajor} onChange={e => setRegMajor(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] text-sm focus:outline-none focus:border-[#0A3323] transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0A3323]">Skill You Can Teach</label>
                    <input type="text" placeholder="e.g. Python / Guitar"
                      value={regSkill} onChange={e => setRegSkill(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] text-sm focus:outline-none focus:border-[#0A3323] transition-colors" />
                  </div>
                </div>

                {/* Reward callout */}
                <div className="bg-[#0A3323]/5 border border-[#839958]/25 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <div className="text-xs text-[#0A3323]/70">Welcome grant on signup</div>
                  <div className="text-xs font-black text-[#0A3323]">+5 Credits & 150 Karma</div>
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-[#0A3323] text-[#F7F4D5] py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#105666] transition-colors shadow-sm disabled:opacity-60">
                  {isSubmitting ? 'Creating account…' : 'Create Account & Claim +5 Credits'}
                  <Check className="w-4 h-4 text-[#D3968C]" />
                </button>
              </form>
            )}
          </div>

          {/* Share-to-earn teaser */}
          <div className="mt-4 bg-white/70 backdrop-blur-sm border border-[#839958]/20 rounded-2xl px-4 py-3 flex items-center gap-3">
            <Gift className="w-5 h-5 text-[#D3968C] shrink-0" />
            <div className="flex-1 text-[11px] text-[#0A3323]/60">
              Share PeerUp with friends → earn <span className="font-bold text-[#0A3323]">+2 Credits</span> per referral
            </div>
            <ChevronRight className="w-4 h-4 text-[#839958]" />
          </div>

          <p className="text-center text-[10px] text-[#0A3323]/40 mt-4">
            All passwords stored securely · Verified .edu campus network
          </p>
        </div>
      </div>
    </div>
  );
}
