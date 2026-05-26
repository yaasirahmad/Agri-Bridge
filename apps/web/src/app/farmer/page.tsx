import { Sprout, Droplets, Award } from 'lucide-react';
import { CropSubmission, ChatMessage } from '../../types';

// Import divided components
import MetricsBanner from './components/MetricsBanner';
import CropLogForm from './components/CropLogForm';
import ZiraatChatPanel from './components/ZiraatChatPanel';
import DocumentUploader from './components/DocumentUploader';

interface FarmerPortalProps {
  cropLogs: CropSubmission[];
  onAddCrop: (crop: CropSubmission) => void;
  triggerNotification: (message: string, type: 'success' | 'info') => void;
  onLogSystemActivity: (api: string, method: string, endpoint: string, payload: string) => void;
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isBotTyping: boolean;
}

export default function FarmerPortalPage({
  cropLogs,
  onAddCrop,
  triggerNotification,
  onLogSystemActivity,
  chatMessages,
  onSendMessage,
  isBotTyping,
}: FarmerPortalProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full max-w-7xl mx-auto" id="farmer-portal-container">
      {/* LEFT PORTION - Form, Stats & Document Upload */}
      <div className="xl:col-span-7 flex flex-col gap-6" id="farmer-left-panel">
        
        {/* Metric Banner: Clean SDG-Aligned Stat Cards */}
        <MetricsBanner cropLogs={cropLogs} />

        {/* Dynamic Crop Log Form */}
        <CropLogForm
          onAddCrop={onAddCrop}
          triggerNotification={triggerNotification}
          onLogSystemActivity={onLogSystemActivity}
        />

        {/* SDG 2 Bilateral Document Upload & Verification */}
        <DocumentUploader
          triggerNotification={triggerNotification}
          onLogSystemActivity={onLogSystemActivity}
        />

        {/* Local Crop Inventory Table */}
        <div className="bg-white rounded-2xl border border-brand-green/10 p-6 shadow-md" id="farmer-inventory-table">
          <div className="flex justify-between items-center mb-4 border-b border-brand-cream pb-3">
            <h4 className="font-serif font-bold text-brand-green text-lg">My Registered Crops</h4>
            <span className="text-xs bg-brand-cream border border-brand-green/10 text-brand-green font-bold px-2.5 py-1 rounded-full">
              {cropLogs.length} Registered Lots
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-green/10 text-brand-muted text-xs font-sans uppercase">
                  <th className="py-2.5 pb-2 font-bold select-none">ID</th>
                  <th className="py-2.5 pb-2 font-bold select-none">Crop / Entity</th>
                  <th className="py-2.5 pb-2 font-bold select-none">Domestic Location</th>
                  <th className="py-2.5 pb-2 font-bold text-right select-none">Qty (Tons)</th>
                  <th className="py-2.5 pb-2 font-bold text-center select-none">Water Saved</th>
                  <th className="py-2.5 pb-2 font-bold text-center select-none">SDG Index</th>
                  <th className="py-2.5 pb-2 font-bold text-right select-none">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream text-sm">
                {cropLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-brand-cream/50 transition-colors">
                    <td className="py-3 items-center font-mono text-xs font-semibold text-brand-gold">{log.id}</td>
                    <td className="py-3">
                      <div className="font-semibold text-brand-charcoal">{log.cropName}</div>
                      <div className="text-xs text-brand-muted">By {log.farmerName}</div>
                    </td>
                    <td className="py-3 text-brand-charcoal font-sans text-xs">{log.location}</td>
                    <td className="py-3 text-right font-mono font-bold text-brand-green">{log.quantityTons} t</td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        <Droplets className="w-3 h-3 text-green-500" />
                        {log.waterSavingsPct}%
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-block text-xs font-bold text-brand-green bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 mr-1.5">
                        {log.sustainabilityScore}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${
                          log.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : log.status === 'In-Transit'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {log.status === 'Approved' ? '● ' : log.status === 'In-Transit' ? '⛟ ' : '⏳ '}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT PORTION - AI Agronomic Chat Assistant */}
      <div className="xl:col-span-5 flex flex-col gap-6" id="farmer-assistant-panel">
        <ZiraatChatPanel
          chatMessages={chatMessages}
          onSendMessage={onSendMessage}
          isBotTyping={isBotTyping}
        />
      </div>
    </div>
  );
}
