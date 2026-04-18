import React from 'react';

const CATEGORIES = [
  { id: '', label: 'All Items', emoji: '🛒' },
  { id: 'produce', label: '🍎 Fruits & Veg', emoji: '' },
  { id: 'dairy', label: '🥛 Dairy & Eggs', emoji: '' },
  { id: 'meat', label: '🍗 Meat & Fish', emoji: '' },
  { id: 'bakery', label: '🍞 Bakery', emoji: '' },
  { id: 'snacks', label: '🍿 Snacks', emoji: '' },
  { id: 'beverages', label: '🧃 Beverages', emoji: '' },
  { id: 'frozen', label: '❄️ Frozen', emoji: '' },
  { id: 'pantry', label: '🫙 Pantry', emoji: '' },
  { id: 'personal care', label: '🧴 Personal Care', emoji: '' },
];

const CategoryFilter = ({ selected, onSelect }) => {
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}
      className="p-4 sticky top-20">
      <h3 style={{ color: 'var(--text-secondary)', fontSize: '11px' }} className="font-semibold uppercase tracking-widest mb-3 px-2">
        Categories
      </h3>
      <ul className="space-y-0.5">
        {CATEGORIES.map(cat => {
          const active = selected === cat.id;
          return (
            <li key={cat.id}>
              <button onClick={() => onSelect(cat.id)}
                style={active
                  ? { background: 'var(--green-dark)', color: 'white', borderRadius: '20px' }
                  : { color: 'var(--text-secondary)', borderRadius: '20px' }}
                className="w-full text-left px-3.5 py-2 text-sm font-medium transition-all"
                onMouseEnter={e => !active && (e.currentTarget.style.background = 'var(--green-pale)')}
                onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}>
                {cat.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryFilter;
