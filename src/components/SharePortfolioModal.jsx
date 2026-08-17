import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Star, 
  Award, 
  GraduationCap, 
  Check, 
  Copy, 
  Download, 
  Share2, 
  Sparkles, 
  Linkedin, 
  ExternalLink,
  Leaf,
  FileCheck2,
  CheckCircle2
} from 'lucide-react';

export default function SharePortfolioModal() {
  const { isPortfolioModalOpen, setIsPortfolioModalOpen, portfolioTargetUser, addToast } = useApp();

  if (!isPortfolioModalOpen || !portfolioTargetUser) return null;

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCertDetails, setCopiedCertDetails] = useState(false);

  // Formatted LinkedIn Experience Bullet Points
  const resumeSnippet = `Senior Peer Mentor & Academic Contributor | SkillSwap Peer Network (${portfolioTargetUser.school})
- Conducted ${portfolioTargetUser.hoursTaught}+ hours of 1-on-1 peer tutoring in ${portfolioTargetUser.skillsOffered.map(s => s.name).join(', ')}.
- Published verified PYQ Past Exam Papers & Cheatsheets with 120+ peer downloads on campus.
- Maintained a ${portfolioTargetUser.rating}/5.0 peer satisfaction rating across ${portfolioTargetUser.reviewCount} student endorsements.
- Verifiable Credentials & Portfolio: https://skillswap.edu/@${portfolioTargetUser.id.replace('usr_', '')}`;

  // Formatted LinkedIn Certification Fields
  const certName = `SkillSwap Senior Peer Mentor & PYQ Contributor`;
  const certOrg = `SkillSwap Peer Learning Network`;
  const certId = `SKILLSWAP-CERT-${portfolioTargetUser.id.toUpperCase()}-2025`;
  const certUrl = `https://skillswap.edu/@${portfolioTargetUser.id.replace('usr_', '')}`;

  const handleCopySnippet = () => {
    navigator.clipboard?.writeText(resumeSnippet);
    setCopiedCode(true);
    addToast('LinkedIn Experience Copied! 📋', 'Formatted bullet points copied for your LinkedIn Experience section.', 'success');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleCopyCertDetails = () => {
    const certBlock = `Name: ${certName}\nIssuing Organization: ${certOrg}\nIssue Date: August 2025\nExpiration Date: Does Not Expire\nCredential ID: ${certId}\nCredential URL: ${certUrl}`;
    navigator.clipboard?.writeText(certBlock);
    setCopiedCertDetails(true);
    addToast('LinkedIn License Details Copied! 📜', 'Copied Certification fields for LinkedIn Licenses & Certifications.', 'success');
    setTimeout(() => setCopiedCertDetails(false), 3000);
  };

  const handleAddToLinkedIn = () => {
    const linkedInAddUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certName)}&organizationName=${encodeURIComponent(certOrg)}&issueYear=2025&issueMonth=8&certId=${encodeURIComponent(certId)}&certUrl=${encodeURIComponent(certUrl)}`;
    window.open(linkedInAddUrl, '_blank');
    addToast('Opening LinkedIn Certification Add Page 🚀', 'Redirecting to add SkillSwap Senior Contributor License to LinkedIn.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl botanical-card bg-white p-6 sm:p-8 my-8 text-[#0A3323] shadow-xl rounded-3xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#839958]/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-moss px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Verified Campus Credential
              </span>
              <span className="badge-teal px-2 py-0.5 text-[10px] font-bold rounded-full">
                LinkedIn Ready
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#0A3323]">
              {portfolioTargetUser.name}'s Senior Tutor & PYQ Record
            </h2>
          </div>

          <button onClick={() => setIsPortfolioModalOpen(false)} className="text-[#839958] hover:text-[#0A3323]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portfolio Card Preview */}
        <div className="botanical-card-cream p-5 space-y-4 border border-[#839958]/25 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={portfolioTargetUser.avatar}
                alt={portfolioTargetUser.name}
                className="w-14 h-14 rounded-2xl object-cover border border-[#839958]/30 shadow-sm shrink-0"
              />
              <div>
                <h3 className="font-bold text-base text-[#0A3323] flex items-center gap-2">
                  {portfolioTargetUser.name}
                  <ShieldCheck className="w-4 h-4 text-[#105666]" />
                </h3>
                <p className="text-xs text-[#839958] font-medium">{portfolioTargetUser.school} • {portfolioTargetUser.major}</p>
              </div>
            </div>

            <span className="badge-rose px-3 py-1 text-xs font-bold rounded-full shrink-0">
              {portfolioTargetUser.badgeLevel}
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 bg-white border border-[#839958]/20 rounded-xl">
              <div className="font-bold text-[#0A3323]">{portfolioTargetUser.hoursTaught} hrs</div>
              <div className="text-[10px] text-[#839958] font-medium">Tutoring Taught</div>
            </div>
            <div className="p-2.5 bg-white border border-[#839958]/20 rounded-xl">
              <div className="font-bold text-[#D3968C] flex items-center justify-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-[#D3968C]" />
                {portfolioTargetUser.rating}
              </div>
              <div className="text-[10px] text-[#839958] font-medium">{portfolioTargetUser.reviewCount} Reviews</div>
            </div>
            <div className="p-2.5 bg-white border border-[#839958]/20 rounded-xl">
              <div className="font-bold text-[#105666]">{portfolioTargetUser.karma} pts</div>
              <div className="text-[10px] text-[#839958] font-medium">Karma Score</div>
            </div>
            <div className="p-2.5 bg-white border border-[#839958]/20 rounded-xl">
              <div className="font-bold text-[#0A3323]">8 PYQs</div>
              <div className="text-[10px] text-[#839958] font-medium">Shared Papers</div>
            </div>
          </div>

          {/* Endorsed Skills */}
          <div>
            <div className="text-[10px] font-bold text-[#105666] uppercase tracking-wider mb-1.5">
              Verified Teaching & PYQ Endorsements:
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {portfolioTargetUser.skillsOffered.map(s => (
                <div key={s.id} className="badge-moss px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 font-medium">
                  <span>{s.name}</span>
                  <span className="text-[10px] opacity-75">({s.level} • {s.endorsementCount}★)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LinkedIn Integration Actions Container */}
        <div className="p-4 rounded-2xl bg-[#FAF8ED] border border-[#839958]/25 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A3323] uppercase flex items-center gap-1.5">
              <Linkedin className="w-4 h-4 text-[#0077B5]" />
              Add Credential to Your LinkedIn Profile
            </span>
            <span className="badge-moss px-2 py-0.2 text-[10px] font-bold">1-Click Verification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleAddToLinkedIn}
              className="w-full btn-botanical-primary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <Linkedin className="w-4 h-4 text-white" />
              <span>Add License to LinkedIn</span>
            </button>

            <button
              onClick={handleCopyCertDetails}
              className="w-full btn-botanical-outline py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2"
            >
              {copiedCertDetails ? <CheckCircle2 className="w-4 h-4 text-[#105666]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCertDetails ? 'Copied License Fields' : 'Copy License Fields'}</span>
            </button>
          </div>
        </div>

        {/* Resume & LinkedIn Experience Snippet */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-bold text-[#0A3323] uppercase text-[10px]">
              LinkedIn Experience / Resume Bullet Points
            </label>
            <button
              onClick={handleCopySnippet}
              className="font-bold text-[#105666] hover:underline flex items-center gap-1"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#105666]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied Snippet' : 'Copy Snippet'}</span>
            </button>
          </div>

          <pre className="p-3.5 bg-[#FAF8ED] border border-[#839958]/30 rounded-2xl text-[#0A3323] font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
            {resumeSnippet}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#839958]/20 text-xs">
          <div className="text-[#839958] flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#105666]" />
            <span>Cryptographically signed by SkillSwap Protocol</span>
          </div>

          <button onClick={() => setIsPortfolioModalOpen(false)} className="btn-botanical-outline px-4 py-1.5 text-xs font-semibold">
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
}
