import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Search } from 'lucide-react';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    onSearch(debouncedQuery);
    
    if (debouncedQuery.length > 1) {
      api.getProducts(debouncedQuery).then(data => {
        setResults(data.slice(0, 5));
        setShowDropdown(true);
      }).catch(console.error);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [debouncedQuery, onSearch]);

  const handleSelect = (product) => {
    addItem(product);
    toast.success(`${product.product_name} added to cart`);
    setShowDropdown(false);
    setQuery('');
  };

  return (
    <div className="relative w-full mb-6 relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Search for groceries..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm"
        />
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-slate-100 max-h-60 overflow-hidden">
          <ul>
            {results.map((product) => (
              <li 
                key={product.product_id}
                onClick={() => handleSelect(product)}
                className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-center"
              >
                <span className="font-medium text-slate-700">{product.product_name}</span>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Aisle {product.aisle_id}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
