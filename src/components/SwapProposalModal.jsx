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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl botanical-card bg-white p-6 sm:p-8 my-8 text-[#0A3323] shadow-xl rounded-3xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#839958]/20 pb-3">
          <div className="flex items-center gap-3">
            <img
              src={targetUserForSwap.avatar}
              alt={targetUserForSwap.name}
              className="w-10 h-10 rounded-xl object-cover border border-[#839958]/30"
            />
            <div>
              <span className="text-[10px] font-bold text-[#105666] uppercase tracking-wider">
                Send Swap Proposal
              </span>
              <h2 className="text-base font-bold text-[#0A3323]">
                Connect with {targetUserForSwap.name}
              </h2>
            </div>
          </div>

          <button onClick={() => setIsSwapModalOpen(false)} className="text-[#839958] hover:text-[#0A3323]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Step 1: Exchange Type */}
          <div className="space-y-2">
            <label className="font-bold text-[#0A3323] uppercase text-[10px]">
              1. Choose Exchange Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSwapType('Direct Swap')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  swapType === 'Direct Swap'
                    ? 'bg-[#FAF8ED] border-[#105666] text-[#0A3323] shadow-sm font-semibold'
                    : 'bg-white border-[#839958]/25 text-[#0A3323]/70 hover:bg-[#FAF8ED]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-[#105666]" />
                    Direct 1:1 Swap
                  </div>
                  {swapType === 'Direct Swap' && <Check className="w-4 h-4 text-[#105666]" />}
                </div>
                <p className="text-[11px] text-[#839958]">
                  Reciprocal trade: teach a skill, learn in return.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSwapType('Credit Exchange')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  swapType === 'Credit Exchange'
                    ? 'bg-[#FAF8ED] border-[#105666] text-[#0A3323] shadow-sm font-semibold'
                    : 'bg-white border-[#839958]/25 text-[#0A3323]/70 hover:bg-[#FAF8ED]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Coins className="w-3.5 h-3.5 text-[#D3968C]" />
                    Credit Exchange
                  </div>
                  {swapType === 'Credit Exchange' && <Check className="w-4 h-4 text-[#105666]" />}
                </div>
                <p className="text-[11px] text-[#839958]">
                  Spend 1 Simple Credit (Balance: {currentUser.credits} Cr).
                </p>
              </button>
            </div>
          </div>

          {/* Step 2: Skill Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#0A3323]">Skill You Want to Learn:</label>
              <select
                value={requestedSkill}
                onChange={(e) => setRequestedSkill(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8ED] border border-[#839958]/30 rounded-xl text-[#0A3323] text-xs focus:outline-none focus:border-[#105666]"
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
                <label className="font-bold text-[#0A3323]">Skill You Will Teach:</label>
                <select
                  value={offeredSkill}
                  onChange={(e) => setOfferedSkill(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8ED] border border-[#839958]/30 rounded-xl text-[#0A3323] text-xs focus:outline-none focus:border-[#105666]"
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
                <label className="font-bold text-[#0A3323]">Simple Credit Payment:</label>
                <div className="w-full px-3 py-2 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] font-semibold text-xs flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#D3968C]" />
                  <span>1 Credit held in simple credit wallet</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Format & Time Slot Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#0A3323] uppercase text-[10px]">
                2. Format & Time Slot
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('Virtual Call')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    format === 'Virtual Call'
                      ? 'bg-[#105666] text-white'
                      : 'bg-[#FAF8ED] text-[#0A3323]'
                  }`}
                >
                  Virtual Room
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('On-Campus Meetup')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    format === 'On-Campus Meetup'
                      ? 'bg-[#105666] text-white'
                      : 'bg-[#FAF8ED] text-[#0A3323]'
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
                  className={`p-2 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                    selectedSlot === slot
                      ? 'bg-[#105666] text-[#F7F4D5] font-semibold border-[#105666]'
                      : 'bg-[#FAF8ED] border-[#839958]/20 text-[#0A3323]/80 hover:bg-white'
                  }`}
                >
                  <span className="truncate">{slot}</span>
                  {selectedSlot === slot && <Check className="w-3.5 h-3.5 text-[#FAF8ED] shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Message */}
          <div className="space-y-1">
            <label className="font-bold text-[#0A3323]">Message to Peer:</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-[#FAF8ED] border border-[#839958]/30 rounded-xl text-[#0A3323] text-xs focus:outline-none focus:border-[#105666] resize-none"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#839958]/15">
            <button
              type="button"
              onClick={() => setIsSwapModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#839958] hover:text-[#0A3323]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={swapType === 'Credit Exchange' && !hasCredits}
              className="btn-botanical-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#D3968C]" />
              <span>Send Swap Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
