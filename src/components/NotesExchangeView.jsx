import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  FileText, 
  Download, 
  ArrowLeftRight, 
  Coins, 
  Star, 
  Sparkles, 
  Plus, 
  Search, 
  ShieldCheck, 
  Check, 
  GraduationCap,
  X,
  Leaf,
  FileCheck2,
  Award,
  Zap,
  Share2
} from 'lucide-react';

export default function NotesExchangeView() {
  const { currentUser, setUsers, addToast, openPortfolioModal } = useApp();
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all'); // 'all' | 'pyq' | 'notes'
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [newType, setNewType] = useState('PYQ Paper'); // 'PYQ Paper' | 'Lecture Notes'
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newCategory, setNewCategory] = useState('Academic & STEM');
  const [newExamYear, setNewExamYear] = useState('2024');
  const [hasSolutions, setHasSolutions] = useState(true);
  const [newPages, setNewPages] = useState(8);
  const [newSummary, setNewSummary] = useState('');

  const loadNotes = () => {
    api.getNotes({ search: searchQuery, category: selectedCategory })
      .then(res => {
        if (res?.data) setNotes(res.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadNotes();
  }, [searchQuery, selectedCategory]);

  const filteredNotes = notes.filter(note => {
    if (resourceTypeFilter === 'pyq' && note.type !== 'PYQ Paper') return false;
    if (resourceTypeFilter === 'notes' && note.type === 'PYQ Paper') return false;
    return true;
  });

  const handleUnlockNote = async (note) => {
    if (currentUser.credits < 1) {
      addToast('Insufficient Credits', 'You need at least 1 credit to unlock this PYQ / study guide. Teach a session or upload your notes to earn credits!', 'error');
      return;
    }

    try {
      const res = await api.unlockNote(note.id, currentUser.id);
      
      // Deduct 1 credit from buyer
      setUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, credits: u.credits - 1 };
        }
        // If author is found in personas, credit senior author +1 Cr and +25 Karma!
        if (u.name === note.authorName || u.id === note.uploaderId) {
          return { ...u, credits: u.credits + 1, karma: u.karma + 25 };
        }
        return u;
      }));

      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.6 }
      });
      
      addToast(
        'PYQ / Guide Unlocked! 📜', 
        `Unlocked "${note.title}". 1 Credit spent. Senior uploader (${note.authorName}) earned +1 Credit & +25 Impact Karma!`, 
        'success'
      );
    } catch (err) {
      addToast('Unlock Failed', err.message, 'error');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCourse.trim()) {
      addToast('Fields Required', 'Please enter title and course code.', 'error');
      return;
    }

    try {
      const res = await api.uploadNote({
        title: newTitle.trim(),
        course: newCourse.trim(),
        category: newCategory,
        type: newType,
        examYear: newType === 'PYQ Paper' ? newExamYear : null,
        pages: parseInt(newPages) || 6,
        summary: newSummary.trim() || `Verified senior ${newType} uploaded for peer review.`,
        uploaderId: currentUser.id,
        authorName: currentUser.name,
        authorSchool: currentUser.school
      });

      // Award uploader welcome contribution bonus: +1 Credit & +50 Impact Karma
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { 
        ...u, 
        credits: u.credits + 1,
        karma: u.karma + 50
      } : u));

      confetti({
        particleCount: 110,
        spread: 70,
        origin: { y: 0.6 }
      });

      addToast(
        'Resource Published! 🎓', 
        `Earned +1 Escrow Credit & +50 Impact Karma for contributing ${newType} to ${newCourse}! Add to LinkedIn!`, 
        'success'
      );
      
      setIsUploadModalOpen(false);
      setNewTitle('');
      setNewCourse('');
      setNewSummary('');
      loadNotes();
    } catch (err) {
      addToast('Upload Error', err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="botanical-card-cream p-6 sm:p-8 border border-[#839958]/25 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="badge-rose px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-[#0A3323]" />
                Senior Notes & PYQ Bank
              </span>
              <span className="badge-teal px-3 py-1 text-xs font-bold rounded-full">
                Earn Credits on Download
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A3323]">Previous Year Questions (PYQs) & Senior Notes</h2>
            <p className="text-xs text-[#0A3323]/80 mt-1 max-w-xl leading-relaxed">
              Senior students share verified past exam PYQs, solved step-by-step papers, and lecture cheatsheets. Earn 1 Escrow Credit & Impact Karma every time a junior unlocks your uploaded study guide!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              onClick={() => openPortfolioModal(currentUser)}
              className="btn-botanical-outline px-3.5 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-[#105666]" />
              <span>Export to LinkedIn</span>
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-botanical-primary px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Upload PYQ / Notes (+1 Credit)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar: Material Type Tabs & Search */}
      <div className="botanical-card p-4 border border-[#839958]/20 bg-white space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Material Type Tabs */}
          <div className="flex items-center gap-1.5 bg-[#FAF8ED] p-1.5 rounded-2xl border border-[#839958]/20 overflow-x-auto">
            <button
              onClick={() => setResourceTypeFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                resourceTypeFilter === 'all'
                  ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                  : 'text-[#0A3323]/80 hover:bg-white'
              }`}
            >
              All Materials
            </button>
            <button
              onClick={() => setResourceTypeFilter('pyq')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                resourceTypeFilter === 'pyq'
                  ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                  : 'text-[#0A3323]/80 hover:bg-white'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-[#D3968C]" />
              <span>📜 Senior PYQs & Exams</span>
            </button>
            <button
              onClick={() => setResourceTypeFilter('notes')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                resourceTypeFilter === 'notes'
                  ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                  : 'text-[#0A3323]/80 hover:bg-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#839958]" />
              <span>📚 Lecture Cheatsheets</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative md:w-72">
            <Search className="w-4 h-4 text-[#839958] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PYQ (CS61A 2024, MATH53)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] text-xs focus:outline-none focus:border-[#105666]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {['all', 'Academic & STEM', 'Coding & Tech', 'Languages', 'Writing & Test Prep'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0A3323] text-[#F7F4D5]'
                  : 'bg-[#FAF8ED] text-[#0A3323]/80 border border-[#839958]/20 hover:bg-white'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className="botanical-card p-5 flex flex-col justify-between space-y-4 hover:border-[#839958]/40"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="badge-moss px-2.5 py-0.5 text-[11px] font-bold rounded-lg">
                    {note.course}
                  </span>
                  {note.type === 'PYQ Paper' ? (
                    <span className="badge-rose px-2.5 py-0.5 text-[10px] font-bold rounded-lg flex items-center gap-1">
                      <FileCheck2 className="w-3 h-3 text-[#0A3323]" />
                      PYQ {note.examYear || '2024'}
                    </span>
                  ) : (
                    <span className="badge-teal px-2 py-0.5 text-[10px] font-bold rounded-lg">
                      Lecture Notes
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-[#D3968C] flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#D3968C]" />
                  {note.rating}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#0A3323] leading-snug">{note.title}</h3>
                <p className="text-xs text-[#839958] font-medium mt-0.5">
                  Shared by <strong className="text-[#0A3323]">{note.authorName}</strong> ({note.authorSchool}) • {note.pages} pages
                </p>
              </div>

              <p className="text-xs text-[#0A3323]/80 leading-relaxed bg-[#FAF8ED] p-3 rounded-xl border border-[#839958]/15 line-clamp-3">
                {note.summary}
              </p>

              <div className="flex items-center justify-between text-[11px] text-[#0A3323]/70 pt-1 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#105666]" />
                  Verified Senior Contributor
                </span>
                <span>{note.downloads} downloads</span>
              </div>
            </div>

            <button
              onClick={() => handleUnlockNote(note)}
              className="w-full btn-botanical-secondary py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Coins className="w-3.5 h-3.5 text-[#D3968C]" />
              <span>Unlock PDF & Solved Answers (1 Credit)</span>
            </button>
          </div>
        ))}
      </div>

      {/* Upload PYQ / Study Material Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg botanical-card bg-white p-6 sm:p-8 text-[#0A3323] shadow-xl rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#839958]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#0A3323] text-[#F7F4D5] flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5 text-[#FAF8ED]" />
                </div>
                <div>
                  <span className="badge-rose px-2 py-0.5 text-[9px] font-bold rounded-full uppercase">
                    Senior Contributor Engine
                  </span>
                  <h3 className="text-lg font-bold text-[#0A3323]">Upload PYQ / Senior Notes</h3>
                </div>
              </div>

              <button onClick={() => setIsUploadModalOpen(false)} className="text-[#839958] hover:text-[#0A3323]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF8ED] border border-[#839958]/25 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setNewType('PYQ Paper')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    newType === 'PYQ Paper'
                      ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                      : 'text-[#0A3323]/80 hover:bg-white'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 text-[#D3968C]" />
                  <span>PYQ Exam & Solved Paper</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewType('Lecture Notes')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    newType === 'Lecture Notes'
                      ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                      : 'text-[#0A3323]/80 hover:bg-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#839958]" />
                  <span>Lecture Cheatsheet</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0A3323]">Material Title *</label>
                <input
                  type="text"
                  required
                  placeholder={newType === 'PYQ Paper' ? "e.g. CS 61A Fall 2024 Midterm 2 PYQ + Solved Solutions" : "e.g. Organic Chem Reaction Mechanisms Mindmap"}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0A3323]">Course Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS 61A / MATH 53"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0A3323]">Subject Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
                  >
                    <option value="Academic & STEM">Academic & STEM</option>
                    <option value="Coding & Tech">Coding & Tech</option>
                    <option value="Languages">Languages</option>
                    <option value="Writing & Test Prep">Writing & Test Prep</option>
                  </select>
                </div>
              </div>

              {newType === 'PYQ Paper' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#0A3323]">Exam Year</label>
                    <select
                      value={newExamYear}
                      onChange={(e) => setNewExamYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
                    >
                      <option value="2025">2025 (Latest)</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#0A3323]">Includes Solutions?</label>
                    <button
                      type="button"
                      onClick={() => setHasSolutions(!hasSolutions)}
                      className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                        hasSolutions ? 'bg-[#FAF8ED] border-[#105666] text-[#105666]' : 'bg-white border-[#839958]/30 text-[#0A3323]/60'
                      }`}
                    >
                      <span>{hasSolutions ? '✓ Step-by-Step Answers' : 'Question Only'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#0A3323]">Key Topics & Summary</label>
                <textarea
                  rows={3}
                  placeholder="Summarize key topics, formulas, or solved past exam questions covered in this paper..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666] resize-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8ED] border border-[#839958]/20 text-xs text-[#0A3323]/80 space-y-1">
                <div className="font-bold text-[#105666] flex items-center justify-between">
                  <span>💰 Contributor Credit Reward Engine</span>
                  <span className="badge-rose px-2 py-0.2 rounded font-bold">+1 Cr / Download</span>
                </div>
                <p className="text-[11px] text-[#839958]">
                  Earn 1 Escrow Credit & +25 Impact Karma every time a junior peer unlocks your paper! Add to your LinkedIn profile.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#839958]/15">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#839958] hover:text-[#0A3323]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-botanical-primary px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish & Earn Credits</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
