import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import api from '../api/client';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock initial fetch if no search
  useEffect(() => {
    fetchProducts('');
  }, []);

  const fetchProducts = async (query) => {
    setLoading(true);
    try {
      const data = await api.getProducts(query);
      setProducts(data);
    } catch (err) {
      console.error(err);
      // fallback mock data if API is down
      setProducts([
        { product_id: 24852, product_name: 'Banana', aisle_id: 24 },
        { product_id: 13176, product_name: 'Bag of Organic Bananas', aisle_id: 24 },
        { product_id: 21137, product_name: 'Organic Strawberries', aisle_id: 24 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0 hidden md:block">
            <CategoryFilter />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <SearchBar onSearch={fetchProducts} />
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.length > 0 ? (
                  products.map((p) => <ProductCard key={p.product_id} product={p} />)
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
                    No products found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar Placeholder (Suggestion Panel) */}
          <div className="w-72 flex-shrink-0 hidden xl:block">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 h-full min-h-[400px] flex items-center justify-center text-emerald-600 text-sm font-medium">
              Recommendations will appear here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
