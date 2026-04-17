import React from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import SuggestionCard from './SuggestionCard';
import { Sparkles, Loader2 } from 'lucide-react';

const SuggestionPanel = () => {
  const { recommendations, tierUsed, loading } = useRecommendations();

  const getHeading = (tier) => {
    if (tier === 3) return "Suggested for you";
    if (tier === 2) return "You might also like";
    return "Popular right now";
  };

  return (
    <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-emerald-800 flex items-center gap-2">
          <Sparkles size={18} />
          {getHeading(tierUsed)}
        </h3>
        {loading && <Loader2 size={16} className="text-emerald-500 animate-spin" />}
      </div>
      
      <div className="space-y-3">
        {recommendations.slice(0, 5).map((rec, i) => (
          <SuggestionCard key={rec.product_id || i} product={rec} />
        ))}
        {!loading && recommendations.length === 0 && (
          <p className="text-sm text-emerald-600/70 text-center py-4">No suggestions available</p>
        )}
      </div>
    </div>
  );
};

export default SuggestionPanel;
