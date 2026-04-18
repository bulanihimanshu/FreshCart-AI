import React from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import SuggestionCard from './SuggestionCard';

const TIER_LABEL = {
  1: { title: 'Popular Right Now', sub: 'Top picks from all shoppers', icon: '📈' },
  2: { title: 'Based on Your Aisles', sub: 'Items from your favourite categories', icon: '🏷️' },
  3: { title: 'Suggested for You', sub: 'AI-personalised by your order history', icon: '✨' },
};

const SkeletonCard = () => (
  <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px' }}
    className="flex items-center gap-3 p-3 animate-pulse">
    <div style={{ background: 'var(--green-light)', borderRadius: '10px' }} className="w-11 h-11 shrink-0" />
    <div className="flex-1 space-y-2">
      <div style={{ background: 'var(--green-light)', borderRadius: '4px' }} className="h-3 w-3/4" />
      <div style={{ background: 'var(--green-light)', borderRadius: '4px' }} className="h-2.5 w-1/3" />
    </div>
    <div style={{ background: 'var(--green-light)', borderRadius: '50%' }} className="w-8 h-8 shrink-0" />
  </div>
);

const SuggestionPanel = () => {
  const { recommendations, tierUsed, loading } = useRecommendations();
  const cfg = TIER_LABEL[tierUsed] || TIER_LABEL[1];

  return (
    <div className="sticky top-20">
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'var(--green-dark)', padding: '18px 20px' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{cfg.icon}</span>
            <span style={{ color: '#6dd98c', fontSize: '11px' }} className="font-medium uppercase tracking-widest">AI Suggestions</span>
            {loading && <span style={{ color: '#8aaa97', fontSize: '11px' }} className="ml-auto">Loading…</span>}
          </div>
          <h3 className="font-fraunces font-semibold text-white" style={{ fontSize: '18px' }}>{cfg.title}</h3>
          <p style={{ color: '#8aaa97', fontSize: '12px' }} className="mt-0.5">{cfg.sub}</p>
        </div>

        {/* Cards */}
        <div className="p-3 space-y-2">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : recommendations.length === 0
              ? <p style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-6">No suggestions available</p>
              : recommendations.slice(0, 5).map((rec, i) => <SuggestionCard key={rec.product_id || i} product={rec} />)
          }
        </div>

        {/* Tier badge */}
        {!loading && recommendations.length > 0 && (
          <div style={{ borderTop: '1px solid var(--green-light)', padding: '10px 16px' }}>
            <div style={{ background: 'var(--green-light)', borderRadius: '8px', padding: '8px 12px' }}
              className="flex items-center gap-2">
              <span className="text-sm">{cfg.icon}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                Tier {tierUsed} · {tierUsed === 3 ? 'LSTM model' : tierUsed === 2 ? 'Aisle affinity' : 'Global popularity'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionPanel;
