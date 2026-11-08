import React, { useState } from 'react';
import { 
  FilterPreferences, InterestedIn, LookingFor, 
  NigerianTribe, Religion, LifestyleHabit 
} from '../../types';
import { NIGERIAN_CITIES } from '../../data/mockProfiles';
import { X, SlidersHorizontal, MapPin, Check, Sparkles } from 'lucide-react';

interface PreferencesModalProps {
  preferences: FilterPreferences;
  onSave: (prefs: FilterPreferences) => void;
  onClose: () => void;
  isSubscribed?: boolean;
  onUpgradeToUnlock?: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  preferences,
  onSave,
  onClose,
  isSubscribed = true,
  onUpgradeToUnlock,
}) => {
  const [minAge, setMinAge] = useState(preferences.ageRange[0]);
  const [maxAge, setMaxAge] = useState(preferences.ageRange[1]);
  const [distance, setDistance] = useState(preferences.maxDistanceKm);
  const [interestedIn, setInterestedIn] = useState<InterestedIn>(preferences.interestedIn);
  const [lookingFor, setLookingFor] = useState<LookingFor | 'all'>(preferences.lookingFor || 'all');
  const [verifiedOnly, setVerifiedOnly] = useState(preferences.verifiedOnly);
  const [selectedCity, setSelectedCity] = useState(preferences.selectedCity || 'All Nigeria');

  // MVP 2 Advanced Filters
  const [religion, setReligion] = useState<Religion | 'all'>(preferences.religion || 'all');
  const [tribe, setTribe] = useState<NigerianTribe | 'all'>(preferences.tribe || 'all');
  const [minHeightCm, setMinHeightCm] = useState<number>(preferences.minHeightCm || 155);
  const [drinking, setDrinking] = useState<LifestyleHabit | 'all'>(preferences.drinking || 'all');
  const [smoking, setSmoking] = useState<LifestyleHabit | 'all'>(preferences.smoking || 'all');

  const handleApply = () => {
    onSave({
      ageRange: [minAge, maxAge],
      maxDistanceKm: distance,
      interestedIn,
      lookingFor,
      verifiedOnly,
      selectedCity: selectedCity === 'All Nigeria' ? undefined : selectedCity,
      religion,
      tribe,
      minHeightCm,
      drinking,
      smoking,
    });
    onClose();
  };

  const tribesList: (NigerianTribe | 'all')[] = [
    'all', 'Yoruba', 'Igbo', 'Hausa', 'Edo/Benin', 'Efik/Ibibio', 'Ijaw', 'Urhobo', 'Tiv', 'Other'
  ];

  const religionsList: (Religion | 'all')[] = [
    'all', 'Christianity', 'Islam', 'Traditional', 'Spiritual', 'Agnostic/Atheist'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 text-slate-100 max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-orange-400" />
            <h3 className="text-base font-bold text-white">Discovery & Advanced Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Target Location / City Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Primary City / Zone</span>
              </label>
              <span className="text-xs text-orange-400 font-medium">{selectedCity}</span>
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="All Nigeria">All Nigeria (Lagos, Abuja, PH, Ibadan...)</option>
              {NIGERIAN_CITIES.map((c, i) => (
                <option key={i} value={c.city}>
                  {c.city} ({c.state})
                </option>
              ))}
            </select>
          </div>

          {/* Maximum Distance */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Max Distance (Radius)
              </label>
              <span className="text-xs font-bold text-orange-400">{distance} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          {/* Age Range */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Age Range
              </label>
              <span className="text-xs font-bold text-orange-400">
                {minAge} - {maxAge} years
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 block mb-1">Min: {minAge}</span>
                <input
                  type="range"
                  min="18"
                  max="45"
                  value={minAge}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= maxAge) setMinAge(val);
                  }}
                  className="w-full accent-orange-500"
                />
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 block mb-1">Max: {maxAge}</span>
                <input
                  type="range"
                  min="21"
                  max="60"
                  value={maxAge}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= minAge) setMaxAge(val);
                  }}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>
          </div>

          {/* ADVANCED SECTION: Tribe & Ethnicity */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Tribe / Ethnicity (Optional)</span>
              </label>
              <span className="text-xs text-amber-400 font-semibold capitalize">{tribe}</span>
            </div>
            <select
              value={tribe}
              onChange={(e) => setTribe(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              {tribesList.map((t) => (
                <option key={t} value={t}>
                  {t === 'all' ? 'All Tribes & Backgrounds' : t}
                </option>
              ))}
            </select>
          </div>

          {/* ADVANCED SECTION: Religion */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Religion
              </label>
              <span className="text-xs text-orange-400 font-semibold capitalize">{religion}</span>
            </div>
            <select
              value={religion}
              onChange={(e) => setReligion(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              {religionsList.map((r) => (
                <option key={r} value={r}>
                  {r === 'all' ? 'Open to All Beliefs' : r}
                </option>
              ))}
            </select>
          </div>

          {/* ADVANCED SECTION: Minimum Height */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Minimum Height
              </label>
              <span className="text-xs font-bold text-orange-400">{minHeightCm} cm (~{Math.round(minHeightCm / 2.54 / 12)}' {Math.round(minHeightCm / 2.54) % 12}")</span>
            </div>
            <input
              type="range"
              min="150"
              max="200"
              step="1"
              value={minHeightCm}
              onChange={(e) => setMinHeightCm(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          {/* Granular Relationship Goals */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Relationship Goals
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'all', label: 'All Intentions' },
                { id: 'marriage', label: '💍 Marriage-Minded' },
                { id: 'serious', label: '❤️ Serious Relationship' },
                { id: 'casual', label: '🍹 Casual Dating' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLookingFor(opt.id as any)}
                  className={`py-2 px-3 rounded-xl font-medium text-left transition-all border ${
                    lookingFor === opt.id
                      ? 'bg-orange-600/20 border-orange-500 text-orange-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Only Filter */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div>
              <p className="text-xs font-bold text-white">Naija Verified Only</p>
              <p className="text-[11px] text-slate-400">Only see profiles that passed selfie checks</p>
            </div>
            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`w-10 h-6 rounded-full p-1 transition-colors ${
                verifiedOnly ? 'bg-orange-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  verifiedOnly ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-3 border-t border-slate-800 shrink-0">
          <button
            onClick={handleApply}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply All Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
