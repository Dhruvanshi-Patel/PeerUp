import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Flame, 
  Award, 
  Crown, 
  Sparkles, 
  GraduationCap, 
  Zap,
  Leaf
} from 'lucide-react';

export default function LeaderboardView() {
  const { leaderboard, openSwapModalForUser, users } = useApp();

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1: return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 text-xs font-extrabold rounded-lg">🥇 1ST</span>;
      case 2: return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 text-xs font-bold rounded-lg">🥈 2ND</span>;
      case 3: return <span className="bg-amber-100/60 text-amber-800 border border-amber-300/60 px-2.5 py-1 text-xs font-bold rounded-lg">🥉 3RD</span>;
      default: return <span className="text-xs font-extrabold text-slate-500">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 border border-slate-200/80 rounded-3xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                Campus Honor Roll
              </span>
              <span className="text-xs text-emerald-700 font-semibold">Active Peer Season</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Top Student Mentors</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              Climb the ranks by teaching peers, maintaining 5-star ratings, and completing daily quest bounties on campus!
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-right shrink-0 shadow-sm">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">HONOR FORMULA</div>
            <div className="text-xs font-extrabold text-slate-900 mt-0.5">Karma = (Hours × 25) + Rating Bonus</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Crown className="w-4 h-4 text-emerald-600" />
            Top 5 Campus Champions
          </h3>
          <span className="text-xs font-semibold text-slate-500">Grandmaster & Master Tiers</span>
        </div>

        <div className="divide-y divide-slate-100">
          {leaderboard.map(entry => {
            const matchedUser = users.find(u => u.name === entry.name);

            return (
              <div
                key={entry.rank}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 flex items-center justify-center shrink-0">
                    {getRankBadge(entry.rank)}
                  </div>

                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">{entry.name}</h4>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold rounded-full">
                        {entry.badge}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                      <span>{entry.school}</span>
                      <span>•</span>
                      <span>{entry.hours} Hours Taught</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pl-12 sm:pl-0">
                  <div className="text-left sm:text-right">
                    <div className="flex items-center sm:justify-end gap-1 text-sm font-extrabold text-emerald-700">
                      <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                      {entry.karma} Pts
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Karma Score</div>
                  </div>

                  {matchedUser && (
                    <button
                      onClick={() => openSwapModalForUser(matchedUser)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3.5 text-xs rounded-xl shadow-sm transition-all"
                    >
                      Propose Swap
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
