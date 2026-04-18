import React from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import SuggestionCard from './SuggestionCard';

const ForgottenItems = () => {
  const { recommendations, loading } = useRecommendations();

  if (loading) return (
    <div className="animate-pulse">
      <div style={{ height: '20px', background: 'var(--green-light)', borderRadius: '4px', width: '220px', marginBottom: '16px' }} />
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[1,2,3,4].map(i => (
          <div key={i} style={{ minWidth: '220px', height: '64px', background: 'var(--green-light)', borderRadius: '12px', flexShrink: 0 }} />
        ))}
      </div>
    </div>
  );

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div>
      <h3 className="font-fraunces" style={{ fontSize: '22px', color: 'var(--text-primary)', marginBottom: '16px' }}>
        You might have forgotten&hellip;
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {recommendations.slice(0, 5).map((rec, i) => (
          <div key={rec.product_id || i} style={{ minWidth: '240px', flexShrink: 0 }}>
            <SuggestionCard product={rec} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForgottenItems;
