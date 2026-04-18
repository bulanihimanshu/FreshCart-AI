import React from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { getFoodEmoji, getMockPrice } from '../utils/productUtils';

const SuggestionCard = ({ product }) => {
  const { cartItems, addItem } = useCart();
  const inCart = cartItems.some(i => i.product_id === product.product_id);
  const emoji = getFoodEmoji(product.product_name);
  const price = getMockPrice(product.product_id);

  const handleAdd = () => {
    if (inCart) return;
    addItem({ ...product, price: parseFloat(price) });
    toast.success(`${product.product_name} added!`);
  };

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}
      className="flex items-center gap-3 p-3 transition-all"
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-bright)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>

      <div style={{ background: 'var(--green-light)', borderRadius: '10px' }}
        className="w-11 h-11 shrink-0 flex items-center justify-center text-2xl">
        {emoji}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-fraunces font-semibold line-clamp-1 leading-tight" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
          {product.product_name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span style={{ color: 'var(--green-mid)', fontWeight: 600, fontSize: '13px', fontFamily: "'Fraunces', serif" }}>₹{price}</span>
          {product.score != null && (
            <span style={{ color: 'var(--green-bright)', fontSize: '10px', fontWeight: 600 }}>
              {Math.round(product.score * 100)}% match
            </span>
          )}
        </div>
      </div>

      <button onClick={handleAdd} disabled={inCart}
        style={inCart
          ? { background: 'var(--green-light)', color: 'var(--green-mid)', borderRadius: '50%', width: '32px', height: '32px' }
          : { background: 'var(--green-dark)', color: 'white', borderRadius: '50%', width: '32px', height: '32px' }}
        className="shrink-0 flex items-center justify-center text-lg font-bold transition-all hover:opacity-80 active:scale-95">
        {inCart ? '✓' : '+'}
      </button>
    </div>
  );
};

export default SuggestionCard;
