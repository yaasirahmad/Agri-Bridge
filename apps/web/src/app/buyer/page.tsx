import { useState, useEffect } from 'react';
import { Search, Map, CheckCircle, FileText, Droplets, ArrowRight, Anchor, Plane, Award, Sparkles, Scale, Info, Layers } from 'lucide-react';
import { SupplierRow } from '../../types';
import { SUPPLIER_DATA } from '../../data';
import { searchAgriSuppliers } from '../../lib/worker-client';

// Import divided components
import AnalyticsPanel from './components/AnalyticsPanel';
import SemanticSearchBar from './components/SemanticSearchBar';
import FarmerResultsTable from './components/FarmerResultsTable';

interface SaudiAgribusinessPortalProps {
  onGenerateContract: (supplier: SupplierRow) => void;
  triggerNotification: (message: string, type: 'success' | 'info') => void;
  onLogSystemActivity: (api: string, method: string, endpoint: string, payload: string) => void;
}

export default function SaudiAgribusinessPortalPage({
  onGenerateContract,
  triggerNotification,
  onLogSystemActivity,
}: SaudiAgribusinessPortalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRow>(SUPPLIER_DATA[0]);
  const [suppliers, setSuppliers] = useState<SupplierRow[]>(SUPPLIER_DATA);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced live semantic Cohere search proxy
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuppliers(SUPPLIER_DATA);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      onLogSystemActivity(
        'Cohere.ai API',
        'POST',
        '/api/search',
        JSON.stringify({ query: searchTerm, docs_count: SUPPLIER_DATA.length })
      );

      try {
        const ranked = await searchAgriSuppliers(searchTerm, SUPPLIER_DATA);
        setSuppliers(ranked);
        triggerNotification(`Supplier search complete for "${searchTerm}"`, 'success');
      } catch (err) {
        console.error("Semantic search failed, falling back to local filter:", err);
        // Fallback to local filter
        const query = searchTerm.toLowerCase();
        const local = SUPPLIER_DATA.filter((supplier) =>
          supplier.supplierName.toLowerCase().includes(query) ||
          supplier.cropType.toLowerCase().includes(query) ||
          supplier.location.toLowerCase().includes(query)
        );
        setSuppliers(local);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Handle Supplier Selection
  const handleSelectSupplier = (supplier: SupplierRow) => {
    setSelectedSupplier(supplier);
    triggerNotification(`Active trade route loaded for ${supplier.supplierName}.`, 'info');
    onLogSystemActivity(
      'System Edge',
      'GET',
      `/routing/pathway-load?id=${supplier.id}`,
      JSON.stringify({ supplier: supplier.supplierName, pathway: supplier.logisticsPathway })
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto font-sans" id="saudi-portal-container">
      
      {/* Enterprise Analytics Panel */}
      <AnalyticsPanel />

      {/* Main Core Supplier Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="saudi-core-grid">
        
        {/* LEFT PORTION - Search & Supplier Table (7 columns) */}
        <div className="xl:col-span-7 flex flex-col gap-6" id="saudi-left-panel">
          <SemanticSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <FarmerResultsTable
            suppliers={suppliers}
            isSearching={isSearching}
            selectedSupplier={selectedSupplier}
            handleSelectSupplier={handleSelectSupplier}
            onGenerateContract={onGenerateContract}
            triggerNotification={triggerNotification}
            onLogSystemActivity={onLogSystemActivity}
          />
        </div>

        {/* RIGHT PORTION - Premium Analytics Workspace & Active Trade Route Map (5 columns) */}
        <div className="xl:col-span-5 flex flex-col gap-6" id="saudi-right-panel">
          
          {/* Logistics pathway & Carbon-Reduction status card */}
          <div className="bg-brand-green text-brand-cream rounded-2xl p-6 border border-brand-gold/30 shadow-md flex flex-col gap-5" id="active-pathway-card">
            <div className="flex justify-between items-start border-b border-brand-cream/10 pb-3" id="pathway-head">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest font-sans">Trade Route</span>
                <h3 className="font-serif font-bold text-xl text-brand-cream mt-0.5">{selectedSupplier.supplierName}</h3>
                <p className="text-xs text-brand-cream/70 font-sans mt-0.5">{selectedSupplier.location} to Kingdom of Saudi Arabia</p>
              </div>
              {selectedSupplier.logisticsPathway.includes('Air') ? (
                <span className="p-2.5 bg-brand-cream/10 rounded-full text-brand-gold">
                  <Plane className="w-5 h-5 text-brand-gold" />
                </span>
              ) : (
                <span className="p-2.5 bg-brand-cream/10 rounded-full text-brand-gold">
                  <Anchor className="w-5 h-5 text-brand-gold animate-pulse" />
                </span>
              )}
            </div>

            {/* Interactive Custom SVG Cargo Route Animation */}
            <div className="bg-brand-emerald-light/55 rounded-xl border border-brand-cream/10 p-4 flex flex-col items-center justify-center relative overflow-hidden" id="interactive-svg-container">
              <span className="absolute top-2 left-2 text-[10px] font-mono text-brand-gold bg-brand-green/70 px-1.5 py-0.5 rounded border border-brand-gold/10">Shipping Route</span>
              
              <svg viewBox="0 0 400 200" className="w-full h-[155px] text-brand-cream" id="cargo-ocean-map">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(250,248,245,0.05)" strokeWidth="0.5"/>
                  </pattern>
                  <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#CDA052" />
                    <stop offset="100%" stopColor="#dfb974" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Saudi Arabia Sovereign Node */}
                <g transform="translate(60, 110)">
                  <circle r="22" fill="rgba(250, 248, 245, 0.1)" stroke="rgba(205, 160, 82, 0.4)" strokeWidth="1" strokeDasharray="3 3"/>
                  <circle r="6" fill="#CDA052" className="animate-ping" />
                  <circle r="4" fill="#CDA052" />
                  <text y="22" textAnchor="middle" className="fill-brand-cream font-serif font-bold text-[10px]">Jeddah/Riyadh Node</text>
                  <text y="32" textAnchor="middle" className="fill-brand-gold font-mono text-[8px] tracking-wider">(KSA HUB)</text>
                </g>

                {/* Pakistan Sovereign Node */}
                <g transform="translate(320, 50)">
                  <circle r="22" fill="rgba(250, 248, 245, 0.1)" stroke="rgba(205, 160, 82, 0.4)" strokeWidth="1" strokeDasharray="3 3"/>
                  <circle r="6" fill="#013220" />
                  <circle r="4" fill="#FAF8F5" />
                  <text y="-14" textAnchor="middle" className="fill-brand-cream font-serif font-bold text-[10px]">Indus Basin Node</text>
                  <text y="-6" textAnchor="middle" className="fill-brand-gold font-mono text-[8px] tracking-wider">({selectedSupplier.location.split(',')[0]} PK)</text>
                </g>

                <path
                  d="M 320 50 Q 200 60, 60 110"
                  fill="none"
                  stroke="url(#grad-gold)"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                  className="animate-pulse"
                />

                <g transform="translate(180, 80)">
                  <circle r="5" fill="#CDA052" className="animate-bounce" />
                  {selectedSupplier.logisticsPathway.includes('Air') ? (
                    <path d="M-4,-2 L0,-4 L4,-2 L0,2 Z" fill="#FAF8F5" />
                  ) : (
                    <path d="M-6,-2 L6,-2 L3,3 L-3,3 Z" fill="#FAF8F5" />
                  )}
                </g>
              </svg>

              <div className="grid grid-cols-2 gap-4 w-full mt-2 pt-2 border-t border-brand-green/30 text-xs text-center" id="cargo-stats-overlay">
                <div>
                  <span className="block text-brand-gold/80 font-mono text-[10px]">Transit Duration</span>
                  <span className="font-bold text-sm text-brand-cream">
                    {selectedSupplier.logisticsPathway.includes('Air') ? '8.5 Hours Flight' : '11-12 Days Maritime'}
                  </span>
                </div>
                <div>
                  <span className="block text-brand-gold/80 font-mono text-[10px]">Bilateral Pathway Target</span>
                  <span className="font-bold text-sm text-brand-cream text-ellipsis overflow-hidden block px-1">
                    {selectedSupplier.logisticsPathway.includes('Air') ? 'Riyadh Cargo' : 'Jeddah Islamic Port'}
                  </span>
                </div>
              </div>
            </div>

            {/* Environmental Carbon off-set metrics */}
            <div className="grid grid-cols-3 gap-3" id="esg-statistics-grid">
              <div className="bg-brand-emerald-light rounded-xl p-3 border border-brand-cream/5 flex flex-col items-center text-center">
                <Droplets className="w-5 h-5 text-blue-300 mb-1" />
                <span className="text-[10px] text-brand-cream/60">Water Conserved</span>
                <span className="text-sm font-bold text-brand-cream mt-0.5">{selectedSupplier.waterSavingsPct}%</span>
              </div>

              <div className="bg-brand-emerald-light rounded-xl p-3 border border-brand-cream/5 flex flex-col items-center text-center">
                <Sparkles className="w-5 h-5 text-brand-gold mb-1 animate-pulse" />
                <span className="text-[10px] text-brand-cream/60">Carbon Savings</span>
                <span className="text-sm font-bold text-brand-gold mt-0.5">-{selectedSupplier.carbonReductionTons} t</span>
              </div>

              <div className="bg-brand-emerald-light rounded-xl p-3 border border-brand-cream/5 flex flex-col items-center text-center">
                <Scale className="w-5 h-5 text-green-300 mb-1" />
                <span className="text-[10px] text-brand-cream/60">Lot Volume</span>
                <span className="text-sm font-bold text-brand-cream mt-0.5">{selectedSupplier.quantityAvailableTons} Tons</span>
              </div>
            </div>

            <div className="bg-brand-emerald-light/40 border border-brand-cream/10 p-4 rounded-xl text-xs flex gap-3 items-start leading-relaxed" id="sustainable-quota-guidance">
              <Info className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-brand-cream">Sustainability Impact:</p>
                <p className="text-brand-cream/85 mt-1 font-sans">
                  Purchasing from {selectedSupplier.supplierName} earns <span className="text-brand-gold font-bold">{selectedSupplier.carbonReductionTons} Sustainable Agriculture Credits</span> verified by the Ministry of Environment, Water and Agriculture of Saudi Arabia.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
