import React, { useState, useRef } from 'react';
import { UserProfile } from '../../types';
import { 
  X, Heart, Sparkles, RotateCcw, Info, CheckCircle2, 
  MapPin, SlidersHorizontal, RefreshCw, Flame, Mic, Play, Pause 
} from 'lucide-react';

interface SwipeDeckProps {
  profiles: UserProfile[];
  onSwipe: (profile: UserProfile, type: 'like' | 'pass' | 'superlike') => void;
  onUndoSwipe: () => void;
  canUndo: boolean;
  onOpenDetail: (profile: UserProfile) => void;
  onOpenPreferences: () => void;
  onResetDeck: () => void;
  remainingSuperlikes: number;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  profiles,
  onSwipe,
  onUndoSwipe,
  canUndo,
  onOpenDetail,
  onOpenPreferences,
  onResetDeck,
  remainingSuperlikes,
}) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [playingVoice, setPlayingVoice] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const activeProfile = profiles[0];
  const nextProfile = profiles[1];

  // Desktop Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (!activeProfile) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onSwipe(activeProfile, 'pass');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onSwipe(activeProfile, 'like');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onSwipe(activeProfile, 'superlike');
      } else if (e.key.toLowerCase() === 'z' && canUndo) {
        e.preventDefault();
        onUndoSwipe();
      } else if (e.key.toLowerCase() === 'i' || e.key === ' ') {
        e.preventDefault();
        onOpenDetail(activeProfile);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProfile, canUndo, onSwipe, onUndoSwipe, onOpenDetail]);

  // Touch and Mouse handlers for smooth dragging
  const handleStart = (clientX: number, clientY: number) => {
    if (!activeProfile) return;
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !dragStartRef.current) return;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging || !activeProfile) return;
    setIsDragging(false);

    const threshold = 95;
    if (dragOffset.x > threshold) {
      // Swiped Right -> LIKE
      onSwipe(activeProfile, 'like');
    } else if (dragOffset.x < -threshold) {
      // Swiped Left -> PASS
      onSwipe(activeProfile, 'pass');
    } else if (dragOffset.y < -110) {
      // Swiped Up -> SUPERLIKE
      onSwipe(activeProfile, 'superlike');
    }
    setDragOffset({ x: 0, y: 0 });
    dragStartRef.current = null;
  };

  const rotationDeg = dragOffset.x * 0.08;
  const likeOpacity = Math.min(Math.max(dragOffset.x / 80, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragOffset.x / 80, 0), 1);
  const superlikeOpacity = Math.min(Math.max(-dragOffset.y / 90, 0), 1);

  const toggleVoiceIntro = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingVoice(!playingVoice);
    if (!playingVoice) {
      setTimeout(() => setPlayingVoice(false), 5000);
    }
  };

  if (!activeProfile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-300">
        <div className="w-20 h-20 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4">
          <Flame className="w-10 h-10 text-orange-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No more profiles in this filter!</h3>
        <p className="text-sm text-slate-400 max-w-xs mb-6">
          You've viewed everyone in your chosen city and tribe criteria. Try expanding your radius or reset the deck.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onOpenPreferences}
            className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
            <span>Adjust Filters</span>
          </button>
          <button
            onClick={onResetDeck}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-orange-600/20 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Deck</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none relative">
      {/* Top Filter Bar */}
      <div className="px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span className="font-medium text-slate-300">{activeProfile.location.city} · Nigeria</span>
        </div>
        <button
          onClick={onOpenPreferences}
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
          title="Filter Preferences"
        >
          <SlidersHorizontal className="w-4 h-4 text-orange-400" />
        </button>
      </div>

      {/* Card Stack Area */}
      <div className="flex-1 relative mx-3 my-1 sm:my-2 min-h-0 flex items-center justify-center">
        {/* Next Card in Stack (background teaser) */}
        {nextProfile && (
          <div className="absolute inset-0 top-3 bottom-1 mx-2 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg pointer-events-none scale-[0.96] opacity-70 transition-transform">
            <img
              src={nextProfile.photos[0]}
              alt={nextProfile.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-6 left-5 text-white">
              <span className="text-xl font-bold">{nextProfile.name}, {nextProfile.age}</span>
              <p className="text-xs text-slate-300">{nextProfile.location.city}</p>
            </div>
          </div>
        )}

        {/* Active Card */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl cursor-grab active:cursor-grabbing touch-none"
          style={{
            transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotationDeg}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={handleEnd}
        >
          {/* Main Photo */}
          <img
            src={activeProfile.photos[0]}
            alt={activeProfile.name}
            className="w-full h-full object-cover pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

          {/* Swipe Indicator Stamps */}
          {likeOpacity > 0.1 && (
            <div
              className="absolute top-8 left-6 border-4 border-emerald-400 text-emerald-400 font-black text-2xl sm:text-3xl px-4 py-1 rounded-xl -rotate-12 pointer-events-none uppercase tracking-wider backdrop-blur-xs shadow-lg"
              style={{ opacity: likeOpacity }}
            >
              Enter Eye (LIKE)
            </div>
          )}

          {nopeOpacity > 0.1 && (
            <div
              className="absolute top-8 right-6 border-4 border-rose-500 text-rose-500 font-black text-2xl sm:text-3xl px-4 py-1 rounded-xl rotate-12 pointer-events-none uppercase tracking-wider backdrop-blur-xs shadow-lg"
              style={{ opacity: nopeOpacity }}
            >
              Pass (NOPE)
            </div>
          )}

          {superlikeOpacity > 0.1 && (
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 border-4 border-amber-400 text-amber-300 bg-black/40 font-black text-xl sm:text-2xl px-5 py-2 rounded-xl pointer-events-none uppercase tracking-wider backdrop-blur-md shadow-2xl flex items-center gap-2"
              style={{ opacity: superlikeOpacity }}
            >
              <Sparkles className="w-5 h-5 fill-amber-400" />
              <span>SUPER LIKE</span>
            </div>
          )}

          {/* Card Bottom Meta */}
          <div className="absolute bottom-4 left-5 right-5 pointer-events-none">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {activeProfile.name}, {activeProfile.age}
                  </h2>
                  {activeProfile.verified && (
                    <span 
                      className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full"
                      title="Naija Verified Profile"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>{activeProfile.location.city}</span>
                  <span>·</span>
                  <span className="text-orange-400 font-medium">{activeProfile.distanceKm}km away</span>
                  {activeProfile.tribe && (
                    <>
                      <span>·</span>
                      <span className="text-amber-300 font-medium">{activeProfile.tribe}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Info Button to trigger full profile */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(activeProfile);
                }}
                className="pointer-events-auto p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-transform active:scale-90"
                aria-label="View full profile"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>

            {/* Voice Prompt Teaser if available */}
            {activeProfile.voicePrompt && (
              <button
                type="button"
                onClick={toggleVoiceIntro}
                className="pointer-events-auto mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-950/80 border border-orange-500/40 text-orange-300 hover:bg-orange-900 transition-colors text-xs font-semibold shadow-md"
              >
                {playingVoice ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Playing Voice Intro ({activeProfile.voicePrompt.duration}s)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{activeProfile.voicePrompt.prompt}</span>
                  </>
                )}
              </button>
            )}

            {/* Short Snippet */}
            <p className="text-xs sm:text-sm text-slate-200 mt-2 line-clamp-2 leading-relaxed">
              {activeProfile.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Buttons */}
      <div className="py-3 px-4 flex items-center justify-center gap-3 sm:gap-4 shrink-0">
        {/* Rewind / Undo Swipe */}
        <button
          onClick={onUndoSwipe}
          disabled={!canUndo}
          className="w-11 h-11 rounded-full bg-slate-800/90 border border-slate-700/80 text-amber-400 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-700 flex items-center justify-center transition-all active:scale-90 shadow-md"
          title="Undo last swipe"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Pass / Left */}
        <button
          onClick={() => onSwipe(activeProfile, 'pass')}
          className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 text-rose-400 hover:bg-slate-700/80 hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-lg shadow-rose-950/20"
          title="Pass (Swipe Left)"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Superlike / Up */}
        <button
          onClick={() => onSwipe(activeProfile, 'superlike')}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600/30 to-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-lg relative"
          title="Superlike (Swipe Up)"
        >
          <Sparkles className="w-5 h-5 fill-amber-400" />
          <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-amber-500 text-slate-950 rounded-full w-4 h-4 flex items-center justify-center">
            {remainingSuperlikes}
          </span>
        </button>

        {/* Like / Right */}
        <button
          onClick={() => onSwipe(activeProfile, 'like')}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white hover:brightness-110 hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-xl shadow-orange-600/35"
          title="Like (Swipe Right)"
        >
          <Heart className="w-8 h-8 fill-white stroke-[2]" />
        </button>

        {/* Profile Details */}
        <button
          onClick={() => onOpenDetail(activeProfile)}
          className="w-11 h-11 rounded-full bg-slate-800/90 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all active:scale-90 shadow-md"
          title="View profile details"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop Keyboard Hints */}
      <div className="hidden lg:flex items-center justify-center gap-4 text-[10px] text-slate-400 pb-1.5 font-mono select-none">
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">←</kbd> Pass</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">↑</kbd> Superlike</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">→</kbd> Like</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">Z</kbd> Undo</span>
      </div>
    </div>
  );
};
