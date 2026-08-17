import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  ArrowLeftRight, 
  Check, 
  X, 
  Video, 
  Calendar, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  UserCheck 
} from 'lucide-react';

export default function MessagesHub() {
  const { 
    conversations, 
    activeChatId, 
    setActiveChatId, 
    sendMessage, 
    currentUser, 
    proposals, 
    acceptProposal, 
    declineProposal, 
    startLiveSession 
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');

  // Conversations & Inbound proposals filtered for the current logged-in user
  const userConversations = conversations.filter(c => 
    Array.isArray(c.participants) ? c.participants.includes(currentUser.id) : (c.senderId === currentUser.id || c.peerId === currentUser.id)
  );
  const activeConversation = userConversations.find(c => c.id === activeChatId) || userConversations[0];

  const incomingProposals = proposals.filter(p => p.receiverId === currentUser.id);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversation) return;

    sendMessage(activeConversation.id, inputMessage);
    setInputMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px] botanical-card bg-white overflow-hidden border border-[#839958]/25 shadow-sm">
      {/* Left Sidebar (5 Cols): Proposals & Conversations */}
      <div className="lg:col-span-5 border-r border-[#839958]/20 flex flex-col bg-[#FAF8ED] min-h-[620px]">
        {/* Inbound Swap Proposals Section */}
        <div className="p-4 border-b border-[#839958]/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A3323] uppercase tracking-wider flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#105666]" />
              Swap Proposals ({incomingProposals.length})
            </span>
          </div>

          {incomingProposals.length === 0 ? (
            <div className="p-3 bg-white border border-[#839958]/20 rounded-xl text-xs text-[#839958] text-center font-medium">
              No pending swap proposals.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {incomingProposals.map(proposal => (
                <div
                  key={proposal.id}
                  className="p-3 bg-white border border-[#839958]/30 rounded-xl space-y-2 text-xs shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0A3323]">{proposal.senderName}</span>
                    <span className="badge-moss px-2 py-0.5 text-[10px] rounded-full font-semibold">
                      {proposal.type}
                    </span>
                  </div>

                  <p className="text-[#0A3323]/80 text-[11px] leading-snug">
                    Wants: <strong className="text-[#0A3323]">{proposal.requestedSkill}</strong>
                    {proposal.offeredSkill && <> • Teaches: <strong className="text-[#105666]">{proposal.offeredSkill}</strong></>}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    {proposal.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => acceptProposal(proposal.id)}
                          className="flex-1 py-1.5 btn-botanical-primary text-[11px] font-bold flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Accept</span>
                        </button>

                        <button
                          onClick={() => declineProposal(proposal.id)}
                          className="px-2.5 py-1.5 btn-botanical-outline text-[11px] font-semibold text-rose-600 hover:bg-rose-50 border-rose-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] font-bold text-[#839958] uppercase">
                        Status: {proposal.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversations List Header */}
        <div className="p-3 border-b border-[#839958]/15 bg-[#FAF8ED] text-xs font-bold text-[#0A3323] uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-[#105666]" />
          <span>Active Peer Chats ({userConversations.length})</span>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#839958]/15">
          {userConversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#0A3323]/60 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-[#839958]/40" />
              <p className="font-bold text-[#0A3323]">No Active Chats Yet</p>
              <p className="text-[11px] leading-relaxed">
                When you propose a skill swap or receive a request from a peer, your conversation will appear here!
              </p>
            </div>
          ) : (
            userConversations.map(chat => {
              const isActive = activeConversation && activeConversation.id === chat.id;

              return (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full p-3.5 text-left transition-colors flex items-center gap-3 ${
                  isActive ? 'bg-white border-l-4 border-[#105666] shadow-sm' : 'hover:bg-white/60'
                }`}
              >
                <img
                  src={chat.peerAvatar}
                  alt={chat.peerName}
                  className="w-10 h-10 rounded-xl object-cover border border-[#839958]/30"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-[#0A3323] truncate">{chat.peerName}</h4>
                    <span className="text-[10px] text-[#839958] font-medium">{chat.lastTimestamp}</span>
                  </div>
                  <p className="text-xs text-[#0A3323]/70 truncate mt-0.5">{chat.lastMessage}</p>
                </div>
              </button>
            );
          })
        )}
        </div>
      </div>

      {/* Right Main Chat Window (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col min-h-[620px] bg-white">
        {activeConversation ? (
          <>
            {/* Active Chat Header */}
            <div className="p-4 border-b border-[#839958]/20 bg-[#FAF8ED] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={activeConversation.peerAvatar}
                  alt={activeConversation.peerName}
                  className="w-10 h-10 rounded-xl object-cover border border-[#839958]/30"
                />
                <div>
                  <h3 className="font-bold text-sm text-[#0A3323] flex items-center gap-1.5">
                    <span>{activeConversation.peerName}</span>
                    <ShieldCheck className="w-4 h-4 text-[#105666]" />
                  </h3>
                  <p className="text-xs text-[#839958] font-medium">{activeConversation.peerSchool} • Active Peer</p>
                </div>
              </div>

              {/* Start Live Video Call */}
              <button
                onClick={() => startLiveSession(activeConversation.peerName, activeConversation.peerAvatar, 'Python & Algorithm Prep')}
                className="btn-botanical-secondary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Video className="w-4 h-4" />
                <span>Launch Live Room</span>
              </button>
            </div>

            {/* Chat Stream Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8ED]/30">
              {activeConversation.messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUser.id || msg.sender === 'me' || msg.sender === currentUser.name;

                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-[#105666] text-[#F7F4D5] rounded-br-none'
                          : 'bg-white text-[#0A3323] border border-[#839958]/25 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-[#839958] font-medium mt-1 px-1">{msg.time || 'Just now'}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#839958]/20 bg-[#FAF8ED] flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="Type your message or swap request details..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#839958]/30 text-[#0A3323] text-xs focus:outline-none focus:border-[#105666]"
              />
              <button
                type="submit"
                className="btn-botanical-primary px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#839958]">
            <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm font-semibold">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
