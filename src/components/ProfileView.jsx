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
    addToast('Public Portfolio Link Copied! 📋', `https://peerup.edu/@${currentUser.id.replace('usr_', '')} copied to clipboard`, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Botanical Student Profile Header */}
      <div className="botanical-card-cream p-6 sm:p-8 border border-[#839958]/25 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#839958]/30 shadow-md shrink-0"
            />

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0A3323]">{currentUser.name}</h1>
                <span className="badge-teal px-2.5 py-0.5 text-xs font-bold rounded-full">
                  {currentUser.badgeLevel}
                </span>
              </div>

              <p className="text-xs text-[#839958] font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#105666]" />
                <span>{currentUser.school} • {currentUser.major}</span>
              </p>

              <p className="text-xs text-[#0A3323]/80 leading-relaxed mt-2 max-w-xl">
                "{currentUser.bio}"
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={handleCopyPublicLink}
              className="btn-botanical-outline py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-[#105666]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Share Link'}</span>
            </button>

              <button
              onClick={() => openPortfolioModal(currentUser)}
              className="btn-botanical-primary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Export to LinkedIn</span>
            </button>

            <button
              onClick={onOpenSocialBadge}
              className="btn-botanical-outline py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 border-[#0A3323]/20"
            >
              <Linkedin className="w-4 h-4 text-[#0077B5]" />
              <Github className="w-4 h-4 text-[#0A3323]" />
              <span>Share Credits &amp; Karma</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Column Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="botanical-card p-4 text-center">
          <div className="text-2xl font-bold text-[#0A3323]">{currentUser.hoursTaught} hrs</div>
          <div className="text-xs text-[#839958] font-medium mt-0.5">Peer Tutoring Taught</div>
        </div>

        <div className="botanical-card p-4 text-center">
          <div className="text-2xl font-bold text-[#D3968C] flex items-center justify-center gap-1">
            <Star className="w-5 h-5 fill-[#D3968C]" />
            {currentUser.rating}
          </div>
          <div className="text-xs text-[#839958] font-medium mt-0.5">{currentUser.reviewCount} Reviews</div>
        </div>

        <div className="botanical-card p-4 text-center">
          <div className="text-2xl font-bold text-[#105666]">{currentUser.karma} pts</div>
          <div className="text-xs text-[#839958] font-medium mt-0.5">Campus Karma Score</div>
        </div>

        <div className="botanical-card p-4 text-center">
          <div className="text-2xl font-bold text-[#0A3323] flex items-center justify-center gap-1">
            <Coins className="w-5 h-5 text-[#839958]" />
            {currentUser.credits} Cr
          </div>
        </div>
      </div>

      {/* Senior Contributor & PYQ Impact Banner */}
      <div className="botanical-card p-5 bg-white border border-[#839958]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#0A3323] text-[#F7F4D5] flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen className="w-5 h-5 text-[#FAF8ED]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-rose px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase">
                Senior Academic Contributor
              </span>
              <span className="badge-teal px-2 py-0.5 text-[10px] font-bold rounded-full">
                8 PYQs Uploaded
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#0A3323] mt-0.5">
              142 Junior Students Helped via PYQ Papers & Cheatsheets
            </h3>
            <p className="text-xs text-[#839958] font-medium">
              Every time a junior unlocks your notes, you earn +1 Simple Credit & +25 Impact Karma!
            </p>
          </div>
        </div>

        <button
          onClick={() => openPortfolioModal(currentUser)}
          className="btn-botanical-primary px-4 py-2 text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm"
        >
          <Share2 className="w-4 h-4 text-[#D3968C]" />
          <span>Add 8 PYQs to LinkedIn</span>
        </button>
      </div>

      {/* Skills Offered & Wanted Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Offered */}
        <div className="botanical-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#839958]/15 pb-3">
            <h3 className="text-sm font-bold text-[#0A3323] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#105666]" />
              <span>Skills Offered (Can Teach)</span>
            </h3>

            <button
              onClick={() => setIsAddSkillModalOpen(true)}
              className="text-xs font-bold text-[#105666] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {currentUser.skillsOffered.map(skill => (
              <div
                key={skill.id}
                className="p-3 rounded-xl bg-[#FAF8ED] border border-[#839958]/20 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#0A3323]">{skill.name}</div>
                  <div className="text-[10px] text-[#839958] font-medium">{skill.category} • {skill.level}</div>
                </div>
                <span className="badge-moss px-2 py-0.5 text-[10px] font-semibold rounded-full">
                  {skill.endorsementCount}★ Endorsed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="botanical-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#839958]/15 pb-3">
            <h3 className="text-sm font-bold text-[#0A3323] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#D3968C]" />
              <span>Skills Wanted (Need Learning)</span>
            </h3>

            <button
              onClick={() => setIsAddSkillModalOpen(true)}
              className="text-xs font-bold text-[#D3968C] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Request</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {currentUser.skillsWanted.map(skill => (
              <div
                key={skill.id}
                className="p-3 rounded-xl bg-[#FAF8ED] border border-[#839958]/20 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#0A3323]">{skill.name}</div>
                  <div className="text-[10px] text-[#839958] font-medium">{skill.category}</div>
                </div>
                <span className="badge-rose px-2 py-0.5 text-[10px] font-semibold rounded-full">
                  Priority: {skill.priority || 'High'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unlocked Badges Shelf */}
      <div className="botanical-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#0A3323] flex items-center gap-2 border-b border-[#839958]/15 pb-3">
          <Award className="w-4 h-4 text-[#105666]" />
          <span>Unlocked Achievements Shelf</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`p-3 rounded-xl text-center border transition-all ${
                badge.unlocked
                  ? 'bg-white border-[#839958]/30 shadow-sm'
                  : 'bg-[#FAF8ED] border-[#839958]/15 opacity-50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#FAF8ED] border border-[#839958]/20 flex items-center justify-center mx-auto mb-2">
                {getBadgeIcon(badge.icon)}
              </div>
              <div className="font-bold text-xs text-[#0A3323] truncate">{badge.title}</div>
              <div className="text-[9px] text-[#839958] mt-0.5 line-clamp-1">{badge.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
