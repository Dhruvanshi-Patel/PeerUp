import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUSES, CATEGORIES } from '../data/mockData';
import { X, UserPlus, GraduationCap, ShieldCheck, Sparkles, Check, Plus, Image, Leaf } from 'lucide-react';

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
];

export const isUniversityEmail = (email) => {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1].toLowerCase();
  const commercialDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'protonmail.com', 'gmx.com'];
  if (commercialDomains.includes(domain)) return false;

  return (
    domain.endsWith('.edu') ||
    domain.endsWith('.ac.uk') ||
    domain.endsWith('.ac.in') ||
    domain.endsWith('.edu.in') ||
    domain.endsWith('.edu.au') ||
    domain.endsWith('.edu.ca') ||
    domain.endsWith('.edu.sg') ||
    domain.includes('.edu.') ||
    domain.includes('univ') ||
    domain.includes('college') ||
    domain.includes('school')
  );
};

export default function CreateProfileModal({ isOpen, onClose }) {
  const { createNewUserProfile, addToast } = useApp();

  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [school, setSchool] = useState('UC Berkeley');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  
  const [teachSkillName, setTeachSkillName] = useState('');
  const [teachSkillCategory, setTeachSkillCategory] = useState('Coding & Tech');
  const [teachSkillLevel, setTeachSkillLevel] = useState('Advanced');

  const [learnSkillName, setLearnSkillName] = useState('');
  const [learnSkillCategory, setLearnSkillCategory] = useState('Languages');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !isUniversityEmail(email.trim())) {
      addToast('University Email Required 🏫', 'Please enter an official campus email (e.g. name@berkeley.edu, name@stanford.edu, or name@ox.ac.uk). Commercial emails (Gmail/Yahoo) are not allowed.', 'error');
      return;
    }

    setIsSubmitting(true);

    const formattedEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@${school.toLowerCase().replace(/\s+/g, '')}.edu`;

    const skillsOffered = teachSkillName.trim() ? [
      {
        id: 'sk_' + Date.now(),
        name: teachSkillName.trim(),
        category: teachSkillCategory,
        level: teachSkillLevel,
        endorsementCount: 1
      }
    ] : [
      {
        id: 'sk_' + Date.now(),
        name: 'General Tutoring & Study Prep',
        category: 'Academic & STEM',
        level: 'Intermediate',
        endorsementCount: 1
      }
    ];

    const skillsWanted = learnSkillName.trim() ? [
      {
        id: 'sk_w_' + Date.now(),
        name: learnSkillName.trim(),
        category: learnSkillCategory,
        priority: 'High'
      }
    ] : [
      {
        id: 'sk_w_' + Date.now(),
        name: 'Exam Review & Practice',
        category: 'Writing & Test Prep',
        priority: 'High'
      }
    ];

    const profileData = {
      name: name.trim(),
      school,
      email: formattedEmail,
      major: major.trim() || 'Undeclared',
      bio: bio.trim() || 'Excited to trade skills and learn from peers on campus!',
      avatar: selectedAvatar,
      skillsOffered,
      skillsWanted
    };

    try {
      await createNewUserProfile(profileData);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      addToast('Registration Blocked', err.message || 'Could not save profile to SQL database.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl botanical-card bg-white p-6 sm:p-8 my-8 text-[#0A3323] shadow-xl rounded-3xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#839958]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A3323] text-[#F7F4D5] flex items-center justify-center shrink-0 shadow-sm">
              <UserPlus className="w-5 h-5 text-[#FAF8ED]" />
            </div>
            <div>
              <span className="badge-rose px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Student Registration • +3 Welcome Credits
              </span>
              <h2 className="text-lg font-bold text-[#0A3323] mt-0.5">
                Create Student Profile
              </h2>
            </div>
          </div>

          <button onClick={onClose} className="text-[#839958] hover:text-[#0A3323]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Avatar Selector Presets & Custom Upload */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#0A3323]">Profile Photo / Avatar:</label>
              <label className="text-[11px] font-bold text-[#105666] hover:underline cursor-pointer flex items-center gap-1">
                <span>Upload Custom Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (evt) => setSelectedAvatar(evt.target.result);
                    reader.readAsDataURL(file);
                  }} 
                />
              </label>
            </div>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              <img src={selectedAvatar} alt="Current Preview" className="w-10 h-10 rounded-xl object-cover border-2 border-[#105666]" />
              {AVATAR_PRESETS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`relative shrink-0 rounded-xl overflow-hidden border transition-all ${
                    selectedAvatar === av 
                      ? 'border-[#105666] ring-2 ring-[#105666]/30 scale-105 shadow-sm' 
                      : 'opacity-60 hover:opacity-100 border-[#839958]/25'
                  }`}
                >
                  <img src={av} alt="Avatar option" className="w-10 h-10 object-cover" />
                  {selectedAvatar === av && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#105666] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name & School */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#0A3323]">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0A3323]">University / Campus *</label>
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
              >
                {CAMPUSES.filter(c => c !== 'All Campuses').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Email & Major */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#0A3323] flex items-center justify-between">
                <span>Student Email (.edu) *</span>
                {email && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isUniversityEmail(email) ? 'bg-[#839958]/20 text-[#0A3323]' : 'bg-rose-100 text-rose-700'}`}>
                    {isUniversityEmail(email) ? '✓ Campus Mail Valid' : '⚠️ Must be .edu / campus mail'}
                  </span>
                )}
              </label>
              <input
                type="email"
                required
                placeholder="e.g. maya.lin@berkeley.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border text-[#0A3323] focus:outline-none ${
                  email && !isUniversityEmail(email) ? 'border-rose-400 focus:border-rose-600' : 'border-[#839958]/30 focus:border-[#105666]'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0A3323]">Major / Field of Study</label>
              <input
                type="text"
                placeholder="e.g. Cognitive Science (Sophomore)"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="font-bold text-[#0A3323]">Short Bio</label>
            <textarea
              rows={2}
              placeholder="What subjects are you eager to trade with peers?"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666] resize-none"
            />
          </div>

          {/* First Skill you can teach */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8ED] border border-[#839958]/20 space-y-2">
            <div className="text-[10px] font-bold text-[#105666] uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D3968C]" />
              First Skill You Can Teach (Earn Credits)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="e.g. Python, Calculus, French"
                value={teachSkillName}
                onChange={(e) => setTeachSkillName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#839958]/30 text-[#0A3323] text-xs focus:outline-none"
              />

              <select
                value={teachSkillCategory}
                onChange={(e) => setTeachSkillCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#839958]/30 text-[#0A3323] text-xs focus:outline-none"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* First Skill you want to learn */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8ED] border border-[#839958]/20 space-y-2">
            <div className="text-[10px] font-bold text-[#839958] uppercase flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#105666]" />
              First Skill You Want to Learn (Need)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="e.g. Spanish, Figma UI, Organic Chem"
                value={learnSkillName}
                onChange={(e) => setLearnSkillName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#839958]/30 text-[#0A3323] text-xs focus:outline-none"
              />

              <select
                value={learnSkillCategory}
                onChange={(e) => setLearnSkillCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#839958]/30 text-[#0A3323] text-xs focus:outline-none"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#839958] hover:text-[#0A3323]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-botanical-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Create Profile & Claim 3 Credits'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
