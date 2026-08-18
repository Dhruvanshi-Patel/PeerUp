import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeftRight, 
  Coins, 
  Flame, 
  ShieldCheck, 
  MessageSquare, 
  Calendar, 
  Award, 
  Sparkles, 
  Plus, 
  UserCheck, 
  ChevronDown, 
  GraduationCap, 
  BookOpen, 
  Compass, 
  Trophy,
  Zap,
  Leaf,
  Gift,
  Lock,
  LogOut,
  Database,
  Share2,
  User
} from 'lucide-react';

import AuthModal from './AuthModal';
import ShareEarnModal from './ShareEarnModal';

export default function Navbar() {
  const { 
    currentUser, 
    users, 
    switchPersona, 
    activeTab, 
    setActiveTab, 
    conversations, 
    proposals, 
    scheduledSessions,
    setIsAddSkillModalOpen,
    setIsCreateProfileModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isShareModalOpen,
    setIsShareModalOpen,
    setIsPerksModalOpen,
    setIsQuestsModalOpen,
    quests,
    level,
    logout
  } = useApp();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const pendingProposalsCount = proposals.filter(p => p.receiverId === currentUser.id && p.status === 'Pending').length;
  const unreadMessagesCount = conversations.filter(c => c.unread).length;
  const totalInboxCount = pendingProposalsCount + unreadMessagesCount;
  const upcomingSessionsCount = scheduledSessions.filter(s => s.status === 'Confirmed').length;
  const unclaimedQuestsCount = quests.filter(q => q.completed && !q.claimed).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Top Ticker Bar */}
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-400" />
              PEER LEARNING NETWORK
            </span>
            <span className="hidden sm:inline text-xs text-slate-300 font-medium">
              1 Hour Taught = 1 Simple Credit • Zero Tuition Peer Exchange
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="bg-emerald-500 text-slate-950 px-2.5 py-0.5 text-[11px] font-bold rounded-full hover:bg-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-slate-950" />
              <span>🎁 Share & Earn (+2 Cr)</span>
            </button>

            <button
              onClick={() => setIsPerksModalOpen(true)}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>Campus Perks ({currentUser.credits} Cr)</span>
            </button>

            <button
              onClick={() => setIsQuestsModalOpen(true)}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Quests</span>
              {unclaimedQuestsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:bg-slate-800 transition-colors">
              <ArrowLeftRight className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  PeerUp
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                  CAMPUS
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'explore'
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'messages'
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Swaps</span>
            {totalInboxCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {totalInboxCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'sessions'
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Sessions</span>
            {upcomingSessionsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                {upcomingSessionsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('my-profile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'my-profile'
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'portfolio'
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Portfolio</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Ranks</span>
          </button>
        </nav>

        {/* Right User Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddSkillModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 text-xs flex items-center gap-1.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Add Skill</span>
          </button>

          {/* User Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                  <span>{currentUser.name}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-tight">
                  {currentUser.school}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>

            {/* User Account Menu */}
            {isPersonaMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2.5 z-50 text-slate-900">
                <div className="px-3 py-2 border-b border-slate-100 mb-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Signed In Student Account
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {currentUser.email || `${currentUser.name.toLowerCase().replace(/\s+/g, '.')}@berkeley.edu`}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                    {currentUser.school} • {currentUser.major}
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsPersonaMenuOpen(false);
                      setActiveTab('my-profile');
                    }}
                    className="w-full p-2 rounded-xl text-left text-xs font-semibold hover:bg-slate-50 text-slate-900 flex items-center gap-2 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-600" />
                    <span>My Student Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsPersonaMenuOpen(false);
                      setActiveTab('portfolio');
                    }}
                    className="w-full p-2 rounded-xl text-left text-xs font-semibold hover:bg-slate-50 text-slate-900 flex items-center gap-2 transition-colors"
                  >
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>View My Portfolio</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsPersonaMenuOpen(false);
                      setIsShareModalOpen(true);
                    }}
                    className="w-full p-2 rounded-xl text-left text-xs font-semibold hover:bg-slate-50 text-slate-900 flex items-center gap-2 transition-colors"
                  >
                    <Gift className="w-4 h-4 text-emerald-600" />
                    <span>🎁 Share Website (+2 Credits)</span>
                  </button>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsPersonaMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-rose-200/50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Database Auth Modal & Referral Share Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ShareEarnModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </header>
  );
}
