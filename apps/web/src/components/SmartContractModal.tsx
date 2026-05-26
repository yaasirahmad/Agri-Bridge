import { Scale, FileText, Download, CheckSquare, X, Shield, Sparkles, Award } from 'lucide-react';
import { SupplierRow } from '../types';

interface SmartContractModalProps {
  supplier: SupplierRow | null;
  isOpen: boolean;
  onClose: () => void;
  onExecute: () => void;
  triggerNotification: (message: string, type: 'success' | 'info') => void;
}

export default function SmartContractModal({
  supplier,
  isOpen,
  onClose,
  onExecute,
  triggerNotification,
}: SmartContractModalProps) {
  if (!isOpen || !supplier) return null;

  const totalCost = supplier.pricePerTonUSD * supplier.quantityAvailableTons;
  const contractHash = `SHA256:0xba11ab${Date.now().toString().slice(-4)}c7f21e56a798b3f1a63c0cd72b22030ab229`;

  const handlePrint = () => {
    window.print();
    triggerNotification('PDF Export trigger initiated. Document sent to device spooler!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="contract-modal-backdrop">
      {/* Dimmed Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-brand-cream border border-brand-gold max-w-3xl w-full shadow-2xl transition-all font-sans text-brand-charcoal print:p-0 print:border-none print:shadow-none" id="contract-modal-content">
          
          {/* Top Panel Actions */}
          <div className="bg-brand-green p-4 flex items-center justify-between text-brand-cream border-b border-brand-gold/30 print:hidden" id="contract-modal-header">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-gold" />
              <span className="font-serif font-bold text-sm select-none">Trade Agreement</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="bg-brand-emerald-light hover:bg-brand-green text-brand-cream hover:text-brand-gold text-xs font-bold py-1.5 px-3 rounded-lg border border-brand-cream/10 flex items-center gap-1.5 transition-colors"
                title="Print digital document to PDF"
              >
                <Download className="w-3.5 h-3.5" />
                Export PDF
              </button>
              <button
                onClick={onClose}
                className="text-brand-cream/70 hover:text-brand-cream transition-colors p-1"
                title="Close Contract Modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Actual Contract Body */}
          <div className="p-8 md:p-12 font-serif text-brand-charcoal bg-[#FAF8F5] leading-relaxed select-text shadow-inner max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible print:bg-white" id="contract-paper-body">
            
            {/* Header Logos & Alignment */}
            <div className="flex justify-between items-start border-b-2 border-brand-green/30 pb-5" id="paper-logos-section">
              <div className="max-w-[65%]">
                <h2 className="text-xl md:text-2xl font-black text-brand-green tracking-tight uppercase leading-snug">
                  Agricultural Trade Agreement
                </h2>
                <p className="text-[11px] uppercase tracking-wider text-brand-gold font-sans font-bold mt-1">
                  Saudi Vision 2030 &amp; Pakistan Vision 2030 Alliance
                </p>
                <p className="text-[10px] text-brand-muted font-sans mt-0.5">
                  Authorized under UN SDG 2: Zero Hunger Bilateral Food Security Pipeline
                </p>
              </div>
              <div className="text-right flex flex-col items-end" id="ministerial-seals opacity-80">
                <span className="text-[10px] font-mono text-brand-green bg-brand-gold/15 px-2 py-0.5 rounded border border-brand-gold/30 font-bold select-none mb-1">
                  SECURE LEDGER RECORD
                </span>
                <span className="text-[9px] font-sans text-brand-muted uppercase">Contract ID: AB-2026-{supplier.id.toUpperCase()}</span>
                <span className="text-[8px] font-mono text-brand-gold truncate max-w-[150px]">{contractHash}</span>
              </div>
            </div>

            {/* Document Core Content */}
            <div className="my-6 space-y-6 text-xs md:text-sm" id="paper-document-content">
              
              <div className="text-center italic text-brand-muted font-serif text-xs my-4" id="intro-recitals">
                This bilateral instrument is executed digitally to guarantee food security, fair agricultural remuneration, and verified carbon emission off-sets.
              </div>

              {/* Contracting Parties */}
              <div className="space-y-2" id="doc-section-1">
                <h4 className="font-sans font-bold text-brand-green uppercase tracking-wider border-b border-brand-green/10 pb-1 text-xs">
                  SECTION I: PARTIES
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-sans">
                  <div className="bg-brand-cream/60 p-3 rounded-lg border border-brand-green/5">
                    <span className="block text-[10px] text-brand-gold font-bold uppercase tracking-wider">THE SOVEREIGN BUYER / INVESTOR</span>
                    <span className="block font-serif font-bold text-brand-green text-sm mt-0.5">Saudi Agricultural Investment Company (SALIC)</span>
                    <span className="block text-[11px] text-brand-muted">Ministry of Environment, Water &amp; Agriculture Hub</span>
                    <span className="block text-[11px] text-brand-muted">Riyadh, Kingdom of Saudi Arabia</span>
                  </div>
                  <div className="bg-brand-cream/60 p-3 rounded-lg border border-brand-green/5">
                    <span className="block text-[10px] text-brand-gold font-bold uppercase tracking-wider">THE SOVEREIGN SELLER / PRODUCER</span>
                    <span className="block font-serif font-bold text-brand-green text-sm mt-0.5">{supplier.supplierName}</span>
                    <span className="block text-[11px] text-brand-muted">Verified Agricultural Consortium of Pakistan</span>
                    <span className="block text-[11px] text-brand-muted">{supplier.location}</span>
                  </div>
                </div>
              </div>

              {/* Crop Specifications and Volume */}
              <div className="space-y-2" id="doc-section-2">
                <h4 className="font-sans font-bold text-brand-green uppercase tracking-wider border-b border-brand-green/10 pb-1 text-xs">
                  SECTION II: COMMODITY DETAILS
                </h4>
                <div className="overflow-x-auto pt-1">
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="bg-brand-cream text-brand-green font-bold border border-brand-green/10">
                        <th className="p-2 border border-brand-green/10">Target Commodity Description</th>
                        <th className="p-2 text-right border border-brand-green/10">Lot Volume</th>
                        <th className="p-2 text-center border border-brand-green/10">SDG Conservation Score</th>
                        <th className="p-2 text-right border border-brand-green/10">CO2 Mt Saved</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white/50 border border-brand-green/10">
                        <td className="p-2 border border-brand-green/10">
                          <strong>{supplier.cropType}</strong>
                          <span className="block text-[11px] text-brand-muted">Export Compliant with SFDA Phytosanitary Rule #344</span>
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-brand-green border border-brand-green/10">{supplier.quantityAvailableTons} Net Metric Tons</td>
                        <td className="p-2 text-center border border-brand-green/10">
                          <span className="text-brand-green font-bold bg-brand-gold/15 px-2 py-0.5 rounded border border-brand-gold/30">
                            {supplier.sustainabilityScore} (AWD Method)
                          </span>
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-brand-green border border-brand-green/10">-{supplier.carbonReductionTons} mt Carbon</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Considerations */}
              <div className="space-y-2" id="doc-section-3">
                <h4 className="font-sans font-bold text-brand-green uppercase tracking-wider border-b border-brand-green/10 pb-1 text-xs">
                  SECTION III: PRICING
                </h4>
                <div className="bg-brand-green text-brand-cream rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 font-sans border border-brand-gold/30" id="modal-financial-pane">
                  <div>
                    <span className="text-[10px] text-brand-gold uppercase font-bold tracking-widest block">Unit Price Stipulated</span>
                    <span className="text-xl font-mono font-bold">${supplier.pricePerTonUSD.toLocaleString()} <span className="text-xs font-normal">per Metric Ton FOB</span></span>
                  </div>
                  <div className="hidden sm:block text-brand-gold text-xl">➔</div>
                  <div className="text-center sm:text-right">
                    <span className="text-[10px] text-brand-gold uppercase font-bold tracking-widest block">Total Escrow Fund Secured</span>
                    <span className="text-2xl font-serif font-black text-brand-cream">${totalCost.toLocaleString()} <span className="text-xs font-sans font-normal">USD</span></span>
                  </div>
                </div>
              </div>

              {/* Escrow Trigger System */}
              <div className="space-y-2" id="doc-section-4">
                <h4 className="font-sans font-bold text-brand-green uppercase tracking-wider border-b border-brand-green/10 pb-1 text-xs">
                  SECTION IV: PAYMENT SCHEDULE
                </h4>
                <div className="space-y-2 text-xs font-sans text-brand-charcoal" id="smart-triggers-list">
                  <div className="flex gap-2.5 items-start bg-brand-cream/40 p-2.5 rounded border border-brand-green/5">
                    <span className="text-brand-gold font-bold font-mono">1.</span>
                    <p>
                      <strong>Pre-Shipment Milestone (30% Release):</strong> Upon digital upload of agricultural phytosanitary clearance certificate verified on Saudi-Pakistan Sovereign Edge Node, $<strong>{(totalCost * 0.3).toLocaleString()} USD</strong> will unlock from Saudi National Bank (SNB) Escrow to Agricultural Cooperative accounts.
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-start bg-brand-cream/40 p-2.5 rounded border border-brand-green/5">
                    <span className="text-brand-gold font-bold font-mono">2.</span>
                    <p>
                      <strong>Ingress Port Milestone (70% Release):</strong> Upon container maritime vessel ingress at Jidda Islamic Port (SA) or King Khalid Airport cargo inspection hub, SFDA chemical validation checks trigger instant release of remaining $<strong>{(totalCost * 0.7).toLocaleString()} USD</strong> funds automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dual Language Seal Note */}
              <div className="text-[10px] text-center text-brand-muted border-t border-brand-green/15 pt-4 font-sans select-none" id="seal-note">
                This document is compiled dynamically in synchronization with official databases and maintains legal compliance certificates under international WTO maritime farming guidelines.
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 text-center pt-6 font-sans text-xs border-t border-brand-green/10" id="mofa-signatures">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border border-brand-gold/30 flex items-center justify-center p-1 mb-2 select-none">
                    <Scale className="w-8 h-8 text-brand-gold" />
                  </div>
                  <span className="font-bold text-brand-green">MINISTRY OF ENVIRONMENT &amp; AGRICULTURE</span>
                  <span className="block text-[10px] text-brand-muted">Government of Saudi Arabia (Riyadh Hub)</span>
                  <span className="block font-mono text-[9px] text-green-600 mt-1">✓ DIGITALLY SEALED</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border border-brand-gold/30 flex items-center justify-center p-1 mb-2 select-none">
                    <Award className="w-8 h-8 text-brand-gold" />
                  </div>
                  <span className="font-bold text-brand-green">MINISTRY OF FOOD SECURITY &amp; RESEARCH</span>
                  <span className="block text-[10px] text-brand-muted">Government of Pakistan (Karachi Edge Node)</span>
                  <span className="block font-mono text-[9px] text-green-600 mt-1">✓ DIGITALLY SEALED</span>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Executing Panel Controls */}
          <div className="bg-brand-cream p-5 border-t border-brand-gold/30 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden" id="contract-modal-footer">
            <div className="flex items-center gap-2 text-xs text-brand-muted" id="compliance-notices">
              <Shield className="w-5 h-5 text-brand-gold" />
              <span>Cryptographic Token ID is active and ready to sign securely.</span>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none border border-brand-green/20 hover:border-brand-charcoal text-brand-charcoal hover:bg-zinc-100 font-serif text-sm font-semibold py-2.5 px-5 rounded-xl transition-all"
              >
                Decline &amp; Edit
              </button>
              <button
                onClick={onExecute}
                className="flex-1 sm:flex-none bg-brand-green hover:bg-brand-emerald-light font-serif text-brand-cream font-bold py-2.5 px-6 rounded-xl border border-brand-gold/30 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <CheckSquare className="w-4 h-4 text-brand-gold" />
                Sign Agreement
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
