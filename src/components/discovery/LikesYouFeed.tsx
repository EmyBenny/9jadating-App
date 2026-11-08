import React from 'react';
import { UserProfile } from '../../types';
import { 
  Heart, Sparkles, Lock, CheckCircle2, MapPin, 
  Flame, ArrowRight, Eye 
} from 'lucide-react';

interface LikesYouFeedProps {
  profilesWhoLikedMe: UserProfile[];
  isSubscribed: boolean;
  onOpenUpgrade: () => void;
  onInstantMatch: (profile: UserProfile) => void;
  onViewProfile: (profile: UserProfile) => void;
}

export const LikesYouFeed: React.FC<LikesYouFeedProps> = ({
  profilesWhoLikedMe,
  isSubscribed,
  onOpenUpgrade,
  onInstantMatch,
  onViewProfile,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Banner */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-orange-500 fill-orange-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Likes You ({profilesWhoLikedMe.length})
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              People who already swiped right on your profile in Nigeria.
            </p>
          </div>

          {!isSubscribed && (
            <button
              onClick={onOpenUpgrade}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[11px] font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unlock All</span>
            </button>
          )}
        </div>
      </div>

      {/* Free Tier Teaser Callout */}
      {!isSubscribed && (
        <div className="mx-4 mt-3 p-3 bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-slate-900 border border-orange-500/30 rounded-2xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {profilesWhoLikedMe.length} people want to connect with you!
              </p>
              <p className="text-[10px] text-slate-300">
                Unlock Tender Plus to reveal their faces and match instantly.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenUpgrade}
            className="p-2 text-orange-400 hover:text-white"
            title="See Plans"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Profiles */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {profilesWhoLikedMe.map((profile) => (
            <div
              key={profile.id}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md group"
            >
              {/* Profile Image with conditional blur */}
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  !isSubscribed ? 'blur-lg scale-110 filter brightness-90' : 'group-hover:scale-105'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Locked Overlay for Free Users */}
              {!isSubscribed ? (
                <div 
                  onClick={onOpenUpgrade}
                  className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 mb-2 shadow-lg">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">
                    {profile.location.city}
                  </span>
                  <span className="text-[10px] text-orange-400 font-medium mt-0.5">
                    {profile.distanceKm}km away · Tap to reveal
                  </span>
                </div>
              ) : (
                /* Unlocked Details for Subscribed Users */
                <div className="absolute inset-x-0 bottom-0 p-3 pointer-events-auto">
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

                  <div className="flex gap-1.5 mt-2">
                    <button
                      onClick={() => onViewProfile(profile)}
                      className="flex-1 py-1 bg-slate-800/80 hover:bg-slate-750 text-white rounded-lg text-[10px] font-semibold border border-slate-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onInstantMatch(profile)}
                      className="flex-1 py-1 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-lg text-[10px] font-bold shadow-sm hover:brightness-110 flex items-center justify-center gap-1"
                    >
                      <Heart className="w-3 h-3 fill-white" />
                      <span>Match</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
