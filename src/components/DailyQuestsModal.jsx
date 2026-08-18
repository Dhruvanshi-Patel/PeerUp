import React from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  BookOpen, 
  Video, 
  Coins, 
  Award, 
  Flame, 
  ShieldCheck,
  Check,
  Leaf
} from 'lucide-react';

export default function DailyQuestsModal({ isOpen, onClose }) {
  const { quests, claimQuest, currentUser, level, xp, nextLevelXp } = useApp();

  if (!isOpen) return null;

  const getQuestIcon = (iconName) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 text-[#105666]" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-[#105666]" />;
      case 'Video': return <Video className="w-5 h-5 text-[#D3968C]" />;
      default: return <Sparkles className="w-5 h-5 text-[#839958]" />;
    }
  };

  const handleClaim = (quest) => {
    claimQuest(quest.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl bg-white p-6 sm:p-8 my-8 text-slate-900 shadow-2xl rounded-3xl space-y-4 border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                Daily Quests & Bounties
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                Campus Quest Board
              </h2>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level XP Progress Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-white px-2.5 py-0.5 text-xs rounded-full">
                Level {level}
              </span>
              <span className="text-emerald-700 font-semibold">{currentUser.badgeLevel}</span>
            </div>
            <span className="text-slate-900">{xp} / {nextLevelXp} XP</span>
          </div>

          <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-slate-200 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (xp / nextLevelXp) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Quests List */}
        <div className="space-y-3">
          {quests.map(quest => (
            <div
              key={quest.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                quest.claimed 
                  ? 'bg-slate-50 border-slate-200/60 opacity-60' 
                  : quest.completed 
                  ? 'bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/30' 
                  : 'bg-white border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shrink-0 mt-0.5">
                  {getQuestIcon(quest.icon)}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{quest.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{quest.desc}</p>
                  
                  {/* Rewards preview pill */}
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-extrabold">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">+{quest.rewardXp} XP</span>
                    {quest.rewardCredits && (
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md">+{quest.rewardCredits} Credit</span>
                    )}
                    {quest.rewardKarma && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md">+{quest.rewardKarma} Karma</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0">
                {quest.claimed ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Claimed
                  </span>
                ) : quest.completed ? (
                  <button
                    onClick={() => handleClaim(quest)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 text-xs font-extrabold flex items-center gap-1.5 rounded-xl animate-pulse shadow-xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>Claim</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    {quest.progress}/{quest.target} Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Complete daily bounties to level up your mentor status
          </span>
          <button onClick={onClose} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 py-1.5 text-xs rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
