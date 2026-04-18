import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const login = async (username, password) => {
  const response = await api.post('/api/auth/login', { username, password });
  return response.data.user;
};

export const getProducts = async (query = '') => {
  const response = await api.get('/api/products', {
    params: { query: query.trim(), limit: 30 },
  });
  return response.data;
};

export const getRecommendations = async (userId, cartItems, hour, dow, daysGap) => {
  const payload = {
    user_id: userId,
    cart_items: cartItems.map((item) => item.product_id),
    hour: hour ?? 12,
    dow: dow ?? 0,
    days_gap: daysGap ?? 7,
    top_k: 5,
  };
  const response = await api.post('/api/recommend', payload);
  return response.data;
};

export default { login, getProducts, getRecommendations };
