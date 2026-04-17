import { useState, useEffect } from 'react';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useTime } from '../context/TimeContext';
import { useAuth } from '../context/AuthContext';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [tierUsed, setTierUsed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { cartItems } = useCart();
  const { hour, dow, daysGap } = useTime();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const fetchRecs = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.getRecommendations(
          user.user_id,
          cartItems,
          hour,
          dow,
          daysGap
        );
        
        if (isMounted) {
          setRecommendations(result.recommendations || []);
          setTierUsed(result.tier_used || 1);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Recommendations failed to load', err);
          setError(err);
          // Fallback UI data
          setRecommendations([
            { product_id: 13176, product_name: 'Bag of Organic Bananas', score: 0.95 },
            { product_id: 21137, product_name: 'Organic Strawberries', score: 0.82 },
          ]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecs();

    return () => {
      isMounted = false;
    };
  }, [user, cartItems, hour, dow, daysGap]);

  return { recommendations, tierUsed, loading, error };
};
