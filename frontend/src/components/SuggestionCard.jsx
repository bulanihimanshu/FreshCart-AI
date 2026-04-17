import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBasket, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const SuggestionCard = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({ ...product, price: 3.99 });
    toast.success(`${product.product_name} added to cart`);
  };

  return (
    <div className="bg-white rounded-lg border border-emerald-100 p-3 flex gap-3 shadow-sm hover:border-emerald-300 transition-colors">
      <div className="w-12 h-12 flex-shrink-0 bg-emerald-50 rounded text-emerald-500 flex items-center justify-center">
        <ShoppingBasket size={20} />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h4 className="text-sm font-medium text-slate-800 line-clamp-2 leading-tight">
          {product.product_name}
        </h4>
        {product.score && (
          <span className="text-[10px] uppercase font-bold text-emerald-500 mt-1">
            {(product.score * 100).toFixed(0)}% Match
          </span>
        )}
      </div>
      <div className="flex items-center">
        <button 
          onClick={handleAddToCart}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-50 border border-slate-200 text-slate-600 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition-colors"
          title="Add to cart"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;
