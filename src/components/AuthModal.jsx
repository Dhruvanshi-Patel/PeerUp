import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUSES, CATEGORIES } from '../data/mockData';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Plus, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Database
} from 'lucide-react';

import { isUniversityEmail } from './CreateProfileModal';

export default function AuthModal({ isOpen, onClose }) {
  const { loginWithPassword, registerWithPassword, setPersona, users, addToast } = useApp();

  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState('login'); // 'login' | 'register'
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regSchool, setRegSchool] = useState('UC Berkeley');
  const [regMajor, setRegMajor] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regSkillName, setRegSkillName] = useState('');
  const [regSkillCategory, setRegSkillCategory] = useState('Coding & Tech');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      addToast('Fields Required', 'Please enter your email and password.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithPassword(loginEmail.trim(), loginPassword.trim());
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      addToast('Authentication Failed', err.message, 'error');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      addToast('Fields Required', 'Please complete all required fields.', 'error');
      return;
    }

    if (!isUniversityEmail(regEmail.trim())) {
      addToast('University Email Required 🏫', 'Please enter your official campus email address (e.g. name@berkeley.edu, name@stanford.edu, or name@ox.ac.uk). Commercial emails (Gmail/Yahoo) are not accepted for student status verification.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const skillsOffered = regSkillName.trim() ? [
        {
          id: 'sk_' + Date.now(),
          name: regSkillName.trim(),
          category: regSkillCategory,
          level: 'Advanced',
          endorsementCount: 1
        }
      ] : [
        {
          id: 'sk_' + Date.now(),
          name: 'General Tutoring & Exam Review',
          category: 'Academic & STEM',
          level: 'Intermediate',
          endorsementCount: 1
        }
      ];

      await registerWithPassword({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        school: regSchool,
        major: regMajor.trim() || 'Computer Science',
        bio: regBio.trim() || 'Verified student trading skills and PYQ notes on campus.',
        skillsOffered
      });

      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      addToast('Registration Error', err.message, 'error');
    }
  };

  const fillQuickDemoLogin = (email) => {
    setLoginEmail(email);
    setLoginPassword('password123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg botanical-card bg-white p-6 sm:p-8 my-8 text-[#0A3323] shadow-xl rounded-3xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#839958]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0A3323] text-[#F7F4D5] flex items-center justify-center shrink-0 shadow-sm">
              <Database className="w-5 h-5 text-[#FAF8ED]" />
            </div>
            <div>
              <span className="badge-teal px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Database Auth Active
              </span>
              <h2 className="text-lg font-bold text-[#0A3323]">Student Portal Sign In</h2>
            </div>
          </div>

          <button onClick={onClose} className="text-[#839958] hover:text-[#0A3323]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF8ED] border border-[#839958]/25 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveMode('login')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'login'
                ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                : 'text-[#0A3323]/80 hover:bg-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In (Password)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('register')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'register'
                ? 'bg-[#105666] text-[#F7F4D5] shadow-sm'
                : 'text-[#0A3323]/80 hover:bg-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#D3968C]" />
            <span>Register Account</span>
          </button>
        </div>

        {activeMode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#0A3323]">Campus Email (.edu)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#839958] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. priya.sharma@berkeley.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0A3323]">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#839958] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#839958] hover:text-[#0A3323]"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Security Requirement */}
            <div className="p-3 bg-[#FAF8ED] border border-[#839958]/20 rounded-2xl space-y-1">
              <div className="text-[10px] font-bold text-[#105666] uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#839958]" />
                <span>Password Protected Account Access</span>
              </div>
              <p className="text-[11px] text-[#0A3323]/80">
                Enter your registered student email and password to access your account.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-botanical-primary py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Database Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#0A3323]">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0A3323]">University / Campus</label>
                <select
                  value={regSchool}
                  onChange={(e) => setRegSchool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
                >
                  {CAMPUSES.filter(c => c !== 'All Campuses').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#0A3323] flex items-center justify-between">
                  <span>Campus Email (.edu) *</span>
                  {regEmail && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isUniversityEmail(regEmail) ? 'bg-[#839958]/20 text-[#0A3323]' : 'bg-rose-100 text-rose-700'}`}>
                      {isUniversityEmail(regEmail) ? '✓ Campus Mail Valid' : '⚠️ Must be campus mail'}
                    </span>
                  )}
                </label>
                <input
                  type="email"
                  required
                  placeholder="maya@berkeley.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border text-[#0A3323] focus:outline-none ${
                    regEmail && !isUniversityEmail(regEmail) ? 'border-rose-400 focus:border-rose-600' : 'border-[#839958]/30 focus:border-[#105666]'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0A3323]">Password *</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? "text" : "password"}
                    required
                    placeholder="Min 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#839958]"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#0A3323]">Major / Year</label>
                <input
                  type="text"
                  placeholder="e.g. Cognitive Science (Sophomore)"
                  value={regMajor}
                  onChange={(e) => setRegMajor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0A3323]">Skill You Can Teach</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures / Spanish"
                  value={regSkillName}
                  onChange={(e) => setRegSkillName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8ED] border border-[#839958]/30 text-[#0A3323] focus:outline-none focus:border-[#105666]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#FAF8ED] border border-[#839958]/20 rounded-2xl text-xs text-[#0A3323]/80 space-y-1">
              <div className="font-bold text-[#105666] flex items-center justify-between">
                <span>⚡ Welcome Grant</span>
                <span className="badge-rose px-2 py-0.2 rounded font-bold">+5 Credits & 150 Karma</span>
              </div>
              <p className="text-[11px] text-[#839958]">
                Your account will be saved to the database. Share your unique referral link to earn +2 credits whenever a friend registers!
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-botanical-primary py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Create Database Account & Claim +5 Credits'}</span>
              <Check className="w-4 h-4 text-[#D3968C]" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
