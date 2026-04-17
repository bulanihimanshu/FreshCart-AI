import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Auth
export const login = async (username, password) => {
  const response = await api.post('/api/auth/login', { username, password });
  return response.data;
};

// Shop
export const getProducts = async (query = '') => {
  const response = await api.get('/api/search', { params: { query } });
  return response.data;
};

// Recommendations
export const getRecommendations = async (userId, cartItems, hour, dow, daysGap) => {
  const payload = {
    user_id: userId,
    cart_items: cartItems.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      aisle_id: 0,
    })),
    context: {
      order_hour_of_day: hour || 12,
      order_dow: dow || 0,
      days_since_prior_order: daysGap || 7,
    },
    top_k: 8,
  };
  const response = await api.post('/api/recommend', payload);
  return response.data;
};

export default {
  login,
  getProducts,
  getRecommendations,
};
