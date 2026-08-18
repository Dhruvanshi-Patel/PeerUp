import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
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
  ShieldCheck,
  Gift,
  Users,
  UserCheck
} from 'lucide-react';

export default function ShareEarnModal({ isOpen, onClose }) {
  const { currentUser, recordWebsiteShare, addToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [referralsList, setReferralsList] = useState([]);
  const [loadingReferrals, setLoadingReferrals] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser?.id) {
      setLoadingReferrals(true);
      api.getReferrals(currentUser.id)
        .then(res => {
          if (res?.data) setReferralsList(res.data);
          setLoadingReferrals(false);
        })
        .catch(() => setLoadingReferrals(false));
    }
  }, [isOpen, currentUser?.id]);

  if (!isOpen || !currentUser) return null;

  const shareUrl = `https://omnikon.vercel.app/?ref=${currentUser.id}`;
  const shareText = `Teach what you know. Earn credits. Learn anything from campus peers — for free. Join me on PeerUp: ${shareUrl}`;

  const handleShareClick = async (platformName, externalUrl) => {
    await recordWebsiteShare();

    addToast(
      'Referral Link Ready 🚀',
      `Shared to ${platformName}! You will earn +2 Simple Credits & +50 Karma XP when a student registers using your link.`,
      'info'
    );

    if (externalUrl) {
      window.open(externalUrl, '_blank');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      await recordWebsiteShare();

      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.6 }
      });

      addToast('Referral Link Copied! 📋', 'Link copied to clipboard! You will earn +2 Simple Credits when a peer registers using this link.', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      addToast('Copy Failed', err.message, 'error');
    }
  };

  const totalReferralCredits = referralsList.length * 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-lg bg-white p-6 sm:p-8 text-slate-900 shadow-2xl rounded-3xl space-y-5 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Gift className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                Student Referral Engine
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">Share Website & Earn Credits</h2>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reward Policy Banner */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-extrabold text-emerald-400">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>Earn +2 Credits & +50 Karma XP Per Referral</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full">
              Registration Triggered
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
            Share your unique link with friends. Credits are deposited into your wallet <strong className="text-emerald-400">if and only if</strong> the person who receives your code registers a student account.
          </p>
        </div>

        {/* Share Link Box */}
        <div className="space-y-1.5 text-xs">
          <label className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider">
            Your Personal Referral Link:
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent px-3 text-xs font-mono text-slate-900 focus:outline-none select-all font-semibold"
            />
            <button
              onClick={handleCopyLink}
              className="bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 text-xs font-extrabold shrink-0 flex items-center gap-1.5 rounded-xl shadow-xs transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="space-y-2">
          <label className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider">
            1-Click Social Share:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => handleShareClick('WhatsApp', `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`)}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-slate-900 font-bold"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => handleShareClick('Twitter', `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`)}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-slate-900 font-bold"
            >
              <Twitter className="w-5 h-5 text-[#1DA1F2]" />
              <span>Twitter / X</span>
            </button>

            <button
              onClick={() => handleShareClick('LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-slate-900 font-bold"
            >
              <Linkedin className="w-5 h-5 text-[#0077B5]" />
              <span>LinkedIn</span>
            </button>

            <button
              onClick={() => handleShareClick('Email', `mailto:?subject=Join%20PeerUp%20Peer%20Tutoring&body=${encodeURIComponent(shareText)}`)}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-slate-900 font-bold"
            >
              <Mail className="w-5 h-5 text-indigo-500" />
              <span>Email</span>
            </button>
          </div>
        </div>

        {/* Live Referral Stats & Joined Friends */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              Referral Performance Tracking
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
              +{totalReferralCredits} Cr Total Earned
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white p-2.5 border border-slate-200 rounded-xl">
              <div className="text-lg font-extrabold text-slate-900">{referralsList.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Peers Registered</div>
            </div>
            <div className="bg-white p-2.5 border border-slate-200 rounded-xl">
              <div className="text-lg font-extrabold text-emerald-600">+{totalReferralCredits} Cr</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Simple Credits Earned</div>
            </div>
          </div>

          {referralsList.length > 0 && (
            <div className="pt-2 border-t border-slate-200 space-y-1.5">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase">Recently Joined via Your Link:</div>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {referralsList.map(ref => (
                  <div key={ref.id || ref.created_at} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-extrabold text-slate-800">{ref.referred_user_name || 'Campus Student'}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      +2 Cr Granted
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1 font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Persisted directly to your database profile</span>
          </div>

          <button onClick={onClose} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 py-1.5 text-xs rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

