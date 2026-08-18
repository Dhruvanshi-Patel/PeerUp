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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px] bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm text-slate-900">
      {/* Left Sidebar (5 Cols): Proposals & Conversations */}
      <div className="lg:col-span-5 border-r border-slate-200 flex flex-col bg-slate-50 min-h-[620px]">
        {/* Inbound Swap Proposals Section */}
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600" />
              Swap Proposals ({incomingProposals.length})
            </span>
          </div>

          {incomingProposals.length === 0 ? (
            <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 text-center font-medium shadow-sm">
              No pending swap proposals.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {incomingProposals.map(proposal => (
                <div
                  key={proposal.id}
                  className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">{proposal.senderName}</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] rounded-full font-bold">
                      {proposal.type}
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-snug">
                    Wants: <strong className="text-slate-900">{proposal.requestedSkill}</strong>
                    {proposal.offeredSkill && <> • Teaches: <strong className="text-emerald-700">{proposal.offeredSkill}</strong></>}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    {proposal.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => acceptProposal(proposal.id)}
                          className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Accept</span>
                        </button>

                        <button
                          onClick={() => declineProposal(proposal.id)}
                          className="px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-rose-600 border-rose-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
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
        <div className="p-3 border-b border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
          <span>Active Peer Chats ({userConversations.length})</span>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
          {userConversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
              <p className="font-bold text-slate-900">No Active Chats Yet</p>
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
                  isActive ? 'bg-white border-l-4 border-slate-900 shadow-sm' : 'hover:bg-white/80'
                }`}
              >
                <img
                  src={chat.peerAvatar}
                  alt={chat.peerName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{chat.peerName}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{chat.lastTimestamp}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{chat.lastMessage}</p>
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
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={activeConversation.peerAvatar}
                  alt={activeConversation.peerName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>{activeConversation.peerName}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{activeConversation.peerSchool} • Active Peer</p>
                </div>
              </div>

              {/* Start Live Video Call */}
              <button
                onClick={() => startLiveSession(activeConversation.peerName, activeConversation.peerAvatar, 'Python & Algorithm Prep')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Video className="w-4 h-4 text-slate-950" />
                <span>Launch Live Room</span>
              </button>
            </div>

            {/* Chat Stream Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
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
                          ? 'bg-slate-900 text-white rounded-br-none'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 px-1">{msg.time || 'Just now'}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="Type your message or swap request details..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-800"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm font-semibold">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
