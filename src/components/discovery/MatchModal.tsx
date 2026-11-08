import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { MessageSquare, Flame, Sparkles, X, Send } from 'lucide-react';

interface MatchModalProps {
  currentUser: UserProfile;
  matchedUser: UserProfile;
  onClose: () => void;
  onOpenChat: (matchedUser: UserProfile, initialMessage?: string) => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  currentUser,
  matchedUser,
  onClose,
  onOpenChat,
}) => {
  const [customMsg, setCustomMsg] = useState('');
  const quickPickers = [
    'How far nau? Good to connect! 👋',
    'Your bio enter my eye well well! ✨',
    'Third mainland bridge or Lekki coffee date? ☕',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-orange-500/30 rounded-3xl p-6 text-center shadow-2xl shadow-orange-950/50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>E Don Happen!</span>
        </div>

        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 tracking-tight">
          It's a Match!
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          You and <strong className="text-white">{matchedUser.name}</strong> like each other. No dulling!
        </p>

        {/* Avatar Collision */}
        <div className="flex items-center justify-center my-6 relative">
          <div className="relative z-10 w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-orange-500 to-amber-400 shadow-xl">
            <img
              src={currentUser.photos[0]}
              alt={currentUser.name}
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative -ml-6 z-20 w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-xl">
            <img
              src={matchedUser.photos[0]}
              alt={matchedUser.name}
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute z-30 bottom-0 left-1/2 -translate-x-1/2 translate-y-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white p-2 rounded-full shadow-lg">
            <Flame className="w-5 h-5 fill-white" />
          </div>
        </div>

        {/* Quick Conversation Starters */}
        <div className="space-y-1.5 my-4 text-left">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Naija Conversation Starters
          </span>
          {quickPickers.map((msg, i) => (
            <button
              key={i}
              onClick={() => onOpenChat(matchedUser, msg)}
              className="w-full text-left text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-2 rounded-xl border border-slate-700/60 transition-all flex items-center justify-between group"
            >
              <span className="truncate">{msg}</span>
              <Send className="w-3.5 h-3.5 text-orange-400 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder={`Say hello to ${matchedUser.name}...`}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customMsg.trim()) {
                onOpenChat(matchedUser, customMsg.trim());
              }
            }}
          />
          <button
            onClick={() => onOpenChat(matchedUser, customMsg.trim() || undefined)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0 flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
        </div>

        {/* Keep Swiping */}
        <button
          onClick={onClose}
          className="mt-4 text-xs font-medium text-slate-400 hover:text-white py-1 transition-colors"
        >
          Keep swiping for now
        </button>
      </div>
    </div>
  );
};
