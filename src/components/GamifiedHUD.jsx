import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, 
  Sparkles, 
  Flame, 
  Award, 
  ChevronRight, 
  CheckCircle, 
  ShieldCheck, 
  Trophy,
  Heart
} from 'lucide-react';

export default function GamifiedHUD() {
  const { currentUser, level, xp, nextLevelXp, quests, setIsQuestsModalOpen } = useApp();

  const completedUnclaimedCount = quests.filter(q => q.completed && !q.claimed).length;

  return (
    <div className="mb-8 p-4 botanical-card-cream flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border border-[#839958]/25 shadow-sm">
      {/* Player Level & XP Gauge */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl bg-[#0A3323] text-[#F7F4D5] flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#839958] leading-none">LVL</span>
            <span className="text-base font-extrabold text-[#F7F4D5] leading-none mt-0.5">{level}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#0A3323] truncate">{currentUser.name}</span>
              <span className="badge-teal px-2.5 py-0.5 text-[10px] font-semibold rounded-full uppercase">
                {currentUser.badgeLevel}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-xs font-semibold text-[#0A3323]">
              <Sparkles className="w-3.5 h-3.5 text-[#D3968C]" />
              <span>
                {xp} <span className="text-[#839958] font-normal">/ {nextLevelXp} XP</span>
              </span>
            </div>
          </div>

          {/* Smooth Botanical Progress Bar */}
          <div className="w-full h-2.5 bg-[#FAF8ED] rounded-full overflow-hidden border border-[#839958]/25 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-[#839958] to-[#105666] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (xp / nextLevelXp) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Streak & Quest Trigger Button */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#839958]/25 text-xs font-semibold text-[#0A3323] shadow-sm">
          <Flame className="w-4 h-4 text-[#D3968C] fill-[#D3968C]" />
          <span>{currentUser.streak} Week Streak</span>
        </div>

        <button
          onClick={() => setIsQuestsModalOpen(true)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            completedUnclaimedCount > 0
              ? 'btn-botanical-accent animate-pulse'
              : 'btn-botanical-secondary'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Campus Quests</span>
          {completedUnclaimedCount > 0 && (
            <span className="px-1.5 py-0.2 bg-[#0A3323] text-[#F7F4D5] text-[10px] rounded-full">
              {completedUnclaimedCount}
            </span>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
