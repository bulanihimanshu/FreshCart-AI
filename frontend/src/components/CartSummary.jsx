import React from 'react';
import { useCart } from '../context/CartContext';

const CartSummary = () => {
  const { cartItems } = useCart();
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 40;
  const discount = subtotal >= 300 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + deliveryFee - discount;

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', padding: '28px', position: 'sticky', top: '84px' }}>
      <h3 className="font-fraunces" style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--green-pale)' }}>
        Order Summary
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        <div className="flex justify-between">
          <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: 'var(--text-primary)' }}>₹{subtotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery fee</span>
          {deliveryFee === 0 && subtotal > 0
            ? <span style={{ color: 'var(--green-bright)', fontWeight: 600 }}>FREE</span>
            : <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: 'var(--text-primary)' }}>₹{deliveryFee}</span>}
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span>Member discount (5%)</span>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>-₹{discount}</span>
          </div>
        )}
      </div>

      {subtotal > 0 && subtotal < 499 && (
        <div style={{ background: 'var(--amber-light)', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#92400e', marginBottom: '12px' }}>
          🚚 Add <strong>₹{(499 - subtotal).toFixed(0)}</strong> more for free delivery
        </div>
      )}

      <div className="flex justify-between" style={{ paddingTop: '14px', borderTop: '2px dashed var(--border)', marginTop: '8px' }}>
        <span className="font-fraunces" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Total</span>
        <span className="font-fraunces" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--green-mid)' }}>₹{total.toFixed(0)}</span>
      </div>

      <button disabled={cartItems.length === 0}
        style={{ width: '100%', background: cartItems.length === 0 ? '#ccc' : 'var(--green-dark)', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontFamily: "'Fraunces', serif", fontSize: '17px', fontWeight: 600, cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer', marginTop: '18px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        onMouseEnter={e => cartItems.length > 0 && (e.currentTarget.style.background = 'var(--green-mid)')}
        onMouseLeave={e => cartItems.length > 0 && (e.currentTarget.style.background = 'var(--green-dark)')}>
        Proceed to Checkout →
      </button>

      <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '14px' }}>
        🔒 Secure payment · Demo only
      </p>
    </div>
  );
};

export default CartSummary;
