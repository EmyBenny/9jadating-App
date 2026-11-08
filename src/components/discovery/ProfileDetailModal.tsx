import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { 
  X, CheckCircle2, MapPin, Briefcase, GraduationCap, Heart, 
  Flame, ShieldAlert, Sparkles, Mic, Play, Pause, Ruler, 
  Wine, Cigarette, Moon 
} from 'lucide-react';

interface ProfileDetailModalProps {
  profile: UserProfile | null;
  onClose: () => void;
  onLike: (profile: UserProfile) => void;
  onPass: (profile: UserProfile) => void;
  onSuperlike: (profile: UserProfile) => void;
  onReport: (profile: UserProfile) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  onLike,
  onPass,
  onSuperlike,
  onReport,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  if (!profile) return null;

  const toggleVoice = () => {
    setIsPlayingVoice(!isPlayingVoice);
    if (!isPlayingVoice) {
      setTimeout(() => setIsPlayingVoice(false), 6000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div 
        className="relative w-full max-w-md h-[92vh] sm:h-[86vh] bg-slate-900 text-slate-100 rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col border border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-300"
      >
        {/* Top Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          aria-label="Close profile"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-28">
          {/* Main Photo Gallery */}
          <div className="relative h-96 w-full bg-slate-950">
            <img
              src={profile.photos[0]}
              alt={profile.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
            
            <div className="absolute bottom-4 left-5 right-5">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  {profile.name}, {profile.age}
                </h2>
                {profile.verified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Naija Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 mt-1">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{profile.location.city}, {profile.location.state}</span>
                <span>·</span>
                <span className="text-orange-400 font-medium">{profile.distanceKm}km away</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-5 space-y-6">
            {/* MVP 2 Voice Prompt Note */}
            {profile.voicePrompt && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/60 via-amber-950/40 to-slate-800 border border-orange-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="w-4 h-4" />
                    <span>Voice Intro</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">0:{profile.voicePrompt.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleVoice}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md hover:brightness-110 shrink-0"
                  >
                    {isPlayingVoice ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white truncate">{profile.voicePrompt.prompt}</p>
                    {/* Audio wave bars */}
                    <div className="flex items-center gap-1 h-3 mt-1.5">
                      {[30, 80, 50, 100, 60, 40, 90, 70, 45, 85, 55, 95].map((h, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all ${
                            isPlayingVoice ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Badges Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200">
                <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="truncate">Intent: <strong className="capitalize text-white">{profile.lookingFor}</strong></span>
              </div>
              {profile.tribe && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Tribe: <strong className="text-white">{profile.tribe}</strong></span>
                </div>
              )}
              {profile.heightCm && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200">
                  <Ruler className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Height: <strong className="text-white">{profile.heightCm} cm</strong></span>
                </div>
              )}
              {profile.religion && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200">
                  <Moon className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="truncate">Faith: <strong className="text-white">{profile.religion}</strong></span>
                </div>
              )}
              {profile.drinking && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200">
                  <Wine className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Drink: <strong className="text-white">{profile.drinking}</strong></span>
                </div>
              )}
              {profile.smoking && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200">
                  <Cigarette className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Smoke: <strong className="text-white">{profile.smoking}</strong></span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About Me</h4>
              <p className="text-base text-slate-200 leading-relaxed font-normal">
                {profile.bio}
              </p>
            </div>

            {/* Career & School */}
            {(profile.occupation || profile.education) && (
              <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
                {profile.occupation && (
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <Briefcase className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>{profile.occupation}</span>
                  </div>
                )}
                {profile.education && (
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <GraduationCap className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>{profile.education}</span>
                  </div>
                )}
              </div>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="pt-2 border-t border-slate-800/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Vibes & Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-medium bg-orange-950/40 text-orange-300 border border-orange-800/40 rounded-lg"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary Photo */}
            {profile.photos[1] && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 h-80 bg-slate-950">
                <img
                  src={profile.photos[1]}
                  alt={`${profile.name} extra`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Prompts */}
            {profile.prompts && profile.prompts.length > 0 && (
              <div className="space-y-3 pt-2">
                {profile.prompts.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/70 to-slate-800/30 border border-slate-700/50">
                    <p className="text-xs font-semibold text-orange-400 mb-1.5">{p.question}</p>
                    <p className="text-sm text-slate-100 font-medium leading-relaxed">{p.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Safety & Report */}
            <div className="pt-4 border-t border-slate-800/80 text-center">
              <button
                onClick={() => onReport(profile)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report or Block {profile.name}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Action Strip */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent flex items-center justify-center gap-4">
          <button
            onClick={() => {
              onPass(profile);
              onClose();
            }}
            className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-rose-400 hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all shadow-lg"
            title="Pass"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
          <button
            onClick={() => {
              onSuperlike(profile);
              onClose();
            }}
            className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 hover:bg-amber-500/30 hover:scale-105 active:scale-95 transition-all shadow-lg"
            title="Super Like"
          >
            <Sparkles className="w-5 h-5 fill-amber-400" />
          </button>
          <button
            onClick={() => {
              onLike(profile);
              onClose();
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white hover:opacity-95 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-600/30"
            title="Like"
          >
            <Heart className="w-7 h-7 fill-white stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
