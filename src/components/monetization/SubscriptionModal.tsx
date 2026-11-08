import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../../data/mockProfiles';
import { SubscriptionPlan } from '../../types';
import { 
  Flame, Sparkles, Check, X, ShieldCheck, Zap, 
  RotateCcw, Eye, Heart, ArrowRight 
} from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onBuyBoost?: () => void;
  onBuySuperlikes?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  onClose,
  onSelectPlan,
  onBuyBoost,
  onBuySuperlikes,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('tender_plus_monthly');

  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-orange-500/30 rounded-3xl p-5 text-slate-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center pt-2 pb-4 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tender Plus · Nigeria</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Unlock Full Naija Dating Power
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            See who liked you, swipe with zero limits, and get 10x more matches.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Plan Cards Selector */}
          <div className="grid grid-cols-3 gap-2">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = plan.id === selectedPlanId;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-3 rounded-2xl border text-center transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-orange-950/60 to-slate-900 border-orange-500 text-white shadow-lg ring-1 ring-orange-500/50'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                  <div>
                    <span className="text-[11px] font-bold block capitalize mt-1">
                      {plan.interval}
                    </span>
                    <span className="text-sm font-black text-white block mt-1">
                      ₦{plan.priceNgn.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1">
                    {plan.id === 'tender_plus_weekly' ? '₦500/day' : plan.id === 'tender_plus_monthly' ? '₦316/day' : '₦266/day'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Key Benefits List */}
          <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-2.5">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mb-1">
              Included with {selectedPlan.name}:
            </span>
            {selectedPlan.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Quick Packs (One-time Boost / Superlikes) */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Or Try A One-Time Power Up
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={onBuyBoost}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white block">1 Hour Boost ⚡</span>
                  <span className="text-[10px] text-slate-400">10x visibility in city</span>
                </div>
                <span className="font-extrabold text-orange-400">₦1,200</span>
              </button>

              <button
                type="button"
                onClick={onBuySuperlikes}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white block">5 Superlikes ⭐</span>
                  <span className="text-[10px] text-slate-400">Stand out right now</span>
                </div>
                <span className="font-extrabold text-amber-400">₦1,500</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Checkout CTA */}
        <div className="pt-3 border-t border-slate-800 shrink-0">
          <button
            onClick={() => onSelectPlan(selectedPlan)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-orange-600/30 active:scale-98 transition-all hover:brightness-110"
          >
            <span>Continue with Paystack · ₦{selectedPlan.priceNgn.toLocaleString()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pay with Nigerian Cards (Mastercard, Visa, Verve), Bank Transfer or USSD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
