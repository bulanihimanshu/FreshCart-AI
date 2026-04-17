import React from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import SuggestionCard from './SuggestionCard';

const ForgottenItems = () => {
  const { recommendations, loading } = useRecommendations();

  if (loading) return (
    <div className="mt-12 mb-4 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-64 mb-6"></div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="min-w-[240px] h-24 bg-slate-100 rounded-lg"></div>
        ))}
      </div>
    </div>
  );

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mt-12 mb-4">
      <h3 className="text-xl font-bold text-slate-800 mb-6">You might have forgotten&hellip;</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {recommendations.slice(0, 5).map((rec, i) => (
          <div key={rec.product_id || i} className="min-w-[280px]">
            <SuggestionCard product={rec} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForgottenItems;
