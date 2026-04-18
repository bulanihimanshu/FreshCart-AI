import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { getFoodEmoji } from '../utils/productUtils';
import toast from 'react-hot-toast';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 350);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { addItem } = useCart();
  const wrapperRef = useRef(null);
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  useEffect(() => {
    onSearchRef.current(debouncedQuery);
    if (debouncedQuery.length > 1) {
      api.getProducts(debouncedQuery)
        .then(data => { setResults(data.slice(0, 6)); setShowDropdown(true); })
        .catch(() => setResults([]));
    } else {
      setResults([]); setShowDropdown(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (product) => {
    addItem(product);
    toast.success(`${product.product_name} added to cart!`);
    setShowDropdown(false);
    setQuery('');
    onSearchRef.current('');
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none" style={{ color: 'var(--text-muted)' }}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); if (e.target.value.length > 1) setShowDropdown(true); }}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Search for groceries, brands..."
          style={{ border: '1.5px solid var(--border)', borderRadius: '14px', background: 'var(--green-pale)', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}
          className="w-full pl-11 pr-4 py-3 text-sm outline-none transition-all focus:bg-white"
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--green-bright)'; e.currentTarget.style.background = 'white'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--green-pale)'; }}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); setShowDropdown(false); onSearchRef.current(''); }}
            style={{ color: 'var(--text-muted)' }} className="absolute right-4 top-1/2 -translate-y-1/2 text-lg leading-none hover:opacity-60">×</button>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div style={{ border: '1px solid var(--border)', borderRadius: '14px', boxShadow: 'var(--shadow-lg)' }}
          className="absolute z-30 mt-1.5 w-full bg-white overflow-hidden">
          <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--green-pale)' }} className="px-4 py-2">
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }} className="font-medium uppercase tracking-wider">Search Results</span>
          </div>
          <ul>
            {results.map(product => (
              <li key={product.product_id} onClick={() => handleSelect(product)}
                style={{ borderBottom: '1px solid var(--green-pale)' }}
                className="px-4 py-3 flex items-center gap-3 cursor-pointer group transition-colors last:border-0"
                onMouseEnter={e => e.currentTarget.style.background = 'var(--green-pale)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ background: 'var(--green-light)' }} className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-xl">
                  {getFoodEmoji(product.product_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: 'var(--text-primary)' }} className="font-medium text-sm truncate">{product.product_name}</p>
                  <p style={{ color: 'var(--text-muted)' }} className="text-xs">{product.department} · Aisle {product.aisle_id}</p>
                </div>
                <span style={{ background: 'var(--amber-light)', color: 'var(--green-dark)', borderRadius: '12px' }}
                  className="text-xs font-medium px-2.5 py-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  + Add
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
