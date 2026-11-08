import React, { useState } from 'react';
import { MatchItem, UserProfile } from '../../types';
import { Search, Flame, CheckCircle2, MessageSquareOff } from 'lucide-react';

interface MatchesListProps {
  matches: MatchItem[];
  onSelectMatch: (match: MatchItem) => void;
  onGoToDiscovery: () => void;
}

export const MatchesList: React.FC<MatchesListProps> = ({
  matches,
  onSelectMatch,
  onGoToDiscovery,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatches = matches.filter((m) =>
    m.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.user.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const newMatches = matches.filter((m) => !m.lastMessage);
  const activeChats = matches.filter((m) => !!m.lastMessage);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Search Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <h2 className="text-xl font-black text-white tracking-tight mb-3">
          Matches & Chats
        </h2>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your matches..."
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-300">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
            <MessageSquareOff className="w-7 h-7 text-slate-500" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No matches yet!</h3>
          <p className="text-xs text-slate-400 max-w-xs mb-4">
            Swipe right on profiles that enter your eye. When they like you back, you'll see them here.
          </p>
          <button
            onClick={onGoToDiscovery}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-xs font-bold text-white shadow-lg active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4" />
            <span>Start Swiping</span>
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* New Matches Carousel */}
          {newMatches.length > 0 && (
            <div className="p-4 border-b border-slate-800/80">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mb-3">
                New Matches ({newMatches.length})
              </span>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {newMatches.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelectMatch(m)}
                    className="flex flex-col items-center shrink-0 group focus:outline-none"
                  >
                    <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-orange-500 via-amber-400 to-orange-600 group-hover:scale-105 transition-transform shadow-md">
                      <img
                        src={m.user.photos[0]}
                        alt={m.user.name}
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {m.user.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-200 mt-1.5 truncate max-w-[72px]">
                      {m.user.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="p-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2 block">
              Messages
            </span>

            {filteredMatches.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 text-center">No results found for "{searchQuery}"</p>
            ) : (
              <div className="space-y-1">
                {filteredMatches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => onSelectMatch(match)}
                    className="w-full p-3 rounded-2xl hover:bg-slate-900 flex items-center gap-3 transition-colors text-left group"
                  >
                    {/* User Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={match.user.photos[0]}
                        alt={match.user.name}
                        className="w-13 h-13 rounded-full object-cover border border-slate-700/80"
                        referrerPolicy="no-referrer"
                      />
                      {match.user.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                      )}
                    </div>

                    {/* Chat Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="text-sm font-bold text-white truncate">
                            {match.user.name}
                          </h4>
                          {match.user.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {match.lastMessageTime || 'Just now'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-400 truncate pr-2">
                          {match.lastMessage || (
                            <span className="text-orange-400 font-medium italic">
                              You matched! Say hello to {match.user.name} 👋
                            </span>
                          )}
                        </p>
                        {match.unreadCount > 0 && (
                          <span className="shrink-0 w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">
                            {match.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
