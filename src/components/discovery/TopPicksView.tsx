import React from 'react';
import { UserProfile } from '../../types';
import { Sparkles, Clock, CheckCircle2, MapPin, Heart, Flame } from 'lucide-react';

interface TopPicksViewProps {
  topPicks: UserProfile[];
  onSelectPick: (profile: UserProfile) => void;
  onLikePick: (profile: UserProfile) => void;
}

export const TopPicksView: React.FC<TopPicksViewProps> = ({
  topPicks,
  onSelectPick,
  onLikePick,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Banner */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Today's Top Picks
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Handpicked profiles matching your vibe and intentions in Nigeria.
            </p>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span>14h left</span>
          </div>
        </div>
      </div>

      {/* Grid of Picks */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {topPicks.map((profile) => (
            <div
              key={profile.id}
              onClick={() => onSelectPick(profile)}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md cursor-pointer group hover:border-orange-500/50 transition-all"
            >
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

              {/* Top Pick Highlight Badge */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                <span>Top Pick</span>
              </div>

              {/* Bottom Info */}
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-bold text-white truncate">
                    {profile.name}, {profile.age}
                  </h4>
                  {profile.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  )}
                </div>

                <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                  <span className="truncate">{profile.location.city}</span>
                </p>

                {profile.occupation && (
                  <p className="text-[10px] text-orange-400 font-medium truncate mt-0.5">
                    {profile.occupation}
                  </p>
                )}

                <div className="mt-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLikePick(profile);
                    }}
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md active:scale-90 hover:brightness-110 transition-all"
                    title="Like this profile"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
