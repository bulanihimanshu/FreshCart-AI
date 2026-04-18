import React from 'react';
import { useCart } from '../context/CartContext';
import CartSummary from '../components/CartSummary';
import ForgottenItems from '../components/ForgottenItems';
import { Link } from 'react-router-dom';
import { getFoodEmoji, getDeptStyle, getMockPrice } from '../utils/productUtils';

const CartPage = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();

  return (
    <div style={{ background: 'var(--green-pale)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 20px 80px' }}>
        <h1 className="font-fraunces" style={{ fontSize: '34px', color: 'var(--text-primary)', marginBottom: '6px' }}>Your Cart</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', fontSize: '14px' }}>
          {cartItems.length === 0 ? 'Your cart is empty' : `${cartItems.reduce((a, i) => a + i.quantity, 0)} items in your cart`}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>
          {/* Cart items */}
          <div>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '56px', display: 'block', marginBottom: '14px' }}>🛒</span>
                  <p className="font-fraunces" style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Your cart is empty</p>
                  <p style={{ fontSize: '14px', marginBottom: '24px' }}>Add some fresh items to get started!</p>
                  <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--green-dark)', color: 'white', padding: '13px 28px', borderRadius: '28px', textDecoration: 'none', fontFamily: "'Fraunces', serif", fontSize: '15px', fontWeight: 600 }}>
                    Shop Now →
                  </Link>
                </div>
              ) : cartItems.map((item, idx) => {
                const style = getDeptStyle(item.department);
                const emoji = getFoodEmoji(item.product_name);
                const price = item.price || getMockPrice(item.product_id);
                return (
                  <div key={item.product_id}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderBottom: idx < cartItems.length - 1 ? '1px solid var(--green-pale)' : 'none' }}>
                    <div style={{ width: '56px', height: '56px', background: style.iconBg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
                      {emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="font-fraunces" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{item.product_name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.department || 'Grocery'}</p>
                    </div>
                    <span className="font-fraunces" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--green-mid)', minWidth: '60px', textAlign: 'right' }}>
                      ₹{(price * item.quantity).toFixed(0)}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        style={{ width: '30px', height: '30px', background: 'var(--green-light)', color: 'var(--green-dark)', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ width: '24px', textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        style={{ width: '30px', height: '30px', background: 'var(--green-dark)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.product_id)}
                      style={{ width: '30px', height: '30px', background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', transition: 'all 0.18s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#e74c3c'; e.currentTarget.style.color = '#e74c3c'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '36px' }}>
              <ForgottenItems />
            </div>
          </div>

          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
