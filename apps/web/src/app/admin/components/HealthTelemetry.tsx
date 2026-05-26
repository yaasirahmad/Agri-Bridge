import { Cpu } from 'lucide-react';

interface HealthTelemetryProps {
  latency: number;
}

export default function HealthTelemetry({ latency }: HealthTelemetryProps) {
  return (
    <div className="bg-brand-green text-brand-cream rounded-2xl p-5 border border-brand-gold/30 shadow-md relative overflow-hidden" id="edge-node-card">
      <div className="absolute right-[-15px] top-[-15px] w-24 h-24 bg-brand-cream/5 rounded-full border border-brand-cream/5 pointer-events-none"></div>
      
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-5 h-5 text-brand-gold" />
        <h4 className="font-serif font-bold text-md text-brand-cream">System Status</h4>
      </div>

      <div className="space-y-4" id="edge-routing-stats">
        <div className="flex items-center justify-between" id="edge-node-routing">
          <span className="text-xs text-brand-cream/75">Servers:</span>
          <span className="text-xs font-bold text-brand-gold bg-brand-cream/10 px-2 py-0.5 rounded border border-brand-gold/20 select-none">
            Online
          </span>
        </div>

        <div className="border-t border-brand-cream/10 pt-3 flex items-center justify-between" id="edge-latency-status">
          <span className="text-xs text-brand-cream/75">Tunnel Latency (RTT):</span>
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-emerald-400 select-none">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            {latency} ms
          </div>
        </div>

        <div className="border-t border-brand-cream/10 pt-3 flex items-center justify-between" id="edge-ssl-routing">
          <span className="text-xs text-brand-cream/75">Security:</span>
          <span className="text-xs font-bold text-emerald-400 select-none">Encrypted</span>
        </div>
      </div>
    </div>
  );
}
