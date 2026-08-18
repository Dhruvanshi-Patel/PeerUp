import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Camera, 
  ShieldCheck, 
  Star, 
  Coins, 
  Flame, 
  Award, 
  Plus, 
  GraduationCap, 
  BookOpen, 
  Zap, 
  Edit3, 
  Check, 
  MapPin, 
  Mail, 
  Leaf, 
  Sparkles, 
  Upload, 
  X,
  Share2
} from 'lucide-react';
import { CAMPUSES } from '../data/mockData';

export default function MyProfileView() {
  const { 
    currentUser, 
    level, 
    xp, 
    nextLevelXp, 
    updateUserProfile, 
    setIsAddSkillModalOpen, 
    setIsShareModalOpen,
    addToast 
  } = useApp();

  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states for profile editing
  const [name, setName] = useState(currentUser?.name || '');
  const [school, setSchool] = useState(currentUser?.school || 'UC Berkeley');
  const [major, setMajor] = useState(currentUser?.major || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || 'Campus');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setSchool(currentUser.school || 'UC Berkeley');
      setMajor(currentUser.major || '');
      setBio(currentUser.bio || '');
      setLocation(currentUser.location || 'Campus');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  // Handle Photo File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Image Required 🖼️', 'Please upload a valid image file (JPG, PNG, WebP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('File Too Large ⚠️', 'Image size should be under 5MB.', 'error');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target.result;
      setAvatar(dataUrl);
      await updateUserProfile({ avatar: dataUrl });
      setIsUploading(false);
      addToast('Profile Photo Updated! 📸', 'New profile picture saved to database.', 'success');
    };
    reader.onerror = () => {
      setIsUploading(false);
      addToast('Upload Error', 'Could not read image file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateUserProfile({
      name: name.trim() || currentUser.name,
      school,
      major: major.trim() || currentUser.major,
      bio: bio.trim() || currentUser.bio,
      location: location.trim() || currentUser.location,
      avatar
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 text-slate-900 font-sans">
      {/* Hidden File Input for Image Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handlePhotoUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Main Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 border border-slate-200/80 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          
          {/* Photo Avatar with Upload Overlay */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-slate-100 shadow-md bg-slate-100 relative">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-full h-full object-cover" 
              />
              {isUploading && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white text-xs font-bold">
                  Uploading...
                </div>
              )}
            </div>

            {/* Camera Overlay Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload custom profile photo"
              className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all border-2 border-white cursor-pointer hover:scale-105 flex items-center gap-1 text-xs font-bold"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Upload Photo</span>
            </button>
          </div>

          {/* Student Profile Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                VERIFIED PEER LEARNER
              </span>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
                {currentUser.school || 'UC Berkeley'}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span>{currentUser.name}</span>
                <span className="text-xs font-bold text-slate-700 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                  {currentUser.badgeLevel || 'Master Mentor'}
                </span>
              </h1>
              <p className="text-sm font-semibold text-slate-600 mt-1 flex items-center justify-center md:justify-start gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>{currentUser.major || 'Computer Science'}</span>
                <span className="text-slate-300">|</span>
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">{currentUser.location || 'Campus'}</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              "{currentUser.bio || 'Excited to trade skills, share study notes, and learn from peers on campus!'}"
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <span>Edit Profile & Photo</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Upload Custom Photo</span>
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Share Profile</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Profile Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 border border-slate-200/80 rounded-2xl text-center space-y-1 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">{currentUser.credits || 5}</div>
          <div className="text-[11px] text-slate-500 font-semibold">Simple Credits</div>
        </div>

        <div className="bg-white p-4 border border-slate-200/80 rounded-2xl text-center space-y-1 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">{currentUser.karma || 150} XP</div>
          <div className="text-[11px] text-slate-500 font-semibold">Karma Rep</div>
        </div>

        <div className="bg-white p-4 border border-slate-200/80 rounded-2xl text-center space-y-1 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto border border-indigo-200">
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">{currentUser.hoursTaught || 0} hrs</div>
          <div className="text-[11px] text-slate-500 font-semibold">Hours Taught</div>
        </div>

        <div className="bg-white p-4 border border-slate-200/80 rounded-2xl text-center space-y-1 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto border border-indigo-200">
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">{currentUser.hoursLearned || 0} hrs</div>
          <div className="text-[11px] text-slate-500 font-semibold">Hours Learned</div>
        </div>

        <div className="bg-white p-4 border border-slate-200/80 rounded-2xl text-center space-y-1 shadow-sm col-span-2 md:col-span-1">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">{currentUser.streak || 1} 🔥</div>
          <div className="text-[11px] text-slate-500 font-semibold">Swap Streak</div>
        </div>
      </div>

      {/* Skills Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Skills Offered */}
        <div className="bg-white p-6 border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Skills I Can Teach ({currentUser.skillsOffered?.length || 0})</span>
            </h3>
            <button
              onClick={() => setIsAddSkillModalOpen(true)}
              className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {currentUser.skillsOffered && currentUser.skillsOffered.length > 0 ? (
              currentUser.skillsOffered.map(skill => (
                <div key={skill.id || skill.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">{skill.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{skill.category} • {skill.level || 'Intermediate'}</div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold rounded-lg shrink-0">
                    👍 {skill.endorsementCount || 1} Endorsements
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No teaching skills listed yet. Click "Add Skill" to list a subject you can tutor!
              </div>
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="bg-white p-6 border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Skills I Want to Learn ({currentUser.skillsWanted?.length || 0})</span>
            </h3>
            <button
              onClick={() => setIsAddSkillModalOpen(true)}
              className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {currentUser.skillsWanted && currentUser.skillsWanted.length > 0 ? (
              currentUser.skillsWanted.map(skill => (
                <div key={skill.id || skill.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">{skill.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{skill.category}</div>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 text-[10px] font-bold rounded-lg shrink-0">
                    Priority: {skill.priority || 'High'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No learning goals added yet. Add a skill you're eager to learn!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Peer Reviews Received */}
      <div className="bg-white p-6 border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Student Peer Reviews & Ratings ({currentUser.reviews?.length || 0})</span>
          </h3>
          <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            ★ {currentUser.rating || 5.0} Average Rating
          </span>
        </div>

        {currentUser.reviews && currentUser.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser.reviews.map(rev => (
              <div key={rev.id || rev.comment} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={rev.avatar} alt={rev.author} className="w-7 h-7 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{rev.author}</div>
                      <div className="text-[10px] text-slate-500">{rev.school} • {rev.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                <div className="text-[10px] text-emerald-700 font-semibold">Skill: {rev.skill}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No peer reviews yet. Complete your first 60-minute skill swap session to receive ratings and karma badges!
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-slate-900" />
                <h3 className="text-lg font-extrabold text-slate-900">Edit Student Profile</h3>
              </div>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Photo Upload in Edit Modal */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <img src={avatar || currentUser.avatar} alt="Avatar Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="font-bold text-slate-900">Profile Photo</div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upload Custom Image</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900">University / Campus</label>
                  <select
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800"
                  >
                    {CAMPUSES.filter(c => c !== 'All Campuses').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900">Major / Field of Study</label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
