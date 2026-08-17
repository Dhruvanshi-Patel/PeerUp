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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl botanical-card bg-white p-6 sm:p-8 my-8 text-[#0A3323] shadow-xl rounded-3xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#839958]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A3323] text-[#F7F4D5] flex items-center justify-center shrink-0 shadow-sm">
              <Zap className="w-5 h-5 text-[#FAF8ED]" />
            </div>
            <div>
              <span className="badge-rose px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Daily Quests & Bounties
              </span>
              <h2 className="text-lg font-bold text-[#0A3323] mt-0.5">
                Campus Quest Board
              </h2>
            </div>
          </div>

          <button onClick={onClose} className="text-[#839958] hover:text-[#0A3323]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level XP Progress Banner */}
        <div className="p-4 rounded-2xl bg-[#FAF8ED] border border-[#839958]/25 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="badge-dark px-2.5 py-0.5 text-xs rounded-full">
                Level {level}
              </span>
              <span className="text-[#105666] font-semibold">{currentUser.badgeLevel}</span>
            </div>
            <span className="text-[#0A3323]">{xp} / {nextLevelXp} XP</span>
          </div>

          <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#839958]/25 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-[#839958] to-[#105666] rounded-full transition-all duration-500"
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
                  ? 'bg-[#FAF8ED] border-[#839958]/15 opacity-60' 
                  : quest.completed 
                  ? 'bg-white border-[#105666] shadow-md' 
                  : 'bg-white border-[#839958]/25 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/20 shrink-0 mt-0.5">
                  {getQuestIcon(quest.icon)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0A3323]">{quest.title}</h4>
                  <p className="text-xs text-[#0A3323]/80 mt-0.5 leading-relaxed">{quest.desc}</p>
                  
                  {/* Rewards preview pill */}
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-bold">
                    <span className="badge-moss px-2 py-0.5 rounded-md">+{quest.rewardXp} XP</span>
                    {quest.rewardCredits && (
                      <span className="badge-rose px-2 py-0.5 rounded-md">+{quest.rewardCredits} Credit</span>
                    )}
                    {quest.rewardKarma && (
                      <span className="badge-teal px-2 py-0.5 rounded-md">+{quest.rewardKarma} Karma</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0">
                {quest.claimed ? (
                  <span className="badge-moss px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Claimed
                  </span>
                ) : quest.completed ? (
                  <button
                    onClick={() => handleClaim(quest)}
                    className="btn-botanical-accent px-4 py-2 text-xs font-bold flex items-center gap-1.5 animate-pulse"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0A3323]" />
                    <span>Claim</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-[#839958] bg-[#FAF8ED] px-3 py-1.5 rounded-xl border border-[#839958]/20">
                    {quest.progress}/{quest.target} Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#839958]/20 flex items-center justify-between text-xs text-[#839958]">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#105666]" />
            Complete daily bounties to level up your mentor status
          </span>
          <button onClick={onClose} className="btn-botanical-outline px-4 py-1.5 text-xs font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
