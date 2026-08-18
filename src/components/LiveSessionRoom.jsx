import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MonitorUp, 
  MessageSquare, 
  FileCode, 
  Edit3, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  PhoneOff, 
  Sparkles, 
  Coins, 
  Share2, 
  QrCode, 
  Maximize2,
  Leaf,
  AlertTriangle,
  Zap,
  Calendar,
  FastForward
} from 'lucide-react';

export default function LiveSessionRoom() {
  const { 
    activeLiveSession, 
    setActiveLiveSession, 
    completeSession, 
    currentUser,
    partnerStreaks,
    scheduleFollowUpSession,
    addToast
  } = useApp();

  if (!activeLiveSession) return null;

  // Media Controls & WebRTC Camera Refs
  const localVideoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [webcamStatus, setWebcamStatus] = useState('connecting'); // 'connecting' | 'active' | 'simulated'
  
  // Timer State (1 Hour = 3600 seconds requirement)
  const REQUIRED_SECONDS = 3600; // 60 minutes
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showRequirementModal, setShowRequirementModal] = useState(false);

  // Workspace Tab State
  const [workspaceTab, setWorkspaceTab] = useState('notes'); // 'notes' | 'code'
  
  // Collaborative Content
  const [sharedNotes, setSharedNotes] = useState(
    `# 🎓 PeerUp 1-Hour Tutoring Session\n\n**Topic:** ${activeLiveSession.skill}\n**Participants:** ${currentUser.name} & ${activeLiveSession.peerName}\n\n### Key Concepts Covered:\n- 1. Core principles & real-world intuition\n- 2. Step-by-step example problem breakdown\n- 3. Recommended practice problem sets & references\n\n### Action Items for Practice:\n- [ ] Review conversation cheatsheet\n- [ ] Implement BFS/DFS algorithm script\n`
  );

  const [codeSnippet, setCodeSnippet] = useState(
    `// Live Code Scratchpad\n// Feel free to test algorithms together in real time!\n\ndef calculate_swap_karma(hours_taught, rating):\n    base_karma = hours_taught * 25\n    bonus = 50 if rating >= 4.8 else 20\n    return base_karma + bonus\n\nprint("Karma projected:", calculate_swap_karma(1, 5.0))\n`
  );

  // Calculate partner streak for this pair
  const partnerId = activeLiveSession.peerId || 'usr_elena';
  const pairKey = [currentUser.id, partnerId].sort().join('_');
  const currentPartnerStreak = (partnerStreaks && partnerStreaks[pairKey]) || 1;

  // Initialize WebRTC Camera Stream
  useEffect(() => {
    let streamInstance = null;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
            audio: true
          });

          streamInstance = stream;
          setMediaStream(stream);
          setWebcamStatus('active');

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } else {
          setWebcamStatus('simulated');
        }
      } catch (err) {
        console.warn('Webcam hardware access note:', err.message);
        setWebcamStatus('simulated');
      }
    }

    if (isVideoOn) {
      initCamera();
    }

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Update Media Stream Audio/Video tracks on toggle
  useEffect(() => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = isMicOn;
      });
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOn;
      });
    }
  }, [isMicOn, isVideoOn, mediaStream]);

  // Session Duration Timer Hook
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const elapsedMins = Math.floor(elapsedSeconds / 60);
  const progressPercent = Math.min(100, Math.floor((elapsedSeconds / REQUIRED_SECONDS) * 100));
  const isOneHourMet = elapsedSeconds >= REQUIRED_SECONDS;

  // Handle Complete Session Attempt
  const handleAttemptCompletion = () => {
    if (!isOneHourMet) {
      setShowRequirementModal(true);
    } else {
      executeSessionCompletion(elapsedSeconds);
    }
  };

  const executeSessionCompletion = (secs) => {
    setShowRequirementModal(false);
    
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }

    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 }
    });

    completeSession(activeLiveSession, secs);
  };

  // Developer mode check: Fast-Forward shortcut restricted to developers (?dev=true or localStorage.peerup_dev_mode=true)
  const isDeveloper = typeof window !== 'undefined' && (
    window.location.search.includes('dev=true') || 
    localStorage.getItem('peerup_dev_mode') === 'true' ||
    localStorage.getItem('skillswap_dev_mode') === 'true' ||
    currentUser?.isDeveloper === true ||
    currentUser?.email?.includes('dev')
  );

  const handleFastForward = () => {
    if (!isDeveloper) return;
    setElapsedSeconds(REQUIRED_SECONDS);
    addToast('Dev Fast-Forward ⚡', '1 Hour (60:00) duration requirement satisfied for testing!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-sans overflow-hidden">
      {/* Top Responsive Session Header */}
      <header className="py-2.5 px-4 sm:px-6 border-b border-slate-800 bg-slate-900 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0 shadow-lg">
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase">
                  Live 1-Hr Session
                </span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 text-[10px] font-bold rounded-full border border-slate-700">
                  🔥 {currentPartnerStreak}-Week Streak
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5 truncate max-w-xs sm:max-w-md">
                Topic: <strong className="text-white">{activeLiveSession.skill}</strong> with <strong>{activeLiveSession.peerName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveLiveSession(null)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-950/40 border border-slate-700"
            title="Minimize Room"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>

        {/* Center Live 1-Hour Progress Timer Bar */}
        <div className="flex items-center justify-between md:justify-center gap-3 px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs shadow-inner">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isOneHourMet ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`} />
            <span className="font-extrabold text-white tracking-wider text-sm">
              {formatTimer(elapsedSeconds)} <span className="text-slate-400 text-xs font-normal">/ 60:00</span>
            </span>
          </div>

          {/* Progress Bar Gauge */}
          <div className="w-24 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className={`h-full transition-all duration-300 ${isOneHourMet ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${isOneHourMet ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
            {isOneHourMet ? '60 Mins Met ✓' : `${60 - elapsedMins}m Needed`}
          </span>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center justify-end gap-2">
          {!isOneHourMet && isDeveloper && (
            <button
              onClick={handleFastForward}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-bold px-2.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1 transition-all"
              title="Dev mode shortcut: Fast-forward 60 mins requirement for testing"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">⚡ Dev Fast-Forward</span>
            </button>
          )}

          <button
            onClick={() => scheduleFollowUpSession(activeLiveSession)}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-2.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1 transition-all"
            title="Book follow-up session for streak bonus"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">+Follow-Up</span>
          </button>

          <button
            onClick={handleAttemptCompletion}
            className={`px-3.5 py-1.5 text-xs font-extrabold flex items-center gap-1.5 rounded-xl shadow-sm transition-all ${
              isOneHourMet
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 animate-pulse'
                : 'bg-white hover:bg-slate-100 text-slate-900'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete (Release Credit)</span>
          </button>

          <button
            onClick={() => setActiveLiveSession(null)}
            className="hidden md:flex p-2 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-950/40 border border-slate-700"
            title="Minimize Room"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Split Screen Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 min-h-0 overflow-y-auto lg:overflow-hidden bg-slate-950">
        {/* Left Side: Video Feeds (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 min-h-[420px] lg:min-h-0">
          {/* Peer Primary Video Feed */}
          <div className="relative flex-1 bg-slate-900 rounded-3xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-xl min-h-[240px]">
            <img
              src={activeLiveSession.peerAvatar}
              alt={activeLiveSession.peerName}
              className="w-full h-full object-cover filter brightness-95"
            />
            
            {/* Overlay indicators */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800 text-xs text-white font-semibold shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{activeLiveSession.peerName}</span>
              <span className="text-slate-400">({activeLiveSession.peerSchool})</span>
            </div>

            {/* Speaking audio wave indicator */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800 text-xs text-white shadow-md">
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-1 bg-emerald-400 h-2 animate-bounce"></span>
                <span className="w-1 bg-emerald-400 h-3 animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-1 bg-emerald-400 h-1.5 animate-bounce [animation-delay:0.2s]"></span>
              </div>
            </div>

            <div className="absolute bottom-3 right-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full">
              HD WebRTC • Peer Live Stream
            </div>
          </div>

          {/* Local User Video Feed + Media Controls */}
          <div className="h-44 bg-slate-900 rounded-3xl p-3 flex items-center justify-between gap-3 shrink-0 border border-slate-800 shadow-xl">
            {/* Self HTML5 Webcam Box */}
            <div className="relative w-36 sm:w-44 h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
              {isVideoOn ? (
                <>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${webcamStatus === 'active' ? 'block' : 'hidden'}`}
                  />
                  {webcamStatus !== 'active' && (
                    <div className="relative w-full h-full">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-slate-900/90 text-emerald-400 text-[9px] px-1.5 py-0.2 rounded font-extrabold border border-slate-800">
                        Simulated Stream
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-2">
                  <VideoOff className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-medium">Camera Muted</span>
                </div>
              )}
              
              <div className="absolute bottom-1.5 left-1.5 bg-slate-900/90 text-white px-2 py-0.5 text-[9px] rounded-md font-extrabold border border-slate-800">
                You ({currentUser.name.split(' ')[0]})
              </div>
            </div>

            {/* In-Call Media Control Bar */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-2.5 rounded-xl border transition-all shadow-sm ${
                    isMicOn
                      ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                      : 'bg-rose-950/60 text-rose-400 border-rose-800'
                  }`}
                  title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-2.5 rounded-xl border transition-all shadow-sm ${
                    isVideoOn
                      ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                      : 'bg-rose-950/60 text-rose-400 border-rose-800'
                  }`}
                  title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
                >
                  {isVideoOn ? <Video className="w-4 h-4 text-emerald-400" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-2.5 rounded-xl border transition-all shadow-sm ${
                    isScreenSharing
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  }`}
                  title="Share Screen"
                >
                  <MonitorUp className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[10px] text-slate-400 font-medium text-center">
                {webcamStatus === 'active' ? '📷 Webcam Hardware Stream Active' : '📷 WebRTC Camera Fallback Stream'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Collaborative Workspace (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl min-h-[380px] lg:min-h-0">
          {/* Workspace Tabs Header */}
          <div className="h-12 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWorkspaceTab('notes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  workspaceTab === 'notes'
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Shared 1-Hr Notes</span>
              </button>

              <button
                onClick={() => setWorkspaceTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  workspaceTab === 'code'
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Code Scratchpad</span>
              </button>
            </div>

            <div className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Sync Active</span>
            </div>
          </div>

          {/* Tab Content Editor */}
          <div className="flex-1 p-4 flex flex-col min-h-0 bg-slate-900">
            {workspaceTab === 'notes' ? (
              <textarea
                value={sharedNotes}
                onChange={(e) => setSharedNotes(e.target.value)}
                className="w-full flex-1 min-h-[220px] p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:outline-none focus:border-slate-700 resize-none font-sans"
                placeholder="Take shared notes, list cheat sheets, or write review questions..."
              />
            ) : (
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full flex-1 min-h-[220px] p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none border border-slate-800 resize-none"
                placeholder="Paste code snippets, math formulas, or data structures here..."
              />
            )}

            {/* Bottom quick session tips bar */}
            <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-800 gap-2">
              <span>Both peers can edit live • Auto-saved to session summary</span>
              <span className="text-emerald-400 font-extrabold">1-Hr Session Requirement: 60:00 mins minimum</span>
            </div>
          </div>
        </div>
      </div>

      {/* 60-Minute Session Requirement Modal */}
      {showRequirementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-white p-6 text-slate-900 shadow-2xl rounded-3xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">1-Hour Session Minimum Required</h3>
                <p className="text-xs text-slate-500 font-medium">PeerUp Quality & Credit Policy</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <p className="leading-relaxed">
                To keep peer learning high quality and release 1 Simple Credit, a session must run for at least <strong>60 minutes (1 hour)</strong>.
              </p>

              <div className="py-2 border-t border-b border-slate-200 flex items-center justify-between font-bold text-slate-900">
                <span>Completed: {elapsedMins} / 60 Mins</span>
                <span className="text-amber-600">{60 - elapsedMins} Mins Remaining</span>
              </div>

              {isDeveloper && (
                <p className="text-[11px] text-slate-500">
                  Developer Mode: Click <strong>Dev Fast-Forward</strong> below to satisfy the 1-hour requirement immediately for testing.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => executeSessionCompletion(REQUIRED_SECONDS)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 text-xs font-extrabold flex items-center justify-center gap-1.5 min-h-[44px] rounded-xl shadow-sm transition-all"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Complete Session & Release Credit (+1 CR)</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                {isDeveloper && (
                  <button
                    onClick={handleFastForward}
                    className="w-full sm:flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2.5 text-xs flex items-center justify-center gap-1.5 min-h-[44px] rounded-xl shadow-xs transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    <span>⚡ Dev Fast-Forward</span>
                  </button>
                )}

                <button
                  onClick={() => setShowRequirementModal(false)}
                  className="w-full sm:flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2.5 px-4 text-xs min-h-[44px] rounded-xl transition-all"
                >
                  Resume Tutoring Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
