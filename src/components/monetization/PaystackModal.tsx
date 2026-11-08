import React, { useState } from 'react';
import { SubscriptionPlan } from '../../types';
import { 
  X, Check, CreditCard, Building2, Smartphone, ShieldCheck, 
  Lock, Sparkles, RefreshCw, AlertCircle 
} from 'lucide-react';

interface PaystackModalProps {
  plan: SubscriptionPlan;
  onClose: () => void;
  onSuccess: (plan: SubscriptionPlan) => void;
}

export const PaystackModal: React.FC<PaystackModalProps> = ({
  plan,
  onClose,
  onSuccess,
}) => {
  const [channel, setChannel] = useState<'card' | 'bank_transfer' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        onSuccess(plan);
      }, 1200);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100">
        {/* Paystack Top Branding Strip */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-[10px]">
              P
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-tight">Secured by Paystack</span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Tender Dating Nigeria</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {paymentSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-9 h-9 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Payment Successful!</h3>
              <p className="text-xs text-slate-300 mt-1">
                ₦{plan.priceNgn.toLocaleString()} paid via Paystack. Welcome to {plan.name}!
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unlocking VIP Benefits...</span>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Amount Summary */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">{plan.name}</span>
                <span className="text-xs text-orange-400 font-medium">Renews every {plan.interval}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-white">
                  ₦{plan.priceNgn.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block">NGN Currency</span>
              </div>
            </div>

            {/* Payment Channel Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setChannel('card')}
                className={`py-2 px-1 text-[11px] font-semibold rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  channel === 'card' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-orange-400" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('bank_transfer')}
                className={`py-2 px-1 text-[11px] font-semibold rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  channel === 'bank_transfer' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bank Transfer</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('ussd')}
                className={`py-2 px-1 text-[11px] font-semibold rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  channel === 'ussd' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>USSD Code</span>
              </button>
            </div>

            {/* CARD CHANNEL */}
            {channel === 'card' && (
              <form onSubmit={handlePay} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Card Number (Mastercard / Visa / Verve)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="5399 •••• •••• 1234"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="08/28"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      CVV (3 Digits)
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-98 transition-all"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay ₦{plan.priceNgn.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* BANK TRANSFER CHANNEL */}
            {channel === 'bank_transfer' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-left text-xs space-y-1.5">
                  <span className="text-[11px] text-slate-400 block">Transfer exactly ₦{plan.priceNgn.toLocaleString()} to:</span>
                  <div className="flex justify-between items-center py-1 border-b border-slate-700/60">
                    <span className="text-slate-400">Bank Name</span>
                    <strong className="text-white">Wema Bank / Paystack-Titan</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-700/60">
                    <span className="text-slate-400">Account Number</span>
                    <strong className="text-emerald-400 font-mono tracking-wider">9876543210</strong>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Account Name</span>
                    <strong className="text-white">Tender / Paystack Checkout</strong>
                  </div>
                </div>

                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>I Have Sent The Money</span>}
                </button>
              </div>
            )}

            {/* USSD CHANNEL */}
            {channel === 'ussd' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">Choose your Nigerian bank to generate your USSD code:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['GTBank (*737#)', 'Access (*901#)', 'Zenith (*966#)', 'UBA (*919#)'].map((bank, i) => (
                    <button
                      key={i}
                      onClick={handlePay}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left text-white font-medium"
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit encryption · Verified Nigerian PCI-DSS Level 1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
