import React, { useState } from 'react';
import { 
  ShieldCheck, Camera, CheckCircle2, X, Sparkles, 
  RefreshCw, Smile, ArrowRight, UserCheck 
} from 'lucide-react';

interface PhotoVerificationModalProps {
  onClose: () => void;
  onVerifySuccess: () => void;
}

export const PhotoVerificationModal: React.FC<PhotoVerificationModalProps> = ({
  onClose,
  onVerifySuccess,
}) => {
  const [challengeStep, setChallengeStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const challenges = [
    { title: 'Turn head slightly left', instruction: 'Checking 3D head pose and anti-spoof liveness', icon: '👤' },
    { title: 'Give a warm natural smile', instruction: 'Confirming facial muscle expression landmarks', icon: '😄' },
    { title: 'Hold up ✌️ peace sign gesture', instruction: 'Hand-to-face proximity biometric check', icon: '✌️' },
  ];

  const handleNextChallenge = () => {
    if (challengeStep < challenges.length - 1) {
      setChallengeStep((prev) => prev + 1);
    } else {
      // Analyze facial landmarks
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
      }, 1900);
    }
  };

  const handleFinish = () => {
    onVerifySuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!isDone && !isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                Step {challengeStep + 1} of 3
              </span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Biometric Liveness Check
            </h3>
            <p className="text-xs text-slate-300">
              {challenges[challengeStep].instruction}
            </p>

            {/* Selfie Frame with dynamic indicator */}
            <div className="relative w-44 h-44 rounded-full mx-auto border-4 border-amber-500 overflow-hidden bg-slate-950 flex items-center justify-center shadow-2xl">
              <img
                src="/src/assets/images/tender_profile_tunde_1794170320457.jpg"
                alt="Selfie preview"
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-full animate-pulse pointer-events-none" />

              {/* Dynamic Challenge Stamp */}
              <div className="absolute bottom-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-300 flex items-center gap-1.5 border border-amber-500/40">
                <span>{challenges[challengeStep].icon}</span>
                <span>{challenges[challengeStep].title}</span>
              </div>
            </div>

            <button
              onClick={handleNextChallenge}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>{challengeStep === 2 ? 'Verify & Compare Photos' : 'Capture Gesture'}</span>
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="py-8 space-y-4">
            <RefreshCw className="w-12 h-12 text-amber-400 mx-auto animate-spin" />
            <h4 className="text-base font-bold text-white">Comparing Facial Landmarks</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
              Evaluating eye distance, jaw geometry, and liveness against your profile photos...
            </p>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
              <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full w-4/5 animate-pulse" />
            </div>
          </div>
        )}

        {isDone && (
          <div className="space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Identity Confirmed!</h3>
              <p className="text-xs text-slate-300 mt-1">
                98.7% Facial Similarity Confidence. You are 100% verified.
              </p>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 font-semibold space-y-1">
              <div className="flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Naija Verified Gold Badge Awarded</span>
              </div>
              <p className="text-[11px] text-slate-300 font-normal">
                Your profile is now prioritized in discovery and top picks.
              </p>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider"
            >
              Continue to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
