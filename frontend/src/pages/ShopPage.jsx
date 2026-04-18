import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import SuggestionPanel from '../components/SuggestionPanel';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const TRUST_ITEMS = [
  { icon: '🚚', title: 'Free Delivery', sub: 'On orders above ₹499' },
  { icon: '🌿', title: '100% Organic', sub: 'Certified fresh produce' },
  { icon: '🔄', title: 'Easy Returns', sub: '24-hour freshness promise' },
  { icon: '🔒', title: 'Secure Payments', sub: '256-bit SSL encryption' },
];

const SkeletonCard = () => (
  <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }} className="animate-pulse">
    <div style={{ height: '160px', background: 'var(--green-light)' }} />
    <div className="p-3.5 space-y-2">
      <div style={{ height: '10px', background: 'var(--green-light)', borderRadius: '4px', width: '40%' }} />
      <div style={{ height: '14px', background: 'var(--green-light)', borderRadius: '4px', width: '90%' }} />
      <div style={{ height: '14px', background: 'var(--green-light)', borderRadius: '4px', width: '60%' }} />
      <div className="flex justify-between items-center mt-3">
        <div style={{ height: '18px', width: '50px', background: 'var(--green-light)', borderRadius: '4px' }} />
        <div style={{ height: '36px', width: '36px', background: 'var(--green-light)', borderRadius: '50%' }} />
      </div>
    </div>
  </div>
);

const ShopPage = () => {
  const { user } = useAuth();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchProducts = useCallback(async (query) => {
    setLoading(true);
    try {
      const data = await api.getProducts(query);
      setAllProducts(data);
      setSearchQuery(query);
    } catch {
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(''); }, [fetchProducts]);

  const displayedProducts = useMemo(() => {
    if (!selectedCategory) return allProducts;
    return allProducts.filter(p =>
      (p.department || '').toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [allProducts, selectedCategory]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ background: 'var(--green-pale)', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ background: 'var(--green-dark)', minHeight: '320px', padding: '52px 40px', position: 'relative', overflow: 'hidden' }}
        className="hero-glow-1 flex items-center">
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }} className="relative z-10">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(45,138,80,0.3)', border: '1px solid rgba(45,138,80,0.4)', color: '#6dd98c', fontSize: '12px', fontWeight: 500, padding: '5px 14px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '18px' }}>
                🤖 LSTM-Powered Recommendations
              </div>
              <h1 style={{ fontSize: '46px', color: 'white', marginBottom: '14px', lineHeight: '1.08' }} className="font-fraunces">
                {greeting()}, <em style={{ color: '#6dd98c', fontStyle: 'italic' }}>{user?.display_name?.split(' ')[0] || user?.username}!</em>
              </h1>
              <p style={{ color: '#8aaa97', fontSize: '15px', lineHeight: '1.7', marginBottom: '28px', maxWidth: '400px' }}>
                Farm-fresh fruits, vegetables & daily essentials — handpicked and delivered to your door within hours.
              </p>

              {/* Search Bar */}
              <div style={{ maxWidth: '480px' }}>
                <SearchBar onSearch={fetchProducts} />
              </div>

              <div style={{ display: 'flex', gap: '32px', marginTop: '32px', paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {[['10k+', 'Happy Customers'], ['49k+', 'Products'], ['<30min', 'Delivery Time']].map(([num, lbl]) => (
                  <div key={lbl}>
                    <div className="font-fraunces" style={{ fontSize: '24px', color: 'white', fontWeight: 600 }}>{num}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right visual */}
            <div className="hidden xl:flex justify-center items-center relative">
              <div style={{ width: '320px', height: '320px', borderRadius: '50%', overflow: 'hidden', border: '4px solid rgba(45,138,80,0.4)', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop" alt="Fresh vegetables" className="w-full h-full object-cover" />
              </div>
              <div className="float-1" style={{ position: 'absolute', bottom: '50px', left: '-10px', background: 'white', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--shadow-lg)', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--green-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>✅</div>
                <div><p>100% Fresh</p><span style={{ fontSize: '11px', color: '#888', fontWeight: 400 }}>Guaranteed quality</span></div>
              </div>
              <div className="float-2" style={{ position: 'absolute', top: '60px', right: '-10px', background: 'white', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--shadow-lg)', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--amber-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⚡</div>
                <div><p>AI Powered</p><span style={{ fontSize: '11px', color: '#888', fontWeight: 400 }}>LSTM recommendations</span></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="trust-strip">
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px' }}>
          {TRUST_ITEMS.map(item => (
            <div key={item.title} className="flex items-center gap-3 text-white">
              <div style={{ fontSize: '22px', width: '44px', height: '44px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{item.title}</p>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '52px 20px 80px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h2 className="font-fraunces" style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {searchQuery ? `Results for "${searchQuery}"` : 'Our Products'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {!loading && `${displayedProducts.length} items available`}
            {!searchQuery && !loading && ' · Handpicked and delivered fresh every morning'}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div style={{ width: '200px', flexShrink: 0 }} className="hidden lg:block">
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>

          {/* Products + Suggestions */}
          <div className="flex-1 min-w-0 flex gap-6">
            <div className="flex-1 min-w-0">
              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : displayedProducts.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                  {displayedProducts.map((p, i) => <ProductCard key={p.product_id} product={p} index={i} />)}
                </div>
              ) : (
                <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', padding: '64px 20px', textAlign: 'center' }}>
                  <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🔍</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>No products found. Try a different search or category.</p>
                </div>
              )}
            </div>

            {/* Right AI Panel */}
            <div style={{ width: '260px', flexShrink: 0 }} className="hidden xl:block">
              <SuggestionPanel />
            </div>
          </div>
        </div>
      </div>

      <footer style={{ background: '#081a0e', color: '#8aaa97', textAlign: 'center', padding: '24px', fontSize: '13px' }}>
        <strong style={{ color: '#6dd98c' }}>FreshKart AI</strong> — LSTM-powered grocery recommendations · © 2025
      </footer>
    </div>
  );
};

export default ShopPage;
