import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { MapPin, Navigation, CheckCircle2, Heart, Sparkles, Filter } from 'lucide-react';

interface NearMeRadarProps {
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onLikeProfile: (profile: UserProfile) => void;
}

export const NearMeRadar: React.FC<NearMeRadarProps> = ({
  profiles,
  onSelectProfile,
  onLikeProfile,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('All');

  const zones = ['All', 'Island (Lagos)', 'Mainland (Lagos)', 'Central (Abuja)'];

  const filtered = profiles.filter((p) => {
    if (selectedZone === 'Island (Lagos)') return p.location.zone === 'Island';
    if (selectedZone === 'Mainland (Lagos)') return p.location.zone === 'Mainland';
    if (selectedZone === 'Central (Abuja)') return p.location.zone === 'Central';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-orange-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            People Near You
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time neighborhood discovery across Lagos & Abuja.
        </p>

        {/* Zone Segmented Filter */}
        <div className="flex gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none">
          {zones.map((z) => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors border ${
                selectedZone === z
                  ? 'bg-orange-600 border-orange-500 text-white'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* List of Nearby People */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.map((profile) => (
          <div
            key={profile.id}
            onClick={() => onSelectProfile(profile)}
            className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 shrink-0">
                <img
                  src={profile.photos[0]}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                {profile.isOnline && (
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate">
                    {profile.name}, {profile.age}
                  </h4>
                  {profile.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                  <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                  <span className="truncate">{profile.location.city}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span className="text-orange-400 font-semibold">{profile.distanceKm}km away</span>
                  <span>·</span>
                  <span className="capitalize">{profile.lookingFor}</span>
                  {profile.tribe && (
                    <>
                      <span>·</span>
                      <span>{profile.tribe}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onLikeProfile(profile);
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md active:scale-90 hover:brightness-110 ml-2"
              title="Like"
            >
              <Heart className="w-5 h-5 fill-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
