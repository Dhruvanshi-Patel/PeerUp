import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ArrowLeftRight, 
  Coins, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function SwapProposalModal() {
  const { 
    isSwapModalOpen, 
    setIsSwapModalOpen, 
    targetUserForSwap, 
    currentUser, 
    sendSwapProposal 
  } = useApp();

  // Form State
  const [swapType, setSwapType] = useState('Direct Swap'); // 'Direct Swap' | 'Credit Exchange'
  const [requestedSkill, setRequestedSkill] = useState('');
  const [offeredSkill, setOfferedSkill] = useState('');
  const [format, setFormat] = useState('Virtual Call');
  const [selectedSlot, setSelectedSlot] = useState('Thursday, Aug 20 • 4:00 PM EST');
  const [customSlot, setCustomSlot] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (targetUserForSwap) {
      const initialReqSkill = targetUserForSwap.skillsOffered[0]?.name || '';
      const initialOffSkill = currentUser?.skillsOffered[0]?.name || '';
      setRequestedSkill(initialReqSkill);
      setOfferedSkill(initialOffSkill);
      setMessage(
        `Hey ${targetUserForSwap.name.split(' ')[0]}! I'd love to set up a swap session for ${initialReqSkill}. Let me know if this time works!`
      );
    }
  }, [targetUserForSwap, currentUser]);

  if (!isSwapModalOpen || !targetUserForSwap) return null;

  const availableSlots = [
    'Thursday, Aug 20 • 4:00 PM EST',
    'Friday, Aug 21 • 6:30 PM EST',
    'Saturday, Aug 22 • 11:00 AM EST',
    'Sunday, Aug 23 • 3:00 PM EST'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const proposalData = {
      receiverId: targetUserForSwap.id,
      receiverName: targetUserForSwap.name,
      type: swapType,
      requestedSkill,
      offeredSkill: swapType === 'Direct Swap' ? offeredSkill : null,
      format,
      proposedSlot: customSlot.trim() || selectedSlot,
      message
    };

    sendSwapProposal(proposalData);
  };

  const hasCredits = currentUser.credits >= 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl bg-white p-6 sm:p-8 my-8 text-slate-900 shadow-2xl rounded-3xl space-y-4 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <img
              src={targetUserForSwap.avatar}
              alt={targetUserForSwap.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                Send Swap Proposal
              </span>
              <h2 className="text-base font-extrabold text-slate-900">
                Connect with {targetUserForSwap.name}
              </h2>
            </div>
          </div>

          <button onClick={() => setIsSwapModalOpen(false)} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Step 1: Exchange Type */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-900 uppercase text-[10px]">
              1. Choose Exchange Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSwapType('Direct Swap')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  swapType === 'Direct Swap'
                    ? 'bg-emerald-50/50 border-emerald-500 text-slate-900 shadow-sm font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-900">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600" />
                    Direct 1:1 Swap
                  </div>
                  {swapType === 'Direct Swap' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  Reciprocal trade: teach a skill, learn in return.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSwapType('Credit Exchange')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  swapType === 'Credit Exchange'
                    ? 'bg-emerald-50/50 border-emerald-500 text-slate-900 shadow-sm font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-900">
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    Credit Exchange
                  </div>
                  {swapType === 'Credit Exchange' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  Spend 1 Simple Credit (Balance: {currentUser.credits} Cr).
                </p>
              </button>
            </div>
          </div>

          {/* Step 2: Skill Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-900">Skill You Want to Learn:</label>
              <select
                value={requestedSkill}
                onChange={(e) => setRequestedSkill(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-slate-800"
              >
                {targetUserForSwap.skillsOffered.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.level})
                  </option>
                ))}
              </select>
            </div>

            {swapType === 'Direct Swap' ? (
              <div className="space-y-1">
                <label className="font-bold text-slate-900">Skill You Will Teach:</label>
                <select
                  value={offeredSkill}
                  onChange={(e) => setOfferedSkill(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-slate-800"
                >
                  {currentUser.skillsOffered.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.level})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="font-bold text-slate-900">Simple Credit Payment:</label>
                <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-xs flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>1 Credit held in simple credit wallet</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Format & Time Slot Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-900 uppercase text-[10px]">
                2. Format & Time Slot
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('Virtual Call')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    format === 'Virtual Call'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Virtual Room
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('On-Campus Meetup')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    format === 'On-Campus Meetup'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  On-Campus QR
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selectedSlot === slot
                      ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <span className="truncate">{slot}</span>
                  {selectedSlot === slot && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Message */}
          <div className="space-y-1">
            <label className="font-bold text-slate-900">Message to Peer:</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-slate-800 resize-none"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSwapModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={swapType === 'Credit Exchange' && !hasCredits}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Send Swap Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
