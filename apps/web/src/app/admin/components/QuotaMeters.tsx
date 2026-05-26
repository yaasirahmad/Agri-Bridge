import { BarChart3 } from 'lucide-react';

interface QuotaMetersProps {
  groqQuota: number;
  geminiQuota: number;
  cohereQuota: number;
}

export default function QuotaMeters({
  groqQuota,
  geminiQuota,
  cohereQuota,
}: QuotaMetersProps) {
  return (
    <div className="bg-white rounded-2xl border border-brand-green/10 p-5 shadow-md" id="api-quotas-card">
      <div className="flex items-center gap-2 border-b border-brand-cream pb-3 mb-4">
        <BarChart3 className="w-5 h-5 text-brand-gold" />
        <h4 className="font-serif font-bold text-brand-green text-md">API Usage</h4>
      </div>

      <div className="space-y-4" id="quota-bars-container">
        {/* Groq API bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-brand-charcoal">Chat Service <span className="text-[10px] text-brand-muted font-normal">(Advisor)</span></span>
            <span className="font-mono font-bold text-brand-green">{groqQuota.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-brand-cream h-2.5 rounded-full overflow-hidden border border-brand-green/5">
            <div
              className="bg-brand-green h-full rounded-full transition-all duration-300"
              style={{ width: `${groqQuota}%` }}
            ></div>
          </div>
          <span className="text-[9px] text-brand-muted font-mono block mt-0.5 select-none">Speed Rate-limit: 120 RPM remaining</span>
        </div>

        {/* Gemini API bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-brand-charcoal">Document Processing <span className="text-[10px] text-brand-muted font-normal">(Certificates)</span></span>
            <span className="font-mono font-bold text-brand-green">{geminiQuota.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-brand-cream h-2.5 rounded-full overflow-hidden border border-brand-green/5">
            <div
              className="bg-[#1a73e8] h-full rounded-full transition-all duration-300"
              style={{ width: `${geminiQuota}%` }}
            ></div>
          </div>
          <span className="text-[9px] text-brand-muted font-mono block mt-0.5 select-none">Token credits: 4.8M of 10M remaining</span>
        </div>

        {/* Cohere API bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-brand-charcoal">Search Service <span className="text-[10px] text-brand-muted font-normal">(Supplier Matching)</span></span>
            <span className="font-mono font-bold text-brand-green">{cohereQuota.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-brand-cream h-2.5 rounded-full overflow-hidden border border-brand-green/5">
            <div
              className="bg-brand-gold h-full rounded-full transition-all duration-300"
              style={{ width: `${cohereQuota}%` }}
            ></div>
          </div>
          <span className="text-[9px] text-brand-muted font-mono block mt-0.5 select-none">Vector Search tier: 1.2M queries remaining</span>
        </div>
      </div>
    </div>
  );
}
