import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle, 
  QrCode, 
  Sparkles, 
  ArrowUpRight, 
  Share2, 
  ShieldCheck,
  Leaf,
  X,
  Plus,
  Zap
} from 'lucide-react';

export default function SessionsView() {
  const { 
    scheduledSessions, 
    startLiveSession, 
    currentUser, 
    partnerStreaks,
    scheduleFollowUpSession,
    addToast 
  } = useApp();

  const [selectedQrSession, setSelectedQrSession] = useState(null);

  const upcomingSessions = scheduledSessions.filter(s => 
    (s.hostId === currentUser.id || s.peerId === currentUser.id) && s.status === 'Confirmed'
  );
  const completedSessions = scheduledSessions.filter(s => 
    (s.hostId === currentUser.id || s.peerId === currentUser.id) && s.status === 'Completed'
  );

  const handleSyncCalendar = (session) => {
    addToast(
      'Calendar Event Synced 📅',
      `Synced "${session.skill}" for ${session.scheduledTime} with Google/Outlook calendar.`,
      'success'
    );
  };

  const getPartnerStreak = (peerId) => {
    const pairKey = [currentUser.id, peerId || 'usr_elena'].sort().join('_');
    return (partnerStreaks && partnerStreaks[pairKey]) || 1;
  };

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="botanical-card-cream p-6 sm:p-8 border border-[#839958]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="badge-moss px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 mb-2 w-fit">
            <Calendar className="w-3.5 h-3.5 text-[#0A3323]" />
            Peer Tutoring Schedule
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A3323]">My Exchange Sessions</h2>
          <p className="text-xs text-[#0A3323]/80 mt-1 leading-relaxed max-w-xl">
            Track 60-minute 1-on-1 peer sessions, launch WebRTC video calls, scan campus QR check-in codes, and build multi-session swap streaks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="badge-teal px-3.5 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#105666] animate-ping"></span>
            {upcomingSessions.length} Scheduled Meetings
          </span>
        </div>
      </div>

      {/* Upcoming Sessions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#0A3323] uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#105666]" />
            Confirmed & Upcoming
          </h3>

          <span className="text-[11px] text-[#839958] font-medium">
            ⏱️ Mandatory 60-Min Tutoring Duration Required for Credit Release
          </span>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="botanical-card-cream p-8 text-center border border-[#839958]/25 rounded-2xl">
            <Calendar className="w-8 h-8 text-[#839958] mx-auto mb-2 opacity-60" />
            <p className="text-sm font-bold text-[#0A3323]">No Upcoming Sessions Yet</p>
            <p className="text-xs text-[#839958] mt-0.5">Explore peer mentors and propose a 1-on-1 swap session to fill your schedule.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingSessions.map(session => {
              const streak = getPartnerStreak(session.peerId);

              return (
                <div
                  key={session.id}
                  className="botanical-card p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="badge-teal px-2.5 py-0.5 text-xs font-bold rounded-full">
                          {session.format}
                        </span>
                        <span className="badge-rose px-2.5 py-0.5 text-[10px] font-bold rounded-full">
                          🔥 {streak}-Week Streak
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-[#839958] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {session.scheduledTime}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-[#0A3323]">{session.skill}</h4>
                      <p className="text-xs text-[#839958] font-medium mt-0.5">
                        With <strong className="text-[#0A3323]">{session.peerName}</strong> ({session.peerSchool})
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF8ED] border border-[#839958]/15 text-xs text-[#0A3323]/80 space-y-1">
                      <div className="flex items-center justify-between font-medium">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#105666]" />
                          <span>1 Credit held in simple credit wallet</span>
                        </div>
                        <span className="badge-moss px-2 py-0.2 text-[10px] font-bold">60 Mins Required</span>
                      </div>
                      <p className="text-[11px] text-[#839958]">Location: {session.location || 'PeerUp In-App WebRTC Room'}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#839958]/15">
                    <div className="grid grid-cols-2 gap-2">
                      {session.format === 'Virtual Call' ? (
                        <button
                          onClick={() => startLiveSession(session.peerName, session.peerAvatar, session.skill, session)}
                          className="btn-botanical-secondary py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Launch Live Room</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedQrSession(session)}
                          className="btn-botanical-primary py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Campus QR</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleSyncCalendar(session)}
                        className="btn-botanical-outline py-2 text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Sync Calendar</span>
                      </button>
                    </div>

                    {/* Book Follow-Up Session for Recurring Streak */}
                    <button
                      onClick={() => scheduleFollowUpSession(session)}
                      className="w-full btn-botanical-outline py-2 text-xs font-bold text-[#105666] flex items-center justify-center gap-1.5 border-[#105666]/30 hover:bg-[#FAF8ED]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Book Follow-Up Session for Streak Multiplier</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed History Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-[#0A3323] uppercase tracking-wider flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#839958]" />
          Completed 1-Hour Session History
        </h3>

        <div className="botanical-card overflow-hidden border border-[#839958]/25 shadow-sm">
          <div className="divide-y divide-[#839958]/15">
            {completedSessions.map(session => (
              <div
                key={session.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-[#FAF8ED]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={session.peerAvatar}
                    alt={session.peerName}
                    className="w-10 h-10 rounded-xl object-cover border border-[#839958]/30"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-[#0A3323] flex items-center gap-1.5">
                      <span>{session.skill}</span>
                      <span className="badge-teal px-2 py-0.2 text-[9px] font-bold">60 Mins Complete</span>
                    </h4>
                    <p className="text-xs text-[#839958] font-medium">{session.peerName} • {session.completedDate || 'Recently Completed'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => scheduleFollowUpSession(session)}
                    className="btn-botanical-outline px-3 py-1 text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-[#105666]" />
                    <span>Book Next Session</span>
                  </button>

                  <span className="badge-moss px-2.5 py-1 text-xs font-bold rounded-full">
                    +1 Credit Released
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Verification Modal */}
      {selectedQrSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-sm botanical-card bg-white p-6 text-[#0A3323] text-center shadow-xl rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#839958]/20 pb-2">
              <span className="text-xs font-bold text-[#105666] uppercase">On-Campus Check-In</span>
              <button onClick={() => setSelectedQrSession(null)} className="text-[#839958] hover:text-[#0A3323]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#FAF8ED] rounded-2xl border border-[#839958]/20 inline-block mx-auto">
              <QrCode className="w-32 h-32 text-[#0A3323] mx-auto" />
              <p className="text-[10px] text-[#839958] font-mono mt-2 uppercase">CODE: {selectedQrSession.id.toUpperCase()}</p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#0A3323]">{selectedQrSession.skill}</h4>
              <p className="text-xs text-[#839958] font-medium mt-0.5">Show QR to {selectedQrSession.peerName} at campus meetup after completing 60 mins tutoring.</p>
            </div>

            <button
              onClick={() => setSelectedQrSession(null)}
              className="w-full btn-botanical-primary py-2.5 text-xs font-bold"
            >
              Close Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
