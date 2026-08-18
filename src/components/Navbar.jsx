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
    <header className="sticky top-0 z-40 w-full border-b border-[#839958]/25 bg-[#FAF8ED]/95 backdrop-blur-md shadow-sm">
      {/* Top Serene Ticker Bar */}
      <div className="border-b border-[#839958]/15 bg-[#0A3323] px-4 py-1.5 text-xs text-[#F7F4D5]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="badge-rose px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
              <Leaf className="w-3 h-3 text-[#0A3323]" />
              PEER LEARNING NETWORK
            </span>
            <span className="hidden sm:inline text-xs text-[#FAF8ED]/80 font-medium">
              1 Hour Taught = 1 Simple Credit • Zero Tuition Peer Exchange
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="badge-rose px-2.5 py-0.5 text-[11px] font-bold rounded-full hover:bg-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-[#0A3323]" />
              <span>🎁 Share & Earn (+2 Cr)</span>
            </button>

            <button
              onClick={() => setIsPerksModalOpen(true)}
              className="text-[#FAF8ED]/90 hover:text-white transition-colors flex items-center gap-1"
            >
              <Coins className="w-3.5 h-3.5 text-[#D3968C]" />
              <span>Campus Perks ({currentUser.credits} Cr)</span>
            </button>

            <button
              onClick={() => setIsQuestsModalOpen(true)}
              className="text-[#FAF8ED]/90 hover:text-white transition-colors flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-[#839958]" />
              <span>Daily Quests</span>
              {unclaimedQuestsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#D3968C] animate-pulse"></span>
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
            <div className="w-10 h-10 rounded-xl bg-[#0A3323] text-[#F7F4D5] flex items-center justify-center shadow-sm group-hover:bg-[#105666] transition-colors">
              <ArrowLeftRight className="w-5 h-5 text-[#FAF8ED]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-[#0A3323] tracking-tight">
                  PeerUp
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#839958]/20 text-[#0A3323] text-[10px] font-bold">
                  CAMPUS
                </span>
              </div>
              <span className="text-[11px] text-[#839958] font-medium block -mt-0.5">
                Botanical Peer Network
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F7F4D5] p-1.5 rounded-2xl border border-[#839958]/20">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'explore'
                ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                : 'text-[#0A3323]/80 hover:text-[#0A3323] hover:bg-white/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                : 'text-[#0A3323]/80 hover:text-[#0A3323] hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'messages'
                ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                : 'text-[#0A3323]/80 hover:text-[#0A3323] hover:bg-white/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Swaps</span>
            {totalInboxCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#D3968C] text-[#0A3323] text-[10px] font-bold">
                {totalInboxCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'sessions'
                ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                : 'text-[#0A3323]/80 hover:text-[#0A3323] hover:bg-white/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Sessions</span>
            {upcomingSessionsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#839958] text-white text-[10px] font-bold">
                {upcomingSessionsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('my-profile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'my-profile'
                ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                : 'text-[#0A3323]/80 hover:text-[#0A3323] hover:bg-white/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                : 'text-[#0A3323]/80 hover:text-[#0A3323] hover:bg-white/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Portfolio</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                : 'text-[#0A3323]/80 hover:text-[#0A3323] hover:bg-white/60'
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
            className="btn-botanical-primary px-3.5 py-2 text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Skill</span>
          </button>

          {/* User Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-[#839958]/30 hover:border-[#839958] transition-all shadow-sm"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-[#839958]/20"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-[#0A3323] leading-tight flex items-center gap-1">
                  <span>{currentUser.name}</span>
                </div>
                <div className="text-[10px] text-[#839958] font-medium leading-tight">
                  {currentUser.school}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#0A3323]/60 shrink-0" />
            </button>

            {/* User Account Menu (Password Protected) */}
            {isPersonaMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#839958]/30 shadow-xl p-2.5 z-50 text-[#0A3323]">
                <div className="px-3 py-2 border-b border-[#839958]/15 mb-2">
                  <div className="text-[10px] font-bold text-[#839958] uppercase tracking-wider">
                    Signed In Student Account
                  </div>
                  <div className="text-xs font-bold text-[#0A3323] mt-0.5 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-[#0A3323]/70 truncate">
                    {currentUser.email || `${currentUser.name.toLowerCase().replace(/\s+/g, '.')}@berkeley.edu`}
                  </div>
                  <div className="text-[10px] text-[#105666] font-semibold mt-1">
                    {currentUser.school} • {currentUser.major}
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsPersonaMenuOpen(false);
                      setActiveTab('my-profile');
                    }}
                    className="w-full p-2 rounded-xl text-left text-xs font-semibold hover:bg-[#FAF8ED] text-[#0A3323] flex items-center gap-2 transition-colors font-bold"
                  >
                    <User className="w-4 h-4 text-[#105666]" />
                    <span>My Student Profile & Photo</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsPersonaMenuOpen(false);
                      setActiveTab('profile');
                    }}
                    className="w-full p-2 rounded-xl text-left text-xs font-semibold hover:bg-[#FAF8ED] text-[#0A3323] flex items-center gap-2 transition-colors"
                  >
                    <Award className="w-4 h-4 text-[#839958]" />
                    <span>View My Portfolio</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsPersonaMenuOpen(false);
                      setActiveTab('sessions');
                    }}
                    className="w-full p-2 rounded-xl text-left text-xs font-semibold hover:bg-[#FAF8ED] text-[#0A3323] flex items-center gap-2 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-[#105666]" />
                    <span>My Scheduled Sessions</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsPersonaMenuOpen(false);
                      setIsShareModalOpen(true);
                    }}
                    className="w-full p-2 rounded-xl text-left text-xs font-semibold hover:bg-[#FAF8ED] text-[#0A3323] flex items-center gap-2 transition-colors"
                  >
                    <Gift className="w-4 h-4 text-[#D3968C]" />
                    <span>🎁 Share Website (+2 Credits)</span>
                  </button>
                </div>

                <div className="pt-2 mt-2 border-t border-[#839958]/15">
                  <button
                    onClick={() => {
                      setIsPersonaMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-red-200/50"
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
