import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CAMPUSES } from '../data/mockData';
import { 
  Search, 
  Sparkles, 
  Star, 
  ArrowLeftRight, 
  Coins, 
  Clock, 
  BookOpen, 
  Check, 
  Zap, 
  Code,
  GraduationCap,
  Languages,
  Palette,
  Dumbbell,
  Leaf,
  Heart,
  ShieldCheck,
  Award,
  X
} from 'lucide-react';

export default function ExploreSkills() {
  const { 
    users, 
    currentUser, 
    openSwapModalForUser, 
    openPortfolioModal,
    partnerStreaks
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCampus, setSelectedCampus] = useState('All Campuses');
  const [selectedFormat, setSelectedFormat] = useState('all');

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Code': return <Code className="w-3.5 h-3.5" />;
      case 'GraduationCap': return <GraduationCap className="w-3.5 h-3.5" />;
      case 'Languages': return <Languages className="w-3.5 h-3.5" />;
      case 'Palette': return <Palette className="w-3.5 h-3.5" />;
      case 'BookOpen': return <BookOpen className="w-3.5 h-3.5" />;
      case 'Dumbbell': return <Dumbbell className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const filteredPeers = useMemo(() => {
    return users.filter(peer => {
      if (peer.id === currentUser.id) return false;

      // Category filter (using exact category id e.g. "Coding & Tech")
      if (selectedCategory !== 'all') {
        const matchesOffered = (peer.skillsOffered || []).some(s => 
          s.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
        const matchesWanted = (peer.skillsWanted || []).some(s => 
          s.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (!matchesOffered && !matchesWanted) return false;
      }

      // Campus filter
      if (selectedCampus !== 'All Campuses' && peer.school !== selectedCampus) return false;

      // Format filter
      if (selectedFormat !== 'all') {
        if (!peer.formatPreference?.includes(selectedFormat) && peer.preferredFormat !== 'Both' && peer.preferredFormat !== selectedFormat) return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const nameMatch = peer.name ? peer.name.toLowerCase().includes(q) : false;
        const majorMatch = peer.major ? peer.major.toLowerCase().includes(q) : false;
        const schoolMatch = peer.school ? peer.school.toLowerCase().includes(q) : false;
        const roleMatch = peer.role ? peer.role.toLowerCase().includes(q) : false;
        const bioMatch = peer.bio ? peer.bio.toLowerCase().includes(q) : false;
        
        const offeredMatch = (peer.skillsOffered || []).some(s => 
          (s.name && s.name.toLowerCase().includes(q)) || (s.category && s.category.toLowerCase().includes(q))
        );
        const wantedMatch = (peer.skillsWanted || []).some(s => 
          (s.name && s.name.toLowerCase().includes(q)) || (s.category && s.category.toLowerCase().includes(q))
        );

        if (!nameMatch && !majorMatch && !schoolMatch && !roleMatch && !bioMatch && !offeredMatch && !wantedMatch) {
          return false;
        }
      }

      return true;
    });
  }, [users, currentUser, selectedCategory, selectedCampus, selectedFormat, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCampus('All Campuses');
    setSelectedFormat('all');
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-6 border border-slate-200/80 rounded-2xl space-y-4 shadow-sm text-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skill (Python, Spanish, Calculus), mentor name, or major..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-800 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Campus Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:bg-white transition-all font-medium"
            >
              {CAMPUSES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Format Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:bg-white transition-all font-medium"
            >
              <option value="all">All Formats (Virtual & On-Campus)</option>
              <option value="Virtual Call">Virtual Call Only</option>
              <option value="On-Campus Meetup">On-Campus Meetup Only</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            Verified Student Mentors
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs rounded-full font-bold">
              {filteredPeers.length} Available
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Connect 1-on-1 to trade skills using simple credits or reciprocal tutoring
          </p>
        </div>

        {(searchQuery || selectedCategory !== 'all' || selectedCampus !== 'All Campuses' || selectedFormat !== 'all') && (
          <button 
            onClick={handleResetFilters}
            className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>

      {/* Mentors Grid */}
      {filteredPeers.length === 0 ? (
        <div className="bg-white p-12 text-center border border-slate-200/80 rounded-3xl space-y-3 shadow-sm">
          <Sparkles className="w-10 h-10 text-slate-400 mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-slate-900">No Student Mentors Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query "{searchQuery}" or category filter to discover more peers on campus.
          </p>
          <button 
            onClick={handleResetFilters}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all mt-2"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeers.map(peer => (
            <div
              key={peer.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all text-slate-900"
            >
              <div className="space-y-3.5">
                {/* Peer Header Profile */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{peer.name}</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{peer.major}</p>
                      <p className="text-[11px] text-slate-400">{peer.school}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-extrabold rounded-full">
                      {peer.badgeLevel}
                    </span>
                    {partnerStreaks && partnerStreaks[[currentUser.id, peer.id].sort().join('_')] && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.2 text-[9px] font-bold rounded-full">
                        🔥 {partnerStreaks[[currentUser.id, peer.id].sort().join('_')]} Wk Streak
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating & Tutoring Stats Strip */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {peer.rating}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">{peer.reviewCount} Reviews</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{peer.hoursTaught} hrs</div>
                    <div className="text-[10px] text-slate-500 font-medium">Taught</div>
                  </div>
                  <div>
                    <div className="font-bold text-emerald-700">{peer.karma} pts</div>
                    <div className="text-[10px] text-slate-500 font-medium">Karma</div>
                  </div>
                </div>

                {/* Bio Quote Box */}
                <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-200/60 line-clamp-2">
                  "{peer.bio}"
                </p>

                {/* Skills Offered */}
                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                    Skills Can Teach:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {peer.skillsOffered.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSearchQuery(s.name)}
                        title="Click to search for this skill"
                        className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 text-xs font-semibold rounded-lg flex items-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <span>{s.name}</span>
                        <span className="text-[10px] opacity-75">({s.level})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Skills Wants to Learn:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {peer.skillsWanted.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSearchQuery(s.name)}
                        title="Click to search for this skill"
                        className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2.5 py-0.5 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => openPortfolioModal(peer)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold text-center transition-colors"
                >
                  Portfolio
                </button>

                <button
                  onClick={() => openSwapModalForUser(peer)}
                  className="bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-extrabold text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Propose Swap</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
