import { Search } from 'lucide-react';

interface SemanticSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SemanticSearchBar({
  searchTerm,
  setSearchTerm,
}: SemanticSearchBarProps) {
  return (
    <div className="bg-white rounded-2xl border border-brand-green/10 p-5 shadow-md" id="saudi-search-container">
      <label className="block text-xs font-bold text-brand-green uppercase tracking-wider mb-2 font-sans flex items-center gap-1.5">
        <Search className="w-3.5 h-3.5 text-brand-gold" />
        Search Suppliers
      </label>
      <div className="relative" id="saudi-search-input-wrapper">
        <input
          type="text"
          placeholder="Search by crop, location, or supplier name..."
          className="w-full bg-brand-cream border border-brand-green/20 rounded-xl py-3.5 pl-4 pr-12 text-sm text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-gold placeholder-brand-muted/75 font-sans shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-3.5 text-xs text-brand-muted hover:text-brand-charcoal font-bold bg-brand-cream border border-brand-green/10 px-2 py-0.5 rounded cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto py-1" id="search-suggestion-pills">
        <span className="text-[10px] text-brand-muted font-bold uppercase py-1 select-none whitespace-nowrap">Suggested Filters:</span>
        {['Basmati', 'Dates', 'Karak Honey', 'Multan Corn'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setSearchTerm(suggestion)}
            className="text-[11px] bg-brand-cream hover:bg-brand-gold/15 text-brand-green hover:text-brand-charcoal font-semibold border border-brand-green/10 px-2.5 py-0.5 rounded-full transition-all whitespace-nowrap cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
