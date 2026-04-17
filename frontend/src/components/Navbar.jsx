import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBasket, ShoppingCart, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link to="/shop" className="flex items-center gap-2 group">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <ShoppingBasket size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              FreshCart <span className="text-emerald-500 font-black">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              to="/cart" 
              className={`flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors ${location.pathname === '/cart' ? 'text-emerald-600' : ''}`}
            >
              <div className="relative">
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="font-medium hidden sm:inline-block">Cart</span>
            </Link>

            <Link 
              to="/settings" 
              className={`flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors ${location.pathname === '/settings' ? 'text-emerald-600' : ''}`}
            >
              <Settings size={24} />
              <span className="font-medium hidden sm:inline-block">Settings</span>
            </Link>
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
