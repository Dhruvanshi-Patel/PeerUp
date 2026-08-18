import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Star, 
  Coins, 
  Flame, 
  Award, 
  Check, 
  Plus, 
  GraduationCap, 
  BookOpen, 
  Zap, 
  Copy, 
  Crown, 
  Code, 
  Languages, 
  Utensils,
  Leaf,
  Share2,
  Linkedin,
  Github
} from 'lucide-react';

export default function ProfileView({ onOpenSocialBadge }) {
  const { 
    currentUser, 
    level, 
    xp, 
    nextLevelXp, 
    badges, 
    setIsAddSkillModalOpen, 
    openPortfolioModal,
    addToast 
  } = useApp();

  const [copied, setCopied] = useState(false);

  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-4 h-4 text-[#105666]" />;
      case 'Code': return <Code className="w-4 h-4 text-[#105666]" />;
      case 'Languages': return <Languages className="w-4 h-4 text-[#D3968C]" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-[#839958]" />;
      case 'Crown': return <Crown className="w-4 h-4 text-[#105666]" />;
      default: return <Award className="w-4 h-4 text-[#839958]" />;
    }
  };

  const handleCopyPublicLink = () => {
    setCopied(true);
    addToast('Public Portfolio Link Copied! 📋', `https://omnikon.edu/@${currentUser.id.replace('usr_', '')} copied to clipboard`, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Student Portfolio Profile Header */}
      <div className="bg-white p-6 sm:p-8 border border-slate-200/80 rounded-3xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 shadow-md shrink-0"
            />

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{currentUser.name}</h1>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-extrabold rounded-full">
                  {currentUser.badgeLevel}
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{currentUser.school} • {currentUser.major}</span>
              </p>

              <p className="text-xs text-slate-600 leading-relaxed mt-2 max-w-xl">
                "{currentUser.bio}"
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={handleCopyPublicLink}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Share Link'}</span>
            </button>

            <button
              onClick={() => openPortfolioModal(currentUser)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Export to LinkedIn</span>
            </button>

            <button
              onClick={onOpenSocialBadge}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-[#0077B5]" />
              <Github className="w-4 h-4 text-slate-900" />
              <span>Share Credits &amp; Karma</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Column Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-extrabold text-slate-900">{currentUser.hoursTaught} hrs</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Peer Tutoring Taught</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-extrabold text-amber-500 flex items-center justify-center gap-1">
            <Star className="w-5 h-5 fill-amber-500" />
            {currentUser.rating}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">{currentUser.reviewCount} Reviews</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-extrabold text-emerald-700">{currentUser.karma} pts</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Campus Karma Score</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-1">
            <Coins className="w-5 h-5 text-emerald-600" />
            {currentUser.credits} Cr
          </div>
        </div>
      </div>

      {/* Senior Contributor & PYQ Impact Banner */}
      <div className="bg-slate-900 text-white p-6 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase">
                Senior Academic Contributor
              </span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 text-[10px] font-bold rounded-full border border-slate-700">
                8 PYQs Uploaded
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-1">
              142 Junior Students Helped via PYQ Papers & Cheatsheets
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Every time a junior unlocks your notes, you earn +1 Simple Credit & +25 Impact Karma!
            </p>
          </div>
        </div>

        <button
          onClick={() => openPortfolioModal(currentUser)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs shrink-0 flex items-center gap-1.5 shadow-md transition-all"
        >
          <Share2 className="w-4 h-4 text-slate-950" />
          <span>Add 8 PYQs to LinkedIn</span>
        </button>
      </div>

      {/* Skills Offered & Wanted Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Offered */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Skills Offered (Can Teach)</span>
            </h3>

            <button
              onClick={() => setIsAddSkillModalOpen(true)}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {currentUser.skillsOffered.map(skill => (
              <div
                key={skill.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-extrabold text-slate-900">{skill.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{skill.category} • {skill.level}</div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold rounded-full">
                  {skill.endorsementCount}★ Endorsed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Skills Wanted (Need Learning)</span>
            </h3>

            <button
              onClick={() => setIsAddSkillModalOpen(true)}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Request</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {currentUser.skillsWanted.map(skill => (
              <div
                key={skill.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-extrabold text-slate-900">{skill.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{skill.category}</div>
                </div>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold rounded-full">
                  Priority: {skill.priority || 'High'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unlocked Badges Shelf */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Unlocked Achievements Shelf</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`p-3 rounded-xl text-center border transition-all ${
                badge.unlocked
                  ? 'bg-slate-50 border-slate-200 shadow-sm'
                  : 'bg-slate-50/50 border-slate-100 opacity-40'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center mx-auto mb-2 shadow-xs">
                {getBadgeIcon(badge.icon)}
              </div>
              <div className="font-extrabold text-xs text-slate-900 truncate">{badge.title}</div>
              <div className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{badge.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
