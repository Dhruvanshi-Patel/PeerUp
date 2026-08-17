import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X, Linkedin, Github, Copy, Check, ExternalLink,
  Award, Star, Coins, Flame, Trophy, ShieldCheck,
  Download, Sparkles, ArrowRight, Share2
} from 'lucide-react';

/* ── generates a shields.io badge URL ── */
function shieldsUrl(label, message, color) {
  return `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color}?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBkPSJNNyAxNmwtNC00IDQtNE0xNyA4bDQgNC00IDRNMTQgNGwtNCAxNiIvPjwvc3ZnPg==`;
}

export default function SocialBadgeModal({ isOpen, onClose }) {
  const { currentUser, level, xp, nextLevelXp } = useApp();

  const [copied, setCopied] = useState({});

  if (!isOpen || !currentUser) return null;

  const credits = currentUser.credits ?? 0;
  const karma = currentUser.karma ?? 0;
  const hoursTaught = currentUser.hoursTaught ?? 0;
  const rating = currentUser.rating ?? 5.0;
  const badgeLevel = currentUser.badgeLevel ?? 'Peer Learner';
  const handle = currentUser.id?.replace('usr_', '') ?? 'student';
  const profileUrl = `https://omnikon.vercel.app/?ref=${currentUser.id}`;

  /* ── copy helpers ── */
  const copyText = (key, text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2500);
  };

  /* ── LinkedIn share ── */
  const linkedInPost = `🎓 Just hit Level ${level} on SkillSwap — the peer-to-peer skill exchange platform for campus students!

📊 My stats:
• ${credits} Teaching Credits earned
• ${karma} Karma XP
• ${hoursTaught} hours of peer tutoring completed
• ${rating}/5.0 student satisfaction rating
• Badge: ${badgeLevel}

On SkillSwap, every hour I teach earns a credit I can spend learning something new — zero tuition, 100% peer-powered.

Check it out: ${profileUrl}

#SkillSwap #PeerLearning #StudentLife #EdTech #CampusLife`;

  const linkedInCertUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(`SkillSwap ${badgeLevel} — ${credits} Credits Earned`)}&organizationName=${encodeURIComponent('SkillSwap Peer Learning Network')}&issueYear=2025&issueMonth=8&certId=${encodeURIComponent(`SKILLSWAP-${currentUser.id.toUpperCase()}-L${level}`)}&certUrl=${encodeURIComponent(profileUrl)}`;

  const linkedInPostUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(linkedInPost)}`;

  /* ── GitHub README markdown ── */
  const creditBadgeUrl = shieldsUrl('SkillSwap Credits', `${credits} Credits`, '0A3323');
  const karmaBadgeUrl = shieldsUrl('SkillSwap Karma', `${karma} XP`, '839958');
  const levelBadgeUrl = shieldsUrl('SkillSwap Level', `Level ${level}`, '105666');

  const githubMarkdown = `<!-- SkillSwap Badges -->
[![SkillSwap Level](${levelBadgeUrl})](${profileUrl})
[![SkillSwap Credits](${creditBadgeUrl})](${profileUrl})
[![SkillSwap Karma](${karmaBadgeUrl})](${profileUrl})`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#839958]/20 my-8 overflow-hidden">

        {/* ── header ── */}
        <div className="bg-[#0A3323] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-5 h-5 text-[#0077B5]" />
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-black text-base">Share Your Progress</div>
              <div className="text-[#839958] text-[11px] font-medium">Credits & Karma on LinkedIn and GitHub</div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* ── Achievement card preview ── */}
          <div className="bg-[#0A3323] rounded-2xl p-5 text-[#F7F4D5]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] text-[#839958] uppercase tracking-widest font-bold mb-0.5">SkillSwap Achievement</div>
                <div className="font-black text-lg">{currentUser.name}</div>
                <div className="text-[11px] text-[#F7F4D5]/50">{currentUser.school} · {currentUser.major}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black">L{level}</div>
                <div className="text-[10px] text-[#839958] uppercase tracking-wider">Level</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 pt-3 border-t border-white/10">
              {[
                { icon: Coins, label: 'Credits', value: credits, color: '#D3968C' },
                { icon: Flame, label: 'Karma XP', value: karma, color: '#839958' },
                { icon: Star, label: 'Rating', value: `${rating}★`, color: '#D3968C' },
                { icon: Trophy, label: 'Hrs Taught', value: hoursTaught, color: '#839958' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="text-center">
                  <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                  <div className="text-base font-black">{value}</div>
                  <div className="text-[9px] text-[#F7F4D5]/40 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 text-center">
              <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-[#F7F4D5]/70 font-semibold">
                🏅 {badgeLevel}
              </span>
            </div>
          </div>

          {/* ── LinkedIn section ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-[#839958]/15">
              <Linkedin className="w-4.5 h-4.5 text-[#0077B5]" />
              <span className="text-sm font-black text-[#0A3323]">LinkedIn</span>
            </div>

            {/* Post */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#0A3323]">📣 Share as a LinkedIn Post</div>
              <div className="bg-[#FAF8ED] border border-[#839958]/20 rounded-xl p-3 text-[11px] text-[#0A3323]/70 leading-relaxed max-h-28 overflow-y-auto font-mono whitespace-pre-wrap">
                {linkedInPost}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyText('liPost', linkedInPost)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-[#839958]/25 text-[#0A3323] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#FAF8ED] transition-colors"
                >
                  {copied.liPost ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied.liPost ? 'Copied!' : 'Copy Post'}
                </button>
                <a
                  href={linkedInPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#0077B5] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#005885] transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  Open LinkedIn
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Certification */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#0A3323]">🏆 Add as LinkedIn Certification</div>
              <div className="bg-[#FAF8ED] border border-[#839958]/20 rounded-xl p-3 text-[11px] text-[#0A3323]/70 space-y-1">
                <div><span className="font-bold text-[#0A3323]">Name:</span> SkillSwap {badgeLevel} — {credits} Credits Earned</div>
                <div><span className="font-bold text-[#0A3323]">Org:</span> SkillSwap Peer Learning Network</div>
                <div><span className="font-bold text-[#0A3323]">Issue:</span> August 2025 · Does Not Expire</div>
              </div>
              <a
                href={linkedInCertUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 bg-[#0077B5] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#005885] transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                Add Certification to LinkedIn Profile
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* ── GitHub section ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-[#839958]/15">
              <Github className="w-4.5 h-4.5 text-[#0A3323]" />
              <span className="text-sm font-black text-[#0A3323]">GitHub README Badges</span>
            </div>

            {/* Badge previews */}
            <div className="flex flex-wrap gap-2">
              {[
                { url: levelBadgeUrl, alt: 'Level badge' },
                { url: creditBadgeUrl, alt: 'Credits badge' },
                { url: karmaBadgeUrl, alt: 'Karma badge' },
              ].map(({ url, alt }) => (
                <img key={alt} src={url} alt={alt} className="h-7 rounded" />
              ))}
            </div>

            {/* Markdown code */}
            <div className="bg-[#0A3323] rounded-xl p-3 overflow-x-auto">
              <pre className="text-[10px] text-[#839958] font-mono whitespace-pre leading-relaxed">
                {githubMarkdown}
              </pre>
            </div>

            <button
              onClick={() => copyText('ghBadge', githubMarkdown)}
              className="w-full flex items-center justify-center gap-1.5 bg-[#0A3323] text-[#F7F4D5] text-xs font-bold py-2.5 rounded-xl hover:bg-[#105666] transition-colors"
            >
              {copied.ghBadge ? <Check className="w-3.5 h-3.5 text-[#839958]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied.ghBadge ? 'Copied to clipboard!' : 'Copy Markdown for README'}
            </button>
          </div>

          {/* ── tip ── */}
          <div className="bg-[#839958]/10 border border-[#839958]/20 rounded-xl px-4 py-3 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#839958] mt-0.5 shrink-0" />
            <p className="text-[11px] text-[#0A3323]/70 leading-relaxed">
              <span className="font-bold text-[#0A3323]">Tip:</span> Teach more sessions to level up your badge and earn more credits. Higher levels unlock a verified "Senior Tutor" credential that stands out on LinkedIn.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
