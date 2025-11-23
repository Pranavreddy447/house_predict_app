import React, { useState, useEffect } from 'react';
import { getLocations, predictPrice } from '../api';

const PredictionForm: React.FC = () => {
  const [locations, setLocations] = useState<string[]>([]);
  const [sqft, setSqft] = useState<number>(1000);
  const [bhk, setBhk] = useState<number>(2);
  const [bath, setBath] = useState<number>(2);
  const [location, setLocation] = useState<string>('');
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locs = await getLocations();
        setLocations(locs);
        if (locs.length > 0) {
          setLocation(locs[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load locations');
      }
    };
    fetchLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrice(null);

    try {
      const estimatedPrice = await predictPrice({
        total_sqft: sqft,
        bhk,
        bath,
        location,
      });
      setPrice(estimatedPrice);
    } catch (err: any) {
      setError(err.message || 'Failed to predict price');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-8 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Enter Property Details</h2>
          <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="sqft" className="block text-sm font-semibold text-gray-700 mb-2">Area (Square Feet)</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  id="sqft"
                  type="number"
                  value={sqft}
                  onChange={(e) => setSqft(parseFloat(e.target.value))}
                  className="block w-full rounded-lg border-gray-300 pl-4 pr-12 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border transition-colors"
                  placeholder="e.g. 1500"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">sqft</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="bhk" className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms (BHK)</label>
              <div className="relative">
                <input
                  id="bhk"
                  type="number"
                  value={bhk}
                  onChange={(e) => setBhk(parseInt(e.target.value))}
                  className="block w-full rounded-lg border-gray-300 py-3 px-4 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border transition-colors"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="bath" className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
              <div className="relative">
                <input
                  id="bath"
                  type="number"
                  value={bath}
                  onChange={(e) => setBath(parseInt(e.target.value))}
                  className="block w-full rounded-lg border-gray-300 py-3 px-4 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border transition-colors"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="block w-full rounded-lg border-gray-300 py-3 px-4 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border transition-colors bg-white"
                required
              >
                <option value="" disabled>Select a location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </>
              ) : 'Estimate Price'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {price !== null && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl text-center animate-fade-in-up">
            <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-1">Estimated Market Value</h3>
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-extrabold text-green-700">{price.toFixed(2)}</span>
              <span className="ml-2 text-xl font-medium text-green-600">Lakh</span>
            </div>
            <p className="mt-2 text-xs text-green-600">Based on current market trends in Bengaluru</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionForm;
