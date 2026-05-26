import { Sprout, Droplets, Award, MessageSquare } from 'lucide-react';
import { CropSubmission } from '../../../types';

interface MetricsBannerProps {
  cropLogs: CropSubmission[];
}

export default function MetricsBanner({ cropLogs }: MetricsBannerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="sdg-metric-banner">
      <div className="bg-brand-green text-brand-cream rounded-xl p-4 border border-brand-gold/20 shadow-sm flex items-center justify-between" id="stat-active-yields">
        <div>
          <p className="text-[10px] text-brand-gold font-sans uppercase tracking-wider font-semibold">Average Yield</p>
          <h4 className="text-xl font-serif font-bold mt-1">4.2 t/acre</h4>
          <p className="text-[10px] text-brand-cream/60 mt-0.5">Avg: 3.1 t/a</p>
        </div>
        <div className="p-2 bg-brand-cream/10 rounded-lg">
          <Sprout className="w-5 h-5 text-brand-gold" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-brand-green/10 shadow-sm flex items-center justify-between" id="stat-sustainability-rating">
        <div>
          <p className="text-[10px] text-brand-muted font-sans uppercase tracking-wider font-semibold">Sustainability Score</p>
          <h4 className="text-xl font-serif font-bold text-brand-green mt-1">92 / 100</h4>
          <p className="text-[10px] text-brand-muted mt-0.5">Min Required: 80</p>
        </div>
        <div className="p-2 bg-brand-cream rounded-lg border border-brand-green/10">
          <Droplets className="w-5 h-5 text-brand-green" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-brand-gold/30 shadow-sm flex items-center justify-between" id="stat-active-listings">
        <div>
          <p className="text-[10px] text-brand-gold font-sans uppercase tracking-wider font-semibold">Active Listings</p>
          <h4 className="text-xl font-serif font-bold text-brand-green mt-1">{cropLogs.length} Listings</h4>
          <p className="text-[10px] text-brand-muted mt-0.5">Live Pipeline Queue</p>
        </div>
        <div className="p-2 bg-brand-cream rounded-lg border border-brand-gold/20">
          <Award className="w-5 h-5 text-brand-gold" />
        </div>
      </div>

      <div className="bg-brand-green text-brand-cream rounded-xl p-4 border border-brand-gold/20 shadow-sm flex items-center justify-between" id="stat-buyer-inquiries">
        <div>
          <p className="text-[10px] text-brand-gold font-sans uppercase tracking-wider font-semibold">Buyer Inquiries</p>
          <h4 className="text-xl font-serif font-bold mt-1">5 Leads</h4>
          <p className="text-[10px] text-brand-cream/60 mt-0.5">Matched Buyers</p>
        </div>
        <div className="p-2 bg-brand-cream/10 rounded-lg">
          <MessageSquare className="w-5 h-5 text-brand-gold" />
        </div>
      </div>
    </div>
  );
}
