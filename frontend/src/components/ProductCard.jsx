import React from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { getFoodEmoji, getDeptStyle, getMockPrice } from '../utils/productUtils';

const ProductCard = ({ product, index = 0 }) => {
  const { cartItems, addItem, updateQuantity } = useCart();
  const cartItem = cartItems.find(i => i.product_id === product.product_id);
  const style = getDeptStyle(product.department);
  const emoji = getFoodEmoji(product.product_name);
  const price = cartItem?.price || getMockPrice(product.product_id);

  const handleAdd = () => {
    addItem({ ...product, price: parseFloat(price) });
    toast.success(`${product.product_name} added!`);
  };

  return (
    <div className="card-animate" style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}>
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}
        className="relative flex flex-col transition-all duration-250 hover:-translate-y-1"
        onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>

        {/* Image area */}
        <div style={{ background: style.iconBg, height: '160px' }}
          className="flex items-center justify-center text-6xl relative">
          <span className="select-none">{emoji}</span>
          {product.department && (
            <span style={{ background: 'var(--amber)', color: 'var(--green-dark)', borderRadius: '20px', top: '12px', left: '12px', fontSize: '11px' }}
              className="absolute font-medium px-2.5 py-0.5">
              {product.department}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-3.5 flex flex-col flex-1">
          <p style={{ color: 'var(--text-muted)', fontSize: '11px' }} className="mb-0.5">Aisle {product.aisle_id}</p>
          <p className="font-fraunces font-semibold line-clamp-2 flex-1 mb-2"
            style={{ color: 'var(--text-primary)', fontSize: '16px', lineHeight: '1.25' }}>
            {product.product_name}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="font-fraunces font-semibold" style={{ color: 'var(--green-mid)', fontSize: '20px' }}>
              ₹{price} <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>/unit</span>
            </span>

            {cartItem ? (
              <div style={{ background: 'var(--green-light)', borderRadius: '12px' }} className="flex items-center gap-1 px-1 py-0.5">
                <button onClick={() => updateQuantity(cartItem.product_id, cartItem.quantity - 1)}
                  style={{ background: 'white', color: 'var(--green-mid)', borderRadius: '8px', width: '28px', height: '28px' }}
                  className="flex items-center justify-center font-bold text-lg hover:opacity-80 transition-opacity">
                  −
                </button>
                <span style={{ color: 'var(--green-dark)', fontWeight: 600, minWidth: '20px', textAlign: 'center', fontSize: '14px' }}>
                  {cartItem.quantity}
                </span>
                <button onClick={() => updateQuantity(cartItem.product_id, cartItem.quantity + 1)}
                  style={{ background: 'var(--green-dark)', color: 'white', borderRadius: '8px', width: '28px', height: '28px' }}
                  className="flex items-center justify-center font-bold text-lg hover:opacity-80 transition-opacity">
                  +
                </button>
              </div>
            ) : (
              <button onClick={handleAdd}
                style={{ background: 'var(--green-dark)', color: 'white', borderRadius: '50%', width: '36px', height: '36px', fontSize: '20px', lineHeight: '1' }}
                className="flex items-center justify-center flex-shrink-0 transition-all hover:opacity-80 active:scale-95">
                +
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
