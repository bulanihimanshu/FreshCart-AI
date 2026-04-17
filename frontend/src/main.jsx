import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { TimeProvider } from './context/TimeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <TimeProvider>
          <App />
        </TimeProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
