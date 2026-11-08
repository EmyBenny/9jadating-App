import React from 'react';
import { Wifi, Battery, Signal, Sparkles, MessageCircle, Heart, User, Compass } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: 'discovery' | 'feed' | 'matches' | 'profile';
  onChangeTab: (tab: 'discovery' | 'feed' | 'matches' | 'profile') => void;
  unreadCount?: number;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  onChangeTab,
  unreadCount = 0,
}) => {
  return (
    <div className="relative w-full max-w-[400px] h-[780px] max-h-[92vh] bg-slate-950 rounded-[44px] shadow-2xl border-[8px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden select-none">
      {/* Top Dynamic Island & Status Bar */}
      <div className="pt-3 px-6 pb-1 bg-slate-950 flex items-center justify-between text-white text-[12px] font-semibold tracking-tight shrink-0 z-40">
        <span>09:41</span>
        
        {/* Dynamic Island Pill */}
        <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center space-x-1.5 shadow-inner">
          <div className="w-2 h-2 rounded-full bg-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500/80" />
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Main Screen Content Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </div>

      {/* Bottom Thumb-Zone Navigation Bar with 4 Core Destinations */}
      <div className="h-16 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-4 flex items-center justify-around shrink-0 z-40">
        {/* Discovery Tab */}
        <button
          onClick={() => onChangeTab('discovery')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === 'discovery' ? 'text-orange-500 scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Discovery Feed"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-[10px] font-bold tracking-tight">Discover</span>
        </button>

        {/* Community Feed Tab */}
        <button
          onClick={() => onChangeTab('feed')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === 'feed' ? 'text-orange-500 scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Community Feed"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
          </svg>
          <span className="text-[10px] font-bold tracking-tight">Feed</span>
        </button>

        {/* Matches / Chat Tab */}
        <button
          onClick={() => onChangeTab('matches')}
          className={`relative flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === 'matches' ? 'text-orange-500 scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Matches and Chats"
        >
          <div className="relative">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Matches</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onChangeTab('profile')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === 'profile' ? 'text-orange-500 scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="User Profile"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span className="text-[10px] font-bold tracking-tight">Profile</span>
        </button>
      </div>

      {/* Home Indicator Bar */}
      <div className="h-4 bg-slate-950 flex items-center justify-center pb-2 shrink-0">
        <div className="w-32 h-1 bg-slate-600 rounded-full" />
      </div>
    </div>
  );
};
