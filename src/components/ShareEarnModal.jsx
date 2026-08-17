import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Coins, 
  Flame, 
  Sparkles, 
  MessageCircle, 
  Twitter, 
  Linkedin, 
  Mail, 
  Send,
  ShieldCheck,
  Gift
} from 'lucide-react';

export default function ShareEarnModal({ isOpen, onClose }) {
  const { currentUser, recordWebsiteShare, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `https://omnikon.vercel.app/?ref=${currentUser.id}`;
  const shareText = `Teach what you know. Earn credits. Learn anything from campus peers \u2014 for free. Join me on SkillSwap: ${shareUrl}`;

  const handleShareClick = async (platformName, externalUrl) => {
    // Award credits & karma in DB & state
    await recordWebsiteShare();

    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 }
    });

    addToast(
      'Referral Credits Earned! 🎁',
      `Shared on ${platformName}! Earned +2 Escrow Credits & +50 Karma XP.`,
      'success'
    );

    if (externalUrl) {
      window.open(externalUrl, '_blank');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      // Award credits & karma
      await recordWebsiteShare();

      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.6 }
      });

      addToast('Referral Link Copied! 📋', 'Link copied to clipboard! Earned +2 Escrow Credits & +50 Karma XP.', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      addToast('Copy Failed', err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg botanical-card bg-white p-6 sm:p-8 text-[#0A3323] shadow-xl rounded-3xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#839958]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0A3323] text-[#F7F4D5] flex items-center justify-center shrink-0 shadow-sm">
              <Gift className="w-5 h-5 text-[#FAF8ED]" />
            </div>
            <div>
              <span className="badge-rose px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Referral Program
              </span>
              <h2 className="text-lg font-bold text-[#0A3323]">Share Website & Earn Credits</h2>
            </div>
          </div>

          <button onClick={onClose} className="text-[#839958] hover:text-[#0A3323]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reward Banner */}
        <div className="botanical-card-cream p-4 border border-[#839958]/25 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-[#0A3323]">
            <Coins className="w-5 h-5 text-[#D3968C]" />
            <span>Earn +2 Credits & +50 Karma Per Share</span>
          </div>
          <span className="badge-teal px-2.5 py-1 text-[10px] font-bold rounded-full">
            Instant Wallet Bonus
          </span>
        </div>

        {/* Share Link Box */}
        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-[#0A3323] uppercase text-[10px] tracking-wider">
            Your Unique Referral Link:
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-[#FAF8ED] border border-[#839958]/30 rounded-2xl">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent px-3 text-xs font-mono text-[#0A3323] focus:outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className="btn-botanical-primary py-2 px-4 text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="space-y-2">
          <label className="font-bold text-[#0A3323] uppercase text-[10px] tracking-wider">
            Share Directly to Social Platforms:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => handleShareClick('WhatsApp', `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`)}
              className="p-3 bg-[#FAF8ED] hover:bg-white border border-[#839958]/20 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-[#0A3323] font-semibold"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => handleShareClick('Twitter', `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`)}
              className="p-3 bg-[#FAF8ED] hover:bg-white border border-[#839958]/20 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-[#0A3323] font-semibold"
            >
              <Twitter className="w-5 h-5 text-[#1DA1F2]" />
              <span>Twitter / X</span>
            </button>

            <button
              onClick={() => handleShareClick('LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)}
              className="p-3 bg-[#FAF8ED] hover:bg-white border border-[#839958]/20 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-[#0A3323] font-semibold"
            >
              <Linkedin className="w-5 h-5 text-[#0077B5]" />
              <span>LinkedIn</span>
            </button>

            <button
              onClick={() => handleShareClick('Email', `mailto:?subject=Join%20SkillSwap%20Peer%20Tutoring&body=${encodeURIComponent(shareText)}`)}
              className="p-3 bg-[#FAF8ED] hover:bg-white border border-[#839958]/20 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-[#0A3323] font-semibold"
            >
              <Mail className="w-5 h-5 text-[#D3968C]" />
              <span>Email</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#839958]/20 text-xs">
          <div className="text-[#839958] flex items-center gap-1 font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#105666]" />
            <span>Persisted directly to your database profile</span>
          </div>

          <button onClick={onClose} className="btn-botanical-outline px-4 py-1.5 text-xs font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
