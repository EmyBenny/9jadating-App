import React, { useState } from 'react';
import { UserProfile, LookingFor, NigerianTribe, Religion } from '../../types';
import { 
  CheckCircle2, Camera, ShieldCheck, MapPin, Bell, 
  Trash2, Heart, Shield, Edit3, Save, Sparkles, ChevronRight, 
  Zap, Mic, Award, HelpCircle 
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onStartVerification: () => void;
  onOpenPreferences: () => void;
  onOpenSafetyCenter: () => void;
  onOpenUpgrade: () => void;
  onTriggerBoost: () => void;
  isBoostActive: boolean;
  boostTimeLeft: number;
  onDeleteAccount: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateProfile,
  onStartVerification,
  onOpenPreferences,
  onOpenSafetyCenter,
  onOpenUpgrade,
  onTriggerBoost,
  isBoostActive,
  boostTimeLeft,
  onDeleteAccount,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(currentUser.bio);
  const [occupation, setOccupation] = useState(currentUser.occupation || '');
  const [lookingFor, setLookingFor] = useState<LookingFor>(currentUser.lookingFor);
  const [heightCm, setHeightCm] = useState(currentUser.heightCm || 178);
  const [tribe, setTribe] = useState<NigerianTribe>(currentUser.tribe || 'Yoruba');
  const [religion, setReligion] = useState<Religion>(currentUser.religion || 'Christianity');
  const [notifications, setNotifications] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate profile completeness score
  let score = 50;
  if (currentUser.photos.length >= 2) score += 15;
  if (currentUser.verified) score += 15;
  if (currentUser.occupation) score += 10;
  if (currentUser.tribe) score += 5;
  if (currentUser.heightCm) score += 5;
  const completeness = Math.min(score, 100);

  const handleSave = () => {
    onUpdateProfile({
      bio,
      occupation,
      lookingFor,
      heightCm,
      tribe,
      religion,
    });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Banner & Avatar */}
      <div className="relative pb-4 bg-gradient-to-b from-orange-950/40 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="px-5 pt-6 flex flex-col items-center text-center">
          {/* Avatar with Verification Ring */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-orange-500 via-amber-400 to-orange-600 shadow-xl overflow-hidden">
              <img
                src={currentUser.photos[0]}
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {currentUser.verified ? (
              <span className="absolute bottom-1 right-1 p-1 bg-amber-500 text-slate-950 rounded-full shadow-md" title="Naija Verified">
                <CheckCircle2 className="w-5 h-5 fill-slate-950 text-amber-300" />
              </span>
            ) : (
              <button
                onClick={onStartVerification}
                className="absolute bottom-1 right-1 p-1.5 bg-orange-600 text-white rounded-full shadow-md hover:bg-orange-500 transition-colors"
                title="Verify your profile"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          <h2 className="text-xl font-bold text-white mt-3 flex items-center gap-1.5">
            <span>{currentUser.name}, {currentUser.age}</span>
            {currentUser.verified && (
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                Naija Verified
              </span>
            )}
          </h2>

          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>{currentUser.location.city}, {currentUser.location.state}</span>
          </p>

          {/* Verification Callout if not verified */}
          {!currentUser.verified && (
            <button
              onClick={onStartVerification}
              className="mt-3 px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 hover:bg-amber-500/25 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Get Verified · Boost matches 3x</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Body */}
      <div className="p-4 space-y-4">
        {/* Profile Completeness Score Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Profile Completeness
              </span>
            </div>
            <span className="text-xs font-black text-orange-400">{completeness}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-orange-600 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>

          {completeness < 100 && (
            <p className="text-[11px] text-slate-400">
              💡 <strong>Tip:</strong> Complete your photo verification and tribe details to unlock top placement in discovery.
            </p>
          )}
        </div>

        {/* Profile Boost Trigger Widget */}
        <div className="p-4 bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-slate-900 border border-amber-500/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                {isBoostActive ? 'Profile Boost Active!' : 'Boost Profile in Lagos'}
              </h4>
              <p className="text-[11px] text-slate-300">
                {isBoostActive ? `Ends in ${boostTimeLeft}m · 10x views` : 'Be top profile in your zone for 30 mins'}
              </p>
            </div>
          </div>
          <button
            onClick={onTriggerBoost}
            disabled={isBoostActive}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md ${
              isBoostActive
                ? 'bg-emerald-600 text-white opacity-90'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:brightness-110 active:scale-95'
            }`}
          >
            {isBoostActive ? 'Active ⚡' : 'Boost ₦1,200'}
          </button>
        </div>

        {/* Bio & Details Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Profile Bio & Details
            </span>
            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              {isEditing ? (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Occupation / Profession</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">About Me</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Tribe / Ethnicity</label>
                  <select
                    value={tribe}
                    onChange={(e) => setTribe(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white"
                  >
                    {['Yoruba', 'Igbo', 'Hausa', 'Edo/Benin', 'Efik/Ibibio', 'Ijaw', 'Other'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Religion</label>
                  <select
                    value={religion}
                    onChange={(e) => setReligion(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white"
                  >
                    {['Christianity', 'Islam', 'Traditional', 'Spiritual', 'Prefer not to say'].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 text-xs">
              <p className="text-slate-300 leading-relaxed">{currentUser.bio}</p>
              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2 text-slate-300">
                <span className="px-2.5 py-1 bg-slate-800 rounded-lg">Profession: <strong className="text-white">{currentUser.occupation}</strong></span>
                <span className="px-2.5 py-1 bg-slate-800 rounded-lg">Tribe: <strong className="text-orange-400">{currentUser.tribe}</strong></span>
                <span className="px-2.5 py-1 bg-slate-800 rounded-lg">Religion: <strong className="text-amber-400">{currentUser.religion}</strong></span>
                <span className="px-2.5 py-1 bg-slate-800 rounded-lg">Height: <strong className="text-white">{currentUser.heightCm} cm</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Discovery & Advanced Filters Link */}
        <button
          onClick={onOpenPreferences}
          className="w-full p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-between text-left transition-colors"
        >
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Discovery & Advanced Filters
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Filter by Tribe, Religion, Height, City, and Age limits
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        {/* Tender Plus Subscription Link */}
        <button
          onClick={onOpenUpgrade}
          className="w-full p-4 bg-gradient-to-r from-orange-950/40 via-amber-950/20 to-slate-900 hover:from-orange-950/50 border border-orange-500/30 rounded-2xl flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Tender Plus Membership
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                See who liked you, unlimited likes & daily boosts
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-orange-400" />
        </button>

        {/* Safety Center Link */}
        <button
          onClick={onOpenSafetyCenter}
          className="w-full p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Tender Safety Center
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Offline date safety rules, anti-urgent 2k scam alerts
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        {/* Account Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Account Settings
          </span>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-200">Push Notifications (Matches, Chat, Boosts)</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-10 h-6 rounded-full p-1 transition-colors ${
                notifications ? 'bg-orange-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800">
            {showDeleteConfirm ? (
              <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl space-y-2 text-center">
                <p className="text-xs text-rose-300 font-medium">Are you sure? All matches and chats will be wiped.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onDeleteAccount}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full text-left py-1 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account & Reset Data</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
