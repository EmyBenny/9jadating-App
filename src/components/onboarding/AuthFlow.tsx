import React, { useState } from 'react';
import { UserProfile, Gender, InterestedIn, LookingFor } from '../../types';
import { NIGERIAN_CITIES } from '../../data/mockProfiles';
import { 
  Flame, Phone, ShieldCheck, ArrowRight, CheckCircle2, 
  MapPin, Camera, AlertCircle, RefreshCw 
} from 'lucide-react';

interface AuthFlowProps {
  onComplete: (user: UserProfile) => void;
  onCancel?: () => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onComplete, onCancel }) => {
  const [stage, setStage] = useState<'phone' | 'otp' | 'profile_basic' | 'profile_photos' | 'profile_intent'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [carrier, setCarrier] = useState<string>('Detecting...');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Profile Setup State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<Gender>('male');
  const [interestedIn, setInterestedIn] = useState<InterestedIn>('women');
  const [lookingFor, setLookingFor] = useState<LookingFor>('serious');
  const [bio, setBio] = useState('Product manager in Lagos. Love good food, afrobeats, and intentional dating.');
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    '/src/assets/images/tender_profile_tunde_1794170320457.jpg',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  ]);

  // Handle Nigerian phone input formatting
  const handlePhoneChange = (val: string) => {
    setPhoneNumber(val);
    setErrorMsg('');
    const clean = val.replace(/\D/g, '');
    let prefix = '';
    if (clean.startsWith('0')) {
      prefix = clean.substring(1, 4);
    } else if (clean.startsWith('234')) {
      prefix = clean.substring(3, 6);
    }

    if (['803', '806', '703', '706', '813', '816', '810', '814', '903', '906', '913', '916'].includes(prefix)) {
      setCarrier('MTN Nigeria 🟡');
    } else if (['802', '808', '708', '812', '701', '902', '901', '907', '912'].includes(prefix)) {
      setCarrier('Airtel Nigeria 🔴');
    } else if (['805', '807', '705', '815', '811', '905', '915'].includes(prefix)) {
      setCarrier('Glo Nigeria 🟢');
    } else if (['809', '818', '817', '909', '908'].includes(prefix)) {
      setCarrier('9mobile ⚪');
    } else {
      setCarrier(val.length > 5 ? 'Nigerian Mobile (+234)' : '');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMsg('Please enter a valid 10 or 11 digit Nigerian phone number');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStage('otp');
      // Pre-fill simulated OTP for instant testing ease
      setOtpCode(['7', '3', '8', '2', '9', '4']);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStage('profile_basic');
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setName('Bayo');
      setStage('profile_basic');
    }, 600);
  };

  const handleFinishProfile = () => {
    const loc = NIGERIAN_CITIES[selectedCityIndex];
    const newUser: UserProfile = {
      id: 'user_me_' + Date.now(),
      name: name || 'Bayo',
      age: Number(age) || 25,
      gender,
      phoneNumber: `+234 ${phoneNumber.slice(-10)}`,
      photos: uploadedPhotos,
      bio: bio || 'Living life with good energy in Nigeria. Looking for my person.',
      location: loc,
      distanceKm: 0,
      interestedIn,
      lookingFor,
      verified: true,
      occupation: 'Creative & Tech Professional',
      education: 'University of Lagos',
      interests: ['Afrobeats', 'Tech & Startups', 'Food & Dining', 'Fitness'],
      isOnline: true,
      lastSeen: 'Active now',
    };
    onComplete(newUser);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 p-5 overflow-y-auto justify-center max-w-md mx-auto w-full">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-orange-600/30 mb-3">
          <Flame className="w-8 h-8 fill-white" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Tender</h1>
        <p className="text-xs text-orange-400 font-semibold tracking-wide">
          Find who dey enter your eye ✨
        </p>
      </div>

      {/* STAGE 1: Phone Login */}
      {stage === 'phone' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Enter Mobile Number</h2>
            <p className="text-xs text-slate-400 mt-1">
              We'll send you a 6-digit verification code. No password wahala.
            </p>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Nigerian Phone (+234)
              </label>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden focus-within:border-orange-500 transition-colors">
                <span className="px-3.5 py-3 text-xs font-bold text-slate-300 bg-slate-800/80 border-r border-slate-700 flex items-center gap-1">
                  <span>🇳🇬 +234</span>
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="0803 123 4567"
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
                  autoFocus
                />
              </div>
              {carrier && (
                <span className="text-[11px] text-amber-400/90 font-medium mt-1 block">
                  {carrier}
                </span>
              )}
              {errorMsg && (
                <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || phoneNumber.length < 9}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 shadow-lg shadow-orange-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send OTP Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative bg-slate-900 px-3 text-[11px] text-slate-500 uppercase">
              Or continue with
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      )}

      {/* STAGE 2: OTP Verification */}
      {stage === 'otp' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-orange-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>SMS Code Sent</span>
            </div>
            <h2 className="text-lg font-bold text-white">Verify Your Number</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter the 6-digit code sent to <strong className="text-slate-200">{phoneNumber || '+234 803...'}</strong>
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex justify-between gap-1.5">
              {otpCode.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const next = [...otpCode];
                    next[i] = e.target.value;
                    setOtpCode(next);
                  }}
                  className="w-11 h-12 rounded-xl bg-slate-800 border border-slate-700 text-center text-lg font-bold text-white focus:outline-none focus:border-orange-500"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>Confirm & Set Up Profile</span>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <button
                type="button"
                onClick={() => setStage('phone')}
                className="hover:text-slate-200"
              >
                Change number
              </button>
              <button
                type="button"
                onClick={() => setOtpCode(['8', '1', '4', '9', '2', '0'])}
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                Resend SMS / WhatsApp
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STAGE 3: Profile Basic Info */}
      {stage === 'profile_basic' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Step 1 of 3</span>
            <h2 className="text-lg font-bold text-white">Who are you?</h2>
            <p className="text-xs text-slate-400">Your profile name and age appear on your card.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">First Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bayo, Chioma, Tunde"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Age ({age} years)</label>
              <input
                type="range"
                min="18"
                max="50"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Your Gender</label>
              <div className="grid grid-cols-2 gap-2">
                {(['male', 'female'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 text-xs font-bold capitalize rounded-xl border transition-colors ${
                      gender === g ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStage('profile_photos')}
              disabled={!name.trim()}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <span>Next: Add Photos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: Photos Upload (Min 2, Max 6) */}
      {stage === 'profile_photos' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Step 2 of 3</span>
            <h2 className="text-lg font-bold text-white">Add Your Best Photos</h2>
            <p className="text-xs text-slate-400">At least 2 clear photos. Show your smile and your vibe!</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {uploadedPhotos.map((photo, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <img src={photo} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                  #{i + 1}
                </span>
              </div>
            ))}
            {uploadedPhotos.length < 6 && (
              <button
                type="button"
                onClick={() => {
                  setUploadedPhotos([...uploadedPhotos, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80']);
                }}
                className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-700 hover:border-orange-500 flex flex-col items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Camera className="w-5 h-5 mb-1 text-orange-400" />
                <span className="text-[10px] font-medium">+ Add Photo</span>
              </button>
            )}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setStage('profile_basic')}
              className="py-3 px-4 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
            >
              Back
            </button>
            <button
              onClick={() => setStage('profile_intent')}
              disabled={uploadedPhotos.length < 2}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <span>Next: City & Intent</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5: Location, Intent & Complete */}
      {stage === 'profile_intent' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Step 3 of 3</span>
            <h2 className="text-lg font-bold text-white">Location & Intentions</h2>
            <p className="text-xs text-slate-400">Match with people looking for the same vibe as you.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">
                Your Primary Nigerian City / Area
              </label>
              <select
                value={selectedCityIndex}
                onChange={(e) => setSelectedCityIndex(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                {NIGERIAN_CITIES.map((c, i) => (
                  <option key={i} value={i}>
                    {c.city} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Interested in</label>
              <div className="grid grid-cols-3 gap-2">
                {(['women', 'men', 'everyone'] as InterestedIn[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setInterestedIn(opt)}
                    className={`py-2 text-xs font-bold capitalize rounded-xl border transition-colors ${
                      interestedIn === opt ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">What are you looking for?</label>
              <select
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value as LookingFor)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="serious">💍 Serious Relationship (Long term)</option>
                <option value="casual">🍹 Casual Dating (No pressure)</option>
                <option value="friendship">🤝 Friendship & Networking</option>
                <option value="open">✨ Open to Possibilities</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Bio (Short Naija Intro)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="Give a short preview of your personality..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              onClick={handleFinishProfile}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Oya! Enter Tender</span>
            </button>
          </div>
        </div>
      )}

      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-4 text-center text-xs text-slate-400 hover:text-white"
        >
          Back to Demo
        </button>
      )}
    </div>
  );
};
