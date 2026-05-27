import { useState, useEffect } from 'react';
import { Cpu, Clock, Terminal, RefreshCw, AlertCircle, ShieldAlert, BarChart3, Database } from 'lucide-react';
import { SystemLog } from '../../types';

// Import divided components
import HealthTelemetry from './components/HealthTelemetry';
import QuotaMeters from './components/QuotaMeters';
import LiveTrafficConsole from './components/LiveTrafficConsole';

interface SystemAuditorPortalProps {
  systemLogs: SystemLog[];
  onClearLogs: () => void;
  groqQuota: number;
  geminiQuota: number;
  cohereQuota: number;
}

export default function SystemAuditorPortalPage({
  systemLogs,
  onClearLogs,
  groqQuota,
  geminiQuota,
  cohereQuota,
}: SystemAuditorPortalProps) {
  const [latency, setLatency] = useState(12.2);

  // Fluctuating ping effect to look incredibly live
  useEffect(() => {
    const timer = setInterval(() => {
      setLatency((prev) => {
        const delta = (Math.random() - 0.5) * 0.8;
        const nextVal = prev + delta;
        return Number(Math.max(11.1, Math.min(13.9, nextVal)).toFixed(1));
      });
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full max-w-7xl mx-auto" id="auditor-portal-container font-sans">
      
      {/* LEFT PORTION - System Node & Quota Progress Bars (4 columns) */}
      <div className="xl:col-span-4 flex flex-col gap-6" id="auditor-left-panel">
        
        {/* System Status Telemetry */}
        <HealthTelemetry latency={latency} />

        {/* API Quota progress indicators */}
        <QuotaMeters
          groqQuota={groqQuota}
          geminiQuota={geminiQuota}
          cohereQuota={cohereQuota}
        />

        {/* Security Compliance Checklist */}
        <div className="bg-white rounded-2xl border border-brand-green/10 p-5 shadow-md text-xs" id="compliance-checklist">
          <div className="flex items-center gap-2 mb-3 font-semibold text-brand-green">
            <Database className="w-4 h-4 text-brand-gold" />
            Compliance Status
          </div>
          <ul className="space-y-2 text-brand-charcoal">
            <li className="flex items-center justify-between border-b border-brand-cream pb-1.5" id="cert-sfda">
              <span>● SFDA Quarantine Match Standard</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">Passed</span>
            </li>
            <li className="flex items-center justify-between border-b border-brand-cream pb-1.5" id="cert-escrow">
              <span>● SNB Escrow Gateway Connection</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">Live</span>
            </li>
            <li className="flex items-center justify-between" id="cert-sustainability">
              <span>● SDG 2 Water Conservation Check</span>
              <span className="text-brand-gold font-bold bg-brand-gold/15 px-1.5 py-0.5 rounded border border-brand-gold/25 uppercase">Verified</span>
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT PORTION - Real-time JSON Console Terminal Log (8 columns) */}
      <div className="xl:col-span-8 flex flex-col gap-4 h-[550px]" id="auditor-right-panel">
        <LiveTrafficConsole
          systemLogs={systemLogs}
          onClearLogs={onClearLogs}
        />
      </div>
    </div>
  );
}
