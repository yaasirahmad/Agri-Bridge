import { Layers, Loader2, Award, FileText } from 'lucide-react';
import { SupplierRow } from '../../../types';

interface FarmerResultsTableProps {
  suppliers: SupplierRow[];
  isSearching: boolean;
  selectedSupplier: SupplierRow;
  handleSelectSupplier: (supplier: SupplierRow) => void;
  onGenerateContract: (supplier: SupplierRow) => void;
  triggerNotification: (message: string, type: 'success' | 'info') => void;
  onLogSystemActivity: (api: string, method: string, endpoint: string, payload: string) => void;
}

export default function FarmerResultsTable({
  suppliers,
  isSearching,
  selectedSupplier,
  handleSelectSupplier,
  onGenerateContract,
  triggerNotification,
  onLogSystemActivity,
}: FarmerResultsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-brand-green/10 p-6 shadow-md" id="saudi-supplier-table-card">
      <div className="flex justify-between items-center mb-4 border-b border-brand-cream pb-3">
        <div>
          <h3 className="font-serif font-bold text-brand-green text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-gold" />
            Verified Supplier Database
          </h3>
          <p className="text-xs text-brand-muted font-sans mt-0.5">Verified farms with sustainability certifications</p>
        </div>
        <span className="text-xs bg-brand-cream border border-brand-gold/30 text-brand-green font-bold px-3 py-1 rounded-full p-1 shadow-sm min-w-[120px] text-center">
          {isSearching ? 'Reranking...' : `${suppliers.length} Matches Found`}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-green/10 text-brand-muted text-xs font-sans uppercase">
              <th className="py-2 pb-2 font-bold select-none">Supplier</th>
              <th className="py-2 pb-2 font-bold select-none">Crop</th>
              <th className="py-2 pb-2 font-bold text-center select-none">Rating</th>
              <th className="py-2 pb-2 font-bold text-right select-none">Available</th>
              <th className="py-2 pb-2 font-bold text-right select-none">Price/Ton</th>
              <th className="py-2 pb-2 font-bold text-center select-none">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-cream text-xs sm:text-sm">
            {isSearching ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-brand-muted bg-brand-cream/10">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
                    <span className="text-xs font-bold text-brand-green font-sans">
                      Searching...
                    </span>

                  </div>
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  onClick={() => handleSelectSupplier(supplier)}
                  className={`cursor-pointer transition-colors ${
                    selectedSupplier.id === supplier.id
                      ? 'bg-brand-cream border-l-4 border-l-brand-gold font-medium'
                      : 'hover:bg-brand-cream/40 border-l-4 border-l-transparent'
                  }`}
                >
                  <td className="py-3.5 pl-2">
                    <div className="font-semibold text-brand-green">{supplier.supplierName}</div>
                    <div className="text-[11px] text-brand-muted">{supplier.location}</div>
                  </td>
                  <td className="py-3.5 text-brand-charcoal text-xs sm:text-sm">{supplier.cropType}</td>
                  <td className="py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-green bg-brand-gold/15 px-2 py-0.5 rounded-full border border-brand-gold/25 select-none">
                      <Award className="w-3 h-3 text-brand-gold" />
                      {supplier.sustainabilityScore}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-brand-green">{supplier.quantityAvailableTons} Tons</td>
                  <td className="py-3.5 text-right font-mono font-bold text-brand-gold">${supplier.pricePerTonUSD}</td>
                  <td className="py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        onGenerateContract(supplier);
                        triggerNotification(`Smart Contract processing for ${supplier.supplierName}...`, 'success');
                        onLogSystemActivity(
                          'Gemini API',
                          'POST',
                          '/api/contracts/draft-bi-sovereign',
                          JSON.stringify({ targetSupplier: supplier.supplierName, priceQuoteUSD: supplier.pricePerTonUSD * supplier.quantityAvailableTons })
                        );
                      }}
                      className="bg-brand-green hover:bg-brand-emerald-light text-brand-cream font-serif text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-sm border border-brand-gold/30 active:scale-95 transition-transform cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-gold" />
                      Create Agreement
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!isSearching && suppliers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-brand-muted italic bg-brand-cream/30">
                  No verified suppliers match your semantic parameters. Try searching "Dates" or "Basmati".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
