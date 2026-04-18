import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const initials = (user.display_name || user.username || 'U').slice(0, 2).toUpperCase();

  return (
    <header style={{ background: 'var(--green-dark)', boxShadow: 'var(--shadow-md)' }}
      className="sticky top-0 z-50 flex justify-between items-center px-10 h-16">

      <Link to="/shop" className="flex items-center gap-2.5 no-underline">
        <div style={{ background: 'var(--green-bright)', borderRadius: '50% 50% 50% 8px' }}
          className="w-8 h-8 flex items-center justify-center text-base">
          🌿
        </div>
        <span className="font-fraunces text-[22px] font-semibold text-white tracking-tight">FreshKart</span>
        <span style={{ color: '#6dd98c' }} className="text-xs font-medium ml-0.5">AI</span>
      </Link>

      <nav className="flex items-center gap-2">
        <Link to="/shop"
          style={{ color: location.pathname === '/shop' ? 'white' : '#a8ccb5' }}
          className="text-sm px-4 py-1.5 rounded-full hover:text-white transition-colors no-underline"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Products
        </Link>
        <Link to="/settings"
          style={{ color: location.pathname === '/settings' ? 'white' : '#a8ccb5' }}
          className="text-sm px-4 py-1.5 rounded-full hover:text-white transition-colors no-underline"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Settings
        </Link>

        <Link to="/cart"
          style={{ background: 'var(--amber)', color: 'var(--green-dark)', borderRadius: '20px' }}
          className="flex items-center gap-2 px-[18px] py-2 text-sm font-medium no-underline hover:opacity-90 hover:-translate-y-px transition-all">
          🛒
          <span>Cart</span>
          {totalItems > 0 && (
            <span style={{ background: 'var(--green-dark)', color: 'var(--amber)' }}
              className="w-5 h-5 rounded-full text-[11px] font-medium flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>

        <div style={{ background: 'var(--green-bright)' }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-medium ml-1 cursor-default"
          title={user.display_name || user.username}>
          {initials}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
