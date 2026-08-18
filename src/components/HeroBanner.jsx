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
  const { currentUser, setIsAddSkillModalOpen, setIsQuestsModalOpen, level } = useApp();

  return (
    <div className="relative overflow-hidden botanical-card-cream p-6 sm:p-10 mb-8 border border-[#839958]/25 shadow-sm">
      {/* Background Decorative Organic Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#839958]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#105666]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline & Value Proposition */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-rose px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#0A3323]" />
              PeerUp Network
            </span>
            <span className="badge-moss px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#0A3323]" />
              {currentUser.school}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#0A3323] tracking-tight leading-tight">
            Learn anything from peers. <br />
            <span className="text-[#105666]">Zero tuition required.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#0A3323]/80 leading-relaxed max-w-2xl font-normal">
            Connect 1-for-1 with verified campus mentors. Trade Coding, Calculus, Spanish & Design in a simple credit wallet—1 hour taught earned equals 1 hour learned.
          </p>

          {/* 3 Botanical Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/80 border border-[#839958]/25 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-[#0A3323] text-[#F7F4D5] flex items-center justify-center shrink-0">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0A3323]">1:1 Skill Trade</div>
                <div className="text-[11px] text-[#839958] font-medium">Reciprocal Tutoring</div>
              </div>
            </div>

            <div className="bg-white/80 border border-[#839958]/25 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-[#105666] text-[#F7F4D5] flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4 text-[#FAF8ED]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0A3323]">1 Hr = 1 Credit</div>
                <div className="text-[11px] text-[#839958] font-medium">Simple Credit Wallet</div>
              </div>
            </div>

            <div className="bg-white/80 border border-[#839958]/25 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-[#D3968C] text-[#0A3323] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0A3323]">Verified .edu</div>
                <div className="text-[11px] text-[#839958] font-medium">Endorsed Ratings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Serene Action Card */}
        <div className="lg:col-span-5">
          <div className="botanical-card p-6 bg-white border border-[#839958]/30 shadow-md rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#839958]/15 pb-3">
              <span className="text-xs font-bold text-[#105666] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D3968C]" />
                Get Started Today
              </span>
              <span className="badge-moss px-2.5 py-0.5 text-[10px] font-bold rounded-full">
                Active Campus
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0A3323]">
                Ready to trade skills on campus?
              </h3>
              <p className="text-xs text-[#0A3323]/70 mt-1 leading-relaxed">
                List what you can teach to earn your first simple credit, or explore peer mentors currently offering tutoring.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setIsAddSkillModalOpen(true)}
                className="w-full btn-botanical-primary py-3 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#D3968C]" />
                <span>List a Skill You Can Teach</span>
              </button>

              <button
                onClick={() => setIsQuestsModalOpen(true)}
                className="w-full btn-botanical-outline py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#105666]" />
                <span>View Campus Quests & Bounties</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
