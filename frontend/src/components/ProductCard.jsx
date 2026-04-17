import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBasket, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { cartItems, addItem, updateQuantity } = useCart();
  const cartItem = cartItems.find((i) => i.product_id === product.product_id);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.product_name} added to cart`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="mb-4 flex justify-between items-start">
        <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 mb-3">
          <ShoppingBasket size={24} />
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
          Aisle {product.aisle_id}
        </span>
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium text-slate-800 leading-tight mb-1">{product.product_name}</h3>
        <p className="text-lg font-bold text-slate-900 mb-4">${cartItem?.price?.toFixed(2) || '2.99'}</p>
      </div>

      <div className="mt-auto">
        {cartItem ? (
          <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-1">
            <button 
              onClick={() => updateQuantity(cartItem.product_id, cartItem.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-emerald-600 shadow-sm hover:bg-emerald-100"
            >
              <Minus size={16} />
            </button>
            <span className="font-semibold text-emerald-800">{cartItem.quantity}</span>
            <button 
              onClick={() => updateQuantity(cartItem.product_id, cartItem.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-emerald-600 shadow-sm hover:bg-emerald-100"
            >
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleAddToCart}
            className="w-full py-2 bg-slate-50 hover:bg-emerald-500 text-slate-700 hover:text-white border border-slate-200 hover:border-emerald-500 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
