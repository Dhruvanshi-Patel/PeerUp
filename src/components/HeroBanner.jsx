import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeftRight, 
  Coins, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  Zap, 
  Leaf,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function HeroBanner() {
  const { currentUser, setIsAddSkillModalOpen, setIsQuestsModalOpen } = useApp();

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-6 sm:p-10 mb-8 border border-slate-800 shadow-xl">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline & Value Proposition */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              PeerUp Network
            </span>
            <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              {currentUser.school}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Learn anything from peers.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300">
              Zero tuition required.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
            Connect 1-for-1 with verified campus mentors. Trade Coding, Calculus, Spanish & Design in a simple credit wallet — 1 hour taught equals 1 hour learned.
          </p>

          {/* 3 SaaS Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">1:1 Skill Trade</div>
                <div className="text-[11px] text-slate-400 font-medium">Reciprocal Tutoring</div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
                <Coins className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">1 Hr = 1 Credit</div>
                <div className="text-[11px] text-slate-400 font-medium">Simple Credit Wallet</div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Verified .edu</div>
                <div className="text-[11px] text-slate-400 font-medium">Endorsed Ratings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: SaaS Action Card */}
        <div className="lg:col-span-5">
          <div className="bg-white text-slate-900 p-6 border border-slate-200 shadow-xl rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Get Started Today
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full">
                Active Campus
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Ready to trade skills on campus?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                List what you can teach to earn your first simple credit, or explore peer mentors currently offering tutoring.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setIsAddSkillModalOpen(true)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>List a Skill You Can Teach</span>
              </button>

              <button
                onClick={() => setIsQuestsModalOpen(true)}
                className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>View Campus Quests & Bounties</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
