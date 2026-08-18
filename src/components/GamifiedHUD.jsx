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
    <div className="mb-6 p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm text-slate-900">
      {/* Player Level & XP Gauge */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 leading-none">LVL</span>
            <span className="text-base font-extrabold text-white leading-none mt-0.5">{level}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 truncate">{currentUser.name}</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase">
                {currentUser.badgeLevel}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-xs font-semibold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {xp} <span className="text-slate-400 font-normal">/ {nextLevelXp} XP</span>
              </span>
            </div>
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (xp / nextLevelXp) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Streak & Quest Trigger Button */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-sm">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{currentUser.streak} Week Streak</span>
        </div>

        <button
          onClick={() => setIsQuestsModalOpen(true)}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            completedUnclaimedCount > 0
              ? 'bg-emerald-500 text-slate-950 shadow-md animate-pulse'
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Campus Quests</span>
          {completedUnclaimedCount > 0 && (
            <span className="px-1.5 py-0.2 bg-slate-950 text-white text-[10px] rounded-full">
              {completedUnclaimedCount}
            </span>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
