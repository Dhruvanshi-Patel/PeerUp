import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Star, 
  Sparkles, 
  Coins, 
  Flame, 
  ShieldCheck, 
  Check,
  Leaf
} from 'lucide-react';

export default function ReviewModal() {
  const { isReviewModalOpen, setIsReviewModalOpen, reviewSessionTarget, submitReview } = useApp();

  if (!isReviewModalOpen || !reviewSessionTarget) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Super Clear Explanation', 'Very Patient']);

  const availableTags = [
    'Super Clear Explanation',
    'Very Patient',
    'Great Code Walkthrough',
    'Actionable Feedback',
    'Well Prepared',
    'Friendly & Encouraging',
    'Effective Problem Sets'
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitReview(rating, selectedTags, comment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-lg bg-white p-6 sm:p-8 my-8 text-slate-900 shadow-2xl rounded-3xl space-y-4 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                Session Completed
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
                Rate Swap with {reviewSessionTarget.peerName}
              </h2>
            </div>
          </div>

          <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star Rating selector */}
          <div className="flex flex-col items-center justify-center py-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="font-extrabold text-xs text-slate-900">
              {rating === 5 ? 'Exceptional Mentor! (5.0)' : `${rating}.0 Stars`}
            </span>
          </div>

          {/* Endorsement Tags */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900">
              Select Endorsement Badges:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written Feedback */}
          <div className="space-y-1">
            <label className="font-bold text-slate-900">
              Written Review (Public Portfolio):
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What made this peer session great? (Helps your peer build their tutoring track record)"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-slate-800 resize-none"
            />
          </div>

          {/* Reward Summary pill */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-extrabold text-slate-900">
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>+1 Credit Released</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>+50 Karma Awarded</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 text-xs font-extrabold flex items-center justify-center gap-2 rounded-xl shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Submit Review & Claim Rewards</span>
          </button>
        </form>
      </div>
    </div>
  );
}
