import React from 'react';
import { 
  ShieldCheck, AlertTriangle, PhoneCall, MapPin, 
  EyeOff, CheckCircle2, X, Lock, Share2 
} from 'lucide-react';

interface SafetyCenterModalProps {
  onClose: () => void;
}

export const SafetyCenterModal: React.FC<SafetyCenterModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 text-slate-100 shadow-2xl max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-bold text-white">Tender Safety Center</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs text-slate-300">
          {/* Rule 1: No Urgent 2k */}
          <div className="p-3.5 bg-rose-950/30 border border-rose-900/60 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Anti-Fraud: No Urgent 2K or Wire Transfers</span>
            </div>
            <p className="leading-relaxed">
              Never send transport fare, hospital bills, airtime, or investment funds to anyone on Tender. Real connections don't begin with financial demands. Report anyone asking for money immediately.
            </p>
          </div>

          {/* Rule 2: Public Places for First Dates */}
          <div className="p-3.5 bg-slate-800/80 border border-slate-700/60 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-orange-400 font-bold">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Public First Dates Only</span>
            </div>
            <p className="leading-relaxed">
              Always choose busy, well-lit public spots (e.g., Ikeja City Mall, The Palms Lekki, Danfo Bistro, or Jabi Lake Mall in Abuja). Avoid private apartments or isolated places for early dates.
            </p>
          </div>

          {/* Rule 3: Share Live Location */}
          <div className="p-3.5 bg-slate-800/80 border border-slate-700/60 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Share2 className="w-4 h-4 shrink-0" />
              <span>Share Location With A Friend</span>
            </div>
            <p className="leading-relaxed">
              Tell a trusted sibling or friend where you are going, who you are meeting, and share your WhatsApp 8-hour live location before heading out.
            </p>
          </div>

          {/* Rule 4: Photo Verification Trust */}
          <div className="p-3.5 bg-slate-800/80 border border-slate-700/60 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Prioritize Naija Verified Profiles</span>
            </div>
            <p className="leading-relaxed">
              Profiles with the golden <strong>Naija Verified</strong> badge have passed biometric selfie liveness checks confirming their photos match their real face.
            </p>
          </div>

          {/* Rule 5: Emergency Contacts */}
          <div className="p-3.5 bg-slate-800/80 border border-slate-700/60 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Nigerian Emergency Numbers</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Emergency Police Toll-Free: <strong>112</strong> or <strong>767</strong> (Lagos Emergency Management Agency - LASEMA).
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs"
          >
            Understood & Stay Safe
          </button>
        </div>
      </div>
    </div>
  );
};
