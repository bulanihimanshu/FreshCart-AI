import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0d3b1e',
            color: 'white',
            borderRadius: '14px',
            fontSize: '14px',
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: '0 12px 40px rgba(13,59,30,0.3)',
            borderLeft: '4px solid #2d8a50',
            padding: '12px 20px',
          },
          success: { iconTheme: { primary: '#6dd98c', secondary: '#0d3b1e' } },
          error: { style: { borderLeft: '4px solid #e74c3c' } },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/shop" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
