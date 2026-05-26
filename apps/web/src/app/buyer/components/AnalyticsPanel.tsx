import { Layers, CheckCircle, Sparkles } from 'lucide-react';

export default function AnalyticsPanel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="saudi-enterprise-analytics">
      
      {/* Card 1: Active Listings */}
      <div className="bg-brand-green text-brand-cream rounded-xl p-5 border border-brand-gold/20 shadow-sm flex items-center justify-between" id="analytics-active-listings">
        <div>
          <p className="text-xs text-brand-gold font-sans uppercase tracking-wider font-semibold">Active Supply Listings</p>
          <h4 className="text-2xl font-serif font-bold mt-1">24 Active Listings</h4>
          <p className="text-xs text-brand-cream/70 mt-1">From verified farms across Pakistan</p>
        </div>
        <div className="p-3 bg-brand-cream/10 rounded-lg">
          <Layers className="w-6 h-6 text-brand-gold" />
        </div>
      </div>

      {/* Card 2: Average Price Per Ton + Sparkline */}
      <div className="bg-white rounded-xl p-5 border border-brand-green/10 shadow-sm flex flex-col justify-between" id="analytics-average-price">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-brand-muted font-sans uppercase tracking-wider font-semibold">Average FOB Price</p>
            <h4 className="text-2xl font-serif font-bold text-brand-green mt-1">$490 / Ton</h4>
          </div>
          <div className="mt-1 flex flex-col items-end">
            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-200">-5.4%</span>
            <span className="text-[9px] text-brand-muted font-sans mt-0.5">30d Trend</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-brand-cream pt-2.5">
          <span className="text-[10px] text-brand-muted">Market Volatility Low</span>
          <svg className="w-20 h-6 stroke-brand-gold fill-none stroke-[2]" viewBox="0 0 100 30">
            <path d="M 0,25 Q 15,22 30,10 T 60,18 T 100,5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Card 3: Compliance Rate */}
      <div className="bg-white rounded-xl p-5 border border-brand-gold/30 shadow-sm flex items-center justify-between" id="analytics-compliance-rate">
        <div>
          <p className="text-xs text-brand-gold font-sans uppercase tracking-wider font-semibold">Verified Compliance</p>
          <h4 className="text-2xl font-serif font-bold text-brand-green mt-1">94.2% Rate</h4>
          <p className="text-xs text-brand-muted mt-1">SFDA Quarantine Cleared</p>
        </div>
        <div className="p-3 bg-brand-cream rounded-lg border border-brand-gold/20">
          <CheckCircle className="w-6 h-6 text-brand-gold" />
        </div>
      </div>

      {/* Card 4: Seasonal Availability Forecast */}
      <div className="bg-brand-green text-brand-cream rounded-xl p-5 border border-brand-gold/20 shadow-sm flex items-center justify-between" id="analytics-seasonal-forecast">
        <div>
          <p className="text-xs text-brand-gold font-sans uppercase tracking-wider font-semibold">Seasonal Forecast</p>
          <h4 className="text-2xl font-serif font-bold mt-1">Oct - Jan Peak</h4>
          <p className="text-[11px] text-brand-cream/80 mt-1 font-sans">
            Rice: <span className="text-brand-gold font-semibold">High Vol</span> | Dates: <span className="text-emerald-400 font-semibold">Stable</span>
          </p>
        </div>
        <div className="p-3 bg-brand-cream/10 rounded-lg">
          <Sparkles className="w-6 h-6 text-brand-gold" />
        </div>
      </div>

    </div>
  );
}
