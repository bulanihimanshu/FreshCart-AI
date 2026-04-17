import React from 'react';
import { useCart } from '../context/CartContext';
import CartSummary from '../components/CartSummary';
import { Link } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';

const CartPage = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                  <ShoppingBag size={40} />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">Your cart is feeling a little light</h2>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">Browse our fresh products and start filling it up!</p>
                <Link to="/shop" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-medium text-slate-800">{item.product_name}</h3>
                      <p className="text-emerald-500 font-semibold mt-1">${item.price?.toFixed(2) || '2.99'}</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-10 text-center font-semibold text-slate-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.product_id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2"
                        title="Remove from cart"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Forgotten Items placeholder for Wave 4 */}
            <div id="forgotten-items-container" className="mt-8"></div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[350px] flex-shrink-0">
            <CartSummary />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CartPage;
