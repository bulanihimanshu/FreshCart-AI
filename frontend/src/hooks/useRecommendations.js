import { useState, useEffect } from 'react';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useTime } from '../context/TimeContext';
import { useAuth } from '../context/AuthContext';

const FALLBACK = [
  { product_id: 13176, product_name: 'Bag of Organic Bananas', name: 'Bag of Organic Bananas', score: 0.95 },
  { product_id: 21137, product_name: 'Organic Strawberries', name: 'Organic Strawberries', score: 0.88 },
  { product_id: 24852, product_name: 'Organic Baby Spinach', name: 'Organic Baby Spinach', score: 0.82 },
  { product_id: 27966, product_name: 'Organic Raspberries', name: 'Organic Raspberries', score: 0.76 },
  { product_id: 22935, product_name: 'Organic Avocado', name: 'Organic Avocado', score: 0.71 },
];

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [tierUsed, setTierUsed] = useState(1);
  const [loading, setLoading] = useState(true);

  const { cartItems } = useCart();
  const { hour, dow, daysGap } = useTime();
  const { user } = useAuth();

  // Stable string key so the effect only re-runs when cart contents actually change
  const cartKey = cartItems.map((i) => i.product_id).join(',');

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const fetchRecs = async () => {
      setLoading(true);
      try {
        const result = await api.getRecommendations(user.user_id, cartItems, hour, dow, daysGap);
        if (!cancelled) {
          const recs = (result.recommendations || []).map((r) => ({
            ...r,
            product_name: r.product_name || r.name,
          }));
          setRecommendations(recs.length > 0 ? recs : FALLBACK);
          setTierUsed(result.tier_used || 1);
        }
      } catch {
        if (!cancelled) setRecommendations(FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRecs();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id, cartKey, hour, dow, daysGap]);

  return { recommendations, tierUsed, loading };
};
