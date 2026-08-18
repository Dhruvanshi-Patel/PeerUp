import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { X, Plus, Sparkles, BookOpen, GraduationCap, Check, Leaf } from 'lucide-react';

export default function AddSkillModal() {
  const { isAddSkillModalOpen, setIsAddSkillModalOpen, addNewSkill } = useApp();

  if (!isAddSkillModalOpen) return null;

  const [type, setType] = useState('teach'); // 'teach' | 'learn'
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Coding & Tech');
  const [level, setLevel] = useState('Intermediate');
  const [priority, setPriority] = useState('High');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addNewSkill({
      type,
      name: name.trim(),
      category,
      level,
      priority
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-md bg-white p-6 sm:p-8 my-8 text-slate-900 shadow-2xl rounded-3xl space-y-4 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Plus className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                List a Skill
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
                Add to Student Profile
              </h2>
            </div>
          </div>

          <button onClick={() => setIsAddSkillModalOpen(false)} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Skill Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('teach')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                type === 'teach'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              I Can Teach (Offer)
            </button>

            <button
              type="button"
              onClick={() => setType('learn')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                type === 'learn'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              I Want to Learn (Need)
            </button>
          </div>

          {/* Skill Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-900">Skill Title / Subject Name:</label>
            <input
              type="text"
              required
              placeholder="e.g. Next.js, Organic Chemistry, French, Guitar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="font-bold text-slate-900">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
            >
              {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Level or Priority depending on type */}
          {type === 'teach' ? (
            <div className="space-y-1">
              <label className="font-bold text-slate-900">Proficiency Level:</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
              >
                <option value="Intermediate">Intermediate (Course A/B level)</option>
                <option value="Advanced">Advanced (Upper Division / Projects)</option>
                <option value="Expert">Expert / Native / TA Level</option>
              </select>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="font-bold text-slate-900">Learning Priority:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
              >
                <option value="High">High (Immediate Need for Exams / Projects)</option>
                <option value="Medium">Medium (General Interest)</option>
                <option value="Low">Low (Casual Hobby)</option>
              </select>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 text-xs flex items-center justify-center gap-1.5 rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add to My Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
