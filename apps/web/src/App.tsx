import { useState } from 'react';
import { Sprout, Briefcase, Activity, CheckCircle, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { CropSubmission, SupplierRow, SystemLog, ChatMessage } from './types';
import { INITIAL_CROP_LOGS, INITIAL_SYSTEM_LOGS, SUPPLIER_DATA } from './data';
import { sendChatMessage } from './lib/api-client';

// Portals
import FarmerPortal from './app/farmer/page';
import SaudiAgribusinessPortal from './app/buyer/page';
import SystemAuditorPortal from './app/admin/page';
import SmartContractModal from './components/SmartContractModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'farmer' | 'saudi' | 'audit'>('farmer');

  // Shared Core Global States
  const [cropLogs, setCropLogs] = useState<CropSubmission[]>(INITIAL_CROP_LOGS);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(INITIAL_SYSTEM_LOGS);

  // Quota Metrics
  const [groqQuota, setGroqQuota] = useState(62.0);
  const [geminiQuota, setGeminiQuota] = useState(18.0);
  const [cohereQuota, setCohereQuota] = useState(45.0);

  // Active Smart Contract Target & Modal state
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRow | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  // Elevated Soil AI Assistant Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: 'Assalamu Alaikum! Welcome to AgriBridge. I can help you with crop optimization, water management, and trade compliance. How can I assist you today?',
      timestamp: '16:51:00',
    },
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Welcome banner visibility
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);

  // Toast System State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  // Custom Toast Handler
  const triggerNotification = (message: string, type: 'success' | 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  // Helper to dynamically log new system network occurrences under Auditor log console
  const handleLogSystemActivity = (apiName: string, method: string, endpoint: string, payload: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const latencyMs = Math.floor(Math.random() * 250) + 12; // Realistic random network lag calculation

    const newLog: SystemLog = {
      id: `log-${Date.now().toString().slice(-4)}`,
      timestamp,
      apiName: apiName as any,
      method,
      endpoint,
      latencyMs,
      status: '200 OK',
      payload,
    };

    setSystemLogs((prev) => [...prev, newLog]);

    // Handle interactive memory quota metrics slightly based on API called
    if (apiName === 'Groq API') {
      setGroqQuota((q) => Math.min(100, q + 1.2));
    } else if (apiName === 'Gemini API') {
      setGeminiQuota((q) => Math.min(100, q + 2.5));
    } else if (apiName === 'Cohere.ai API') {
      setCohereQuota((q) => Math.min(100, q + 0.8));
    }
  };

  // Centralized message sending algorithm
  const handleSendChatMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setIsBotTyping(true);

    handleLogSystemActivity(
      'Groq API',
      'POST',
      '/api/chat',
      JSON.stringify({ model: 'llama-3.3-70b-versatile', query: textToSend.slice(0, 50) + '...' })
    );

    try {
      // Map chat history to standard parameter schema
      const chatParams = updatedMessages.map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant' | 'system',
        content: m.text,
      }));

      const replyText = await sendChatMessage(chatParams);

      const assistantMsg: ChatMessage = {
        id: `msg-a-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      triggerNotification('Response received from crop advisor.', 'success');
    } finally {
      setIsBotTyping(false);
    }
  };



  // Handle addition of a new crop logged from Farmer Portal
  const handleAddCrop = (newCrop: CropSubmission) => {
    setCropLogs((prev) => [newCrop, ...prev]);
  };

  // Triggering Smart Contract Generation Modal
  const handleOpenSmartContract = (supplier: SupplierRow) => {
    setSelectedSupplier(supplier);
    setIsContractModalOpen(true);
  };

  // Handle deployment signature on digital trade agreement
  const handleExecuteSmartContract = () => {
    if (!selectedSupplier) return;

    // Log smart contract execution payload
    handleLogSystemActivity(
      'Gemini API',
      'POST',
      '/v1/contracts/sign-and-deploy',
      JSON.stringify({
        status: 'SIGNED',
        contractId: `AB-2026-${selectedSupplier.id.toUpperCase()}`,
        value: selectedSupplier.pricePerTonUSD * selectedSupplier.quantityAvailableTons,
      })
    );

    // Notify state
    triggerNotification(`Agreement AB-2026-${selectedSupplier.id.toUpperCase()} signed successfully.`, 'success');
    setIsContractModalOpen(false);
  };

  const handleClearLogs = () => {
    setSystemLogs([]);
    triggerNotification('Activity log cleared.', 'info');
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal flex flex-col font-sans selection:bg-brand-gold/30 selection:text-brand-green print:bg-white" id="agribridge-root">
      
      {/* Header */}
      <header className="bg-brand-green text-brand-cream border-b border-brand-gold/30 p-5 sticky top-0 z-40 shadow-md select-none print:hidden" id="agribridge-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3.5" id="brand-identity-hub">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/15 border border-brand-gold flex items-center justify-center p-1 font-serif font-black text-brand-gold text-lg" id="header-emblem">
              A
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-white">
                AgriBridge
              </h1>
              <p className="text-xs text-brand-cream/70 font-sans mt-0.5">
                Pakistan–Saudi Arabia Agricultural Trade Platform
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-brand-cream/80" id="header-status">
            <div className="flex items-center gap-1.5 bg-brand-cream/5 px-3 py-1.5 rounded-lg border border-brand-cream/5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              <span className="text-brand-cream/70 font-sans">System Online</span>
            </div>
          </div>
          
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-brand-green/95 border-b border-brand-gold/20 py-1.5 sticky top-[84px] z-30 shadow print:hidden" id="agribridge-navigation">
        <div className="max-w-7xl mx-auto px-5 flex justify-between items-center bg-transparent gap-4">
          <div className="flex bg-brand-cream/10 rounded-xl p-1 w-full md:w-auto" id="nav-tabs-container">
            <button
              onClick={() => setActiveTab('farmer')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-2 px-6 rounded-lg font-serif text-sm font-bold transition-all ${
                activeTab === 'farmer'
                  ? 'bg-brand-cream text-brand-green shadow-md'
                  : 'text-brand-cream/70 hover:text-white hover:bg-brand-cream/5'
              }`}
            >
              <Sprout className="w-4 h-4 text-brand-gold" />
              Sell Crops
            </button>

            <button
              onClick={() => setActiveTab('saudi')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-2 px-6 rounded-lg font-serif text-sm font-bold transition-all ${
                activeTab === 'saudi'
                  ? 'bg-brand-cream text-brand-green shadow-md'
                  : 'text-brand-cream/70 hover:text-white hover:bg-brand-cream/5'
              }`}
            >
              <Briefcase className="w-4 h-4 text-brand-gold" />
              Find Suppliers
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-2 px-6 rounded-lg font-serif text-sm font-bold transition-all ${
                activeTab === 'audit'
                  ? 'bg-brand-cream text-brand-green shadow-md'
                  : 'text-brand-cream/70 hover:text-white hover:bg-brand-cream/5'
              }`}
            >
              <Activity className="w-4 h-4 text-brand-gold" />
              Activity Log
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 py-6 md:py-10 relative print:p-0 print:m-0" id="main-application-workspace">
        
        {/* Welcome Onboarding Hub */}
        {isWelcomeOpen && (
          <div className="mb-10 bg-white rounded-3xl border border-brand-green/10 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl" id="welcome-banner">
            {/* Header portion */}
            <div className="bg-gradient-to-r from-brand-green to-brand-emerald-light text-brand-cream px-8 py-6 flex justify-between items-start border-b border-brand-gold/20">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest px-2.5 py-1 bg-white/10 rounded-full select-none">
                  Overview & Onboarding
                </span>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight mt-2.5">
                  Welcome to AgriBridge
                </h2>
                <p className="text-xs md:text-sm text-brand-cream/80 font-sans mt-1.5 max-w-3xl leading-relaxed">
                  Connecting Pakistani agricultural producers with Saudi Arabian agribusiness corporate buyers. Explore the three-portal operational framework below to get started:
                </p>
              </div>
              <button
                onClick={() => setIsWelcomeOpen(false)}
                className="text-brand-cream/60 hover:text-white bg-white/5 hover:bg-white/15 px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all ml-4 shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            {/* Grid options */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-b from-[#FAF8F5]/80 to-white">
              {/* Box 1 */}
              <div className="bg-white p-5 rounded-2xl border border-brand-green/5 flex flex-col justify-between hover:border-brand-gold/45 hover:shadow-md transition-all group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-cream/50 border border-brand-green/10 flex items-center justify-center mb-3">
                    <span className="text-brand-green font-serif font-black text-sm">01</span>
                  </div>
                  <h4 className="font-serif font-bold text-brand-green text-md group-hover:text-brand-gold transition-colors">
                    Sell Crops (Farmer)
                  </h4>
                  <p className="text-xs text-brand-muted font-sans mt-1.5 leading-relaxed">
                    Designed for Pakistani producers. Register crop batches, upload phytosanitary certificates for verification, and consult the AI Crop Advisor.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('farmer')}
                  className="mt-4 text-[11px] font-bold text-brand-green hover:text-brand-gold font-sans flex items-center gap-1 transition-colors uppercase tracking-wider group-hover:translate-x-1 duration-200 cursor-pointer text-left"
                >
                  Start Listing ➔
                </button>
              </div>

              {/* Box 2 */}
              <div className="bg-white p-5 rounded-2xl border border-brand-green/5 flex flex-col justify-between hover:border-brand-gold/45 hover:shadow-md transition-all group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-cream/50 border border-brand-green/10 flex items-center justify-center mb-3">
                    <span className="text-brand-green font-serif font-black text-sm">02</span>
                  </div>
                  <h4 className="font-serif font-bold text-brand-green text-md group-hover:text-brand-gold transition-colors">
                    Find Suppliers (Buyer)
                  </h4>
                  <p className="text-xs text-brand-muted font-sans mt-1.5 leading-relaxed">
                    Designed for Saudi agribusiness importers. Search suppliers semantically, view shipping routes, and draft customized legal trade agreements.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('saudi')}
                  className="mt-4 text-[11px] font-bold text-brand-green hover:text-brand-gold font-sans flex items-center gap-1 transition-colors uppercase tracking-wider group-hover:translate-x-1 duration-200 cursor-pointer text-left"
                >
                  Procure Crops ➔
                </button>
              </div>

              {/* Box 3 */}
              <div className="bg-white p-5 rounded-2xl border border-brand-green/5 flex flex-col justify-between hover:border-brand-gold/45 hover:shadow-md transition-all group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-cream/50 border border-brand-green/10 flex items-center justify-center mb-3">
                    <span className="text-brand-green font-serif font-black text-sm">03</span>
                  </div>
                  <h4 className="font-serif font-bold text-brand-green text-md group-hover:text-brand-gold transition-colors">
                    Activity Log (Auditor)
                  </h4>
                  <p className="text-xs text-brand-muted font-sans mt-1.5 leading-relaxed">
                    Designed for system operations. Trace live JSON transaction logs, monitor server response latency, and track API quota meters.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('audit')}
                  className="mt-4 text-[11px] font-bold text-brand-green hover:text-brand-gold font-sans flex items-center gap-1 transition-colors uppercase tracking-wider group-hover:translate-x-1 duration-200 cursor-pointer text-left"
                >
                  Check Telemetry ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic portal switcher panel based on state */}
        <div id="portal-view-wrapper">
          {activeTab === 'farmer' && (
            <FarmerPortal
              cropLogs={cropLogs}
              onAddCrop={handleAddCrop}
              triggerNotification={triggerNotification}
              onLogSystemActivity={handleLogSystemActivity}
              chatMessages={chatMessages}
              onSendMessage={handleSendChatMessage}
              isBotTyping={isBotTyping}
            />
          )}

          {activeTab === 'saudi' && (
            <SaudiAgribusinessPortal
              onGenerateContract={handleOpenSmartContract}
              triggerNotification={triggerNotification}
              onLogSystemActivity={handleLogSystemActivity}
            />
          )}

          {activeTab === 'audit' && (
            <SystemAuditorPortal
              systemLogs={systemLogs}
              onClearLogs={handleClearLogs}
              groqQuota={groqQuota}
              geminiQuota={geminiQuota}
              cohereQuota={cohereQuota}
            />
          )}
        </div>

      </main>

      {/* Global Interactive Smart Contract Modal Window */}
      <SmartContractModal
        isOpen={isContractModalOpen}
        supplier={selectedSupplier}
        onClose={() => setIsContractModalOpen(false)}
        onExecute={handleExecuteSmartContract}
        triggerNotification={triggerNotification}
      />

      {/* Footer */}
      <footer className="border-t border-brand-green/10 bg-white py-6 text-center text-xs text-brand-muted print:hidden select-none" id="agribridge-footer">
        <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© 2026 AgriBridge — Pakistan–Saudi Arabia Agricultural Trade Platform</p>
          <p className="text-brand-muted/70">Aligned with UN SDG 2 and Saudi Vision 2030</p>
        </div>
      </footer>

      {/* Toast Notifications */}
      {toast.visible && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border flex items-center gap-3 shadow-2xl max-w-sm transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-brand-green text-brand-cream border-brand-gold'
              : 'bg-white text-brand-charcoal border-brand-green/20'
          }`}
          id="global-toast-notification"
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-brand-gold shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-brand-gold shrink-0" />
          )}
          <p className="text-sm leading-relaxed">{toast.message}</p>
        </div>
      )}

    </div>
  );
}
