import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  X, 
  Coins, 
  Utensils, 
  Coffee, 
  Gift, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  ExternalLink, 
  QrCode 
} from 'lucide-react';

export default function CampusPerksModal({ isOpen, onClose }) {
  const { currentUser, setUsers, addToast } = useApp();
  const [perks, setPerks] = useState([]);
  const [redeemedVoucher, setRedeemedVoucher] = useState(null);

  useEffect(() => {
    if (isOpen) {
      api.getPerks()
        .then(res => {
          if (res?.data) setPerks(res.data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRedeem = async (perk) => {
    if (currentUser.credits < perk.creditCost) {
      addToast(
        'Insufficient Credits', 
        `You need ${perk.creditCost} credits for this perk (You have ${currentUser.credits} Cr). Teach more sessions to earn credits!`, 
        'error'
      );
      return;
    }

    try {
      const res = await api.redeemPerk(perk.id, currentUser.id);
      
      // Update local wallet
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, credits: u.credits - perk.creditCost } : u));
      
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });

      setRedeemedVoucher({
        title: perk.title,
        vendor: perk.vendor,
        code: res.data?.voucherCode || `SWAP-FOOD-${Math.floor(100000 + Math.random() * 900000)}`,
        cost: perk.creditCost
      });

      addToast('Perk Redeemed! ☕🍔', `Claimed ${perk.title}! Show your digital voucher at the register.`, 'success');
    } catch (err) {
      addToast('Redemption Error', err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-white p-6 sm:p-8 my-8 text-slate-900 shadow-2xl rounded-3xl space-y-4 border border-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" />
                Food & Dining Marketplace
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              Redeem Credits for Campus Food & Perks
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-lg leading-relaxed">
              University dining halls and student cafés partner with PeerUp to reward active peer mentors with meals and coffee!
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-right shrink-0 shadow-xs">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase">YOUR BALANCE</div>
            <div className="text-base font-extrabold text-slate-900 flex items-center gap-1">
              <Coins className="w-4 h-4 text-emerald-600" />
              {currentUser.credits} Cr
            </div>
          </div>
        </div>

        {/* Voucher Success Banner */}
        {redeemedVoucher && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-slate-900 shadow-xs">
            <Sparkles className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <h4 className="text-xs font-extrabold uppercase text-emerald-800">Active Voucher Generated</h4>
            <p className="text-xs text-slate-700 mt-0.5 font-medium">{redeemedVoucher.title} ({redeemedVoucher.vendor})</p>
            <div className="mt-2 inline-block px-4 py-1.5 bg-white border border-emerald-300 rounded-xl font-extrabold text-sm text-slate-900 shadow-xs">
              {redeemedVoucher.code}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Show this code at campus checkout for instant credit redemption.</p>
          </div>
        )}

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {perks.map(perk => {
            const canAfford = currentUser.credits >= perk.creditCost;

            return (
              <div
                key={perk.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xs text-slate-900"
              >
                <div>
                  <div className="relative h-32 border border-slate-200 rounded-xl overflow-hidden mb-3">
                    <img src={perk.image} alt={perk.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-slate-900/90 text-white px-2 py-0.5 text-[10px] font-extrabold rounded-full border border-slate-700">
                      {perk.creditCost} Credits
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase">{perk.vendor}</span>
                  <h4 className="font-extrabold text-sm text-slate-900 mt-0.5 mb-1">{perk.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">{perk.description}</p>
                </div>

                <button
                  onClick={() => handleRedeem(perk)}
                  disabled={!canAfford}
                  className={`w-full py-2.5 text-xs font-extrabold flex items-center justify-center gap-1.5 rounded-xl transition-all shadow-xs ${
                    canAfford
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>{canAfford ? `Redeem for ${perk.creditCost} Credits` : `Needs ${perk.creditCost} Credits`}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            University Dining Partner Verified
          </span>
          <button onClick={onClose} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 py-1.5 text-xs rounded-xl transition-colors">
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
