import React from 'react';

const CategoryFilter = () => {
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'produce', name: 'Produce' },
    { id: 'dairy', name: 'Dairy & Eggs' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'bakery', name: 'Bakery' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Categories</h3>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id}>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
