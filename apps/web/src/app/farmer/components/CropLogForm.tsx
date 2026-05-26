import { useState, FormEvent } from 'react';
import { Sprout, PlusCircle } from 'lucide-react';
import { CropSubmission } from '../../../types';

interface CropLogFormProps {
  onAddCrop: (crop: CropSubmission) => void;
  triggerNotification: (message: string, type: 'success' | 'info') => void;
  onLogSystemActivity: (api: string, method: string, endpoint: string, payload: string) => void;
}

export default function CropLogForm({
  onAddCrop,
  triggerNotification,
  onLogSystemActivity,
}: CropLogFormProps) {
  const [cropName, setCropName] = useState('Punjab Basmati Rice (Premium Long Grain)');
  const [farmerName, setFarmerName] = useState('');
  const [location, setLocation] = useState('Gujranwala, Punjab');
  const [quantity, setQuantity] = useState(100);
  const [waterSavings, setWaterSavings] = useState(40);
  const [sustainabilityScore, setSustainabilityScore] = useState('A+');

  const handleCropSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!farmerName.trim()) {
      triggerNotification('Please enter the Farmer / Agribusiness Name.', 'info');
      return;
    }

    const newCrop: CropSubmission = {
      id: `crop-${Date.now().toString().slice(-4)}`,
      cropName,
      farmerName,
      location,
      quantityTons: Number(quantity),
      waterSavingsPct: Number(waterSavings),
      sustainabilityScore,
      submissionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending',
    };

    onAddCrop(newCrop);
    triggerNotification(`Successfully logged ${quantity} Tons of ${cropName}!`, 'success');
    
    onLogSystemActivity(
      'Gemini API',
      'POST',
      '/v1beta/crops/phytosanitary-verification',
      JSON.stringify({ crop: cropName, farmer: farmerName, quantityTons: quantity, sustainabilityScore })
    );

    setFarmerName('');
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-green/10 p-6 shadow-md" id="crop-log-container">
      <div className="flex items-center gap-3 border-b border-brand-green/10 pb-4 mb-4">
        <div className="p-2 bg-brand-cream rounded-lg">
          <Sprout className="w-6 h-6 text-brand-green" />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-brand-green">Register New Crop</h3>
          <p className="text-xs text-brand-muted font-sans">Add your crop details to make them visible to Saudi buyers.</p>
        </div>
      </div>

      <form onSubmit={handleCropSubmit} className="space-y-4" id="crop-submit-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">Crop Type</label>
            <select
              className="w-full bg-brand-cream border border-brand-green/20 rounded-lg py-2.5 px-3 text-sm text-brand-charcoal font-sans focus:outline-none focus:ring-1 focus:ring-brand-gold"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
            >
              <option value="Punjab Basmati Rice (Premium Long Grain)">Punjab Basmati Rice (Premium Long Grain)</option>
              <option value="Aseel Dates (Premium Sweet)">Aseel Dates (Premium Sweet)</option>
              <option value="Organic Sindh Dates (Sukkuri)">Organic Sindh Dates (Sukkuri S-1)</option>
              <option value="Sidr Honey (A+ Grade Export Spec)">Sidr Honey (A+ Grade Export Spec)</option>
              <option value="Organic Feed Alfalfa Hay">Organic Feed Alfalfa Hay</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">Farm or Business Name</label>
            <input
              type="text"
              placeholder="e.g. Al-Fateh Indus Cooperative"
              className="w-full bg-brand-cream border border-brand-green/20 rounded-lg py-2.5 px-3 text-sm text-brand-charcoal font-sans focus:outline-none focus:ring-1 focus:ring-brand-gold"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">Location</label>
            <select
              className="w-full bg-brand-cream border border-brand-green/20 rounded-lg py-2.5 px-3 text-sm text-brand-charcoal font-sans focus:outline-none focus:ring-1 focus:ring-brand-gold"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Sargodha, Punjab">Sargodha, Punjab</option>
              <option value="Khairpur, Sindh">Khairpur, Sindh</option>
              <option value="Karak, Khyber Pakhtunkhwa">Karak, KPK</option>
              <option value="Gujranwala, Punjab">Gujranwala, Punjab</option>
              <option value="Nasirabad, Balochistan">Nasirabad, Balochistan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">Quantity (Tons)</label>
            <input
              type="number"
              min="1"
              className="w-full bg-brand-cream border border-brand-green/20 rounded-lg py-2.5 px-3 text-sm text-brand-charcoal font-sans focus:outline-none focus:ring-1 focus:ring-brand-gold"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">Water Savings (%)</label>
            <div className="relative">
              <input
                type="range"
                min="10"
                max="65"
                className="w-full h-2 bg-brand-cream rounded-lg appearance-none cursor-pointer accent-brand-gold mt-4"
                value={waterSavings}
                onChange={(e) => setWaterSavings(Number(e.target.value))}
              />
              <span className="absolute right-0 top-0 text-xs font-bold text-brand-green bg-brand-cream px-1.5 py-0.5 rounded border border-brand-green/10">
                {waterSavings}%
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">Sustainability Grade</label>
          <div className="flex gap-4 mt-2">
            {['A++', 'A+', 'A', 'B+'].map((score) => (
              <button
                key={score}
                type="button"
                className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                  sustainabilityScore === score
                    ? 'bg-brand-green text-brand-cream border-brand-green shadow'
                    : 'bg-brand-cream text-brand-charcoal border-brand-green/10 hover:border-brand-gold'
                }`}
                onClick={() => setSustainabilityScore(score)}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-brand-green hover:bg-brand-emerald-light font-serif text-brand-cream font-bold py-3 px-4 rounded-xl shadow-md border border-brand-gold/30 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 text-brand-gold" />
          Register Crop
        </button>
      </form>
    </div>
  );
}
