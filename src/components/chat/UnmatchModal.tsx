import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { UserX, X, AlertTriangle } from 'lucide-react';

interface UnmatchModalProps {
  user: UserProfile;
  onClose: () => void;
  onConfirmUnmatch: (reason?: string) => void;
}

export const UnmatchModal: React.FC<UnmatchModalProps> = ({
  user,
  onClose,
  onConfirmUnmatch,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('No spark / connection');

  const reasons = [
    'No spark / connection',
    'Different relationship intentions',
    'Distance is too far (traffic/relocation)',
    'Inappropriate behavior or message',
    'Found someone special',
    'Prefer not to say',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-slate-100 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-3">
          <UserX className="w-6 h-6" />
        </div>

        <h3 className="text-center text-base font-bold text-white">
          Unmatch {user.name}?
        </h3>
        <p className="text-center text-xs text-slate-400 mt-1 mb-4">
          This conversation and match will disappear from both of your accounts.
        </p>

        <div className="space-y-1.5 mb-5 max-h-48 overflow-y-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Why do you want to unmatch? (Optional)
          </span>
          {reasons.map((r, i) => (
            <label
              key={i}
              className={`flex items-center gap-2 p-2 rounded-xl text-xs cursor-pointer transition-colors border ${
                selectedReason === r
                  ? 'bg-slate-800 border-orange-500 text-white'
                  : 'bg-slate-850/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <input
                type="radio"
                name="unmatchReason"
                checked={selectedReason === r}
                onChange={() => setSelectedReason(r)}
                className="accent-orange-500"
              />
              <span>{r}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirmUnmatch(selectedReason)}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
          >
            Confirm Unmatch
          </button>
        </div>
      </div>
    </div>
  );
};
