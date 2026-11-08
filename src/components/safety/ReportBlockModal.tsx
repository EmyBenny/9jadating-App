import React, { useState } from 'react';
import { UserProfile, ReportPayload } from '../../types';
import { ShieldAlert, AlertTriangle, UserX, X, Check } from 'lucide-react';

interface ReportBlockModalProps {
  targetUser: UserProfile | null;
  onClose: () => void;
  onSubmitReport: (report: ReportPayload, blockUser: boolean) => void;
}

export const ReportBlockModal: React.FC<ReportBlockModalProps> = ({
  targetUser,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState<ReportPayload['reason']>('catfish');
  const [details, setDetails] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(true);

  if (!targetUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(
      {
        targetUserId: targetUser.id,
        reason,
        details,
        timestamp: Date.now(),
      },
      alsoBlock
    );
    onClose();
  };

  const reportReasons: { id: ReportPayload['reason']; label: string; desc: string }[] = [
    { id: 'catfish', label: 'Catfish / Fake Profile', desc: 'Photos do not match the real person or impersonation.' },
    { id: 'scam', label: 'Urgent 2K / Begging for Money', desc: 'Soliciting cash, crypto, bank transfers, or investment schemes.' },
    { id: 'inappropriate', label: 'Inappropriate Content / Behavior', desc: 'Lewd or unsolicited explicit content without consent.' },
    { id: 'harassment', label: 'Harassment or Threats', desc: 'Abusive language, stalking, or hostile communication.' },
    { id: 'underage', label: 'Underage User', desc: 'User appears under 18 years of age.' },
    { id: 'other', label: 'Other Safety Concerns', desc: 'Any other safety or security violation.' },
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

        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-bold text-white">Report & Block {targetUser.name}</h3>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Tender takes community safety seriously. Your report is 100% confidential.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Reason for reporting
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {reportReasons.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer transition-colors ${
                    reason === r.id
                      ? 'bg-rose-950/30 border-rose-500 text-white'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={reason === r.id}
                    onChange={() => setReason(r.id)}
                    className="mt-1 accent-rose-500"
                  />
                  <div>
                    <span className="text-xs font-semibold block">{r.label}</span>
                    <span className="text-[10px] text-slate-400 block">{r.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Tell our trust & safety team what happened..."
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-400" />
              <span className="text-xs text-slate-200">Also block {targetUser.name} immediately</span>
            </div>
            <input
              type="checkbox"
              checked={alsoBlock}
              onChange={(e) => setAlsoBlock(e.target.checked)}
              className="accent-rose-500 w-4 h-4 rounded"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
