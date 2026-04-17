import React from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartSummary = () => {
  const { cartItems } = useCart();
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const delivery = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + delivery;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-fit">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Order Summary</h3>
      
      <div className="space-y-4 text-sm text-slate-600 mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>${delivery.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-4 border-t border-slate-100 font-bold text-lg text-slate-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button 
        disabled={cartItems.length === 0}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2 text-lg"
      >
        Checkout <ArrowRight size={20} />
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        This is a demo. Payments are simulated.
      </p>
    </div>
  );
};

export default CartSummary;
