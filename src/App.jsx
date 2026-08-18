import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import GamifiedHUD from './components/GamifiedHUD';
import HeroBanner from './components/HeroBanner';
import ExploreSkills from './components/ExploreSkills';
import MessagesHub from './components/MessagesHub';
import SessionsView from './components/SessionsView';
import ProfileView from './components/ProfileView';
import MyProfileView from './components/MyProfileView';
import LeaderboardView from './components/LeaderboardView';
import NotesExchangeView from './components/NotesExchangeView';
import SwapProposalModal from './components/SwapProposalModal';
import LiveSessionRoom from './components/LiveSessionRoom';
import ReviewModal from './components/ReviewModal';
import AddSkillModal from './components/AddSkillModal';
import SharePortfolioModal from './components/SharePortfolioModal';
import CreateProfileModal from './components/CreateProfileModal';
import CampusPerksModal from './components/CampusPerksModal';
import DailyQuestsModal from './components/DailyQuestsModal';
import ToastContainer from './components/ToastContainer';
import PublicHomePage from './components/PublicHomePage';
import LandingPage from './components/LandingPage';
import WelcomeScreen from './components/WelcomeScreen';
import SocialBadgeModal from './components/SocialBadgeModal';
import { ArrowLeftRight, ShieldCheck } from 'lucide-react';

function AppContent() {
  const {
    isLoggedIn,
    activeTab,
    isCreateProfileModalOpen,
    setIsCreateProfileModalOpen,
    isPerksModalOpen,
    setIsPerksModalOpen,
    isQuestsModalOpen,
    setIsQuestsModalOpen,
  } = useApp();

  // Controls whether the auth form overlay is visible over the public homepage
  const [showAuthForm, setShowAuthForm] = useState(false);

  // Social badge modal state (accessible from ProfileView via context or prop-drilling — here via global state)
  const [isSocialBadgeOpen, setIsSocialBadgeOpen] = useState(false);

  /* ── PUBLIC HOMEPAGE (not logged in) ── */
  if (!isLoggedIn) {
    return (
      <>
        {/* Marketing homepage — always visible */}
        <PublicHomePage onGetStarted={() => setShowAuthForm(true)} />

        {/* Auth form slides in as a full-screen overlay when CTA is clicked */}
        {showAuthForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm">
            <LandingPage onBack={() => setShowAuthForm(false)} />
          </div>
        )}

        <ToastContainer />
      </>
    );
  }

  /* ── AUTHENTICATED APP ── */
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <GamifiedHUD />

        {activeTab === 'welcome' && (
          <div className="animate-fade-in">
            <WelcomeScreen />
          </div>
        )}

        {activeTab === 'explore' && (
          <div className="space-y-6 animate-fade-in">
            <HeroBanner />
            <ExploreSkills />
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="animate-fade-in">
            <NotesExchangeView />
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="animate-fade-in">
            <MessagesHub />
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="animate-fade-in">
            <SessionsView />
          </div>
        )}

        {activeTab === 'my-profile' && (
          <div className="animate-fade-in">
            <MyProfileView />
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="animate-fade-in">
            {/* Pass the badge modal opener down via a prop on ProfileView */}
            <ProfileView onOpenSocialBadge={() => setIsSocialBadgeOpen(true)} />
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="animate-fade-in">
            <LeaderboardView />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <SwapProposalModal />
      <LiveSessionRoom />
      <ReviewModal />
      <AddSkillModal />
      <SharePortfolioModal />
      <SocialBadgeModal
        isOpen={isSocialBadgeOpen}
        onClose={() => setIsSocialBadgeOpen(false)}
      />
      <CreateProfileModal
        isOpen={isCreateProfileModalOpen}
        onClose={() => setIsCreateProfileModalOpen(false)}
      />
      <CampusPerksModal
        isOpen={isPerksModalOpen}
        onClose={() => setIsPerksModalOpen(false)}
      />
      <DailyQuestsModal
        isOpen={isQuestsModalOpen}
        onClose={() => setIsQuestsModalOpen(false)}
      />

      <ToastContainer />

      <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center">
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="font-extrabold text-slate-900 text-xs">PeerUp</span>
            <span className="text-slate-400">· Peer Skill Exchange Network</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified .EDU Campus Network
            </span>
            <span>·</span>
            <span className="text-slate-900 font-bold">1 Hr Taught = 1 Credit</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
