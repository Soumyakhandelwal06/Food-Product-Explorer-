import { useEffect, useState } from 'react'
import { getCategories } from '../api/openFoodFacts.js'
import { useApp } from '../context/AppContext.jsx'

// Popular categories as fallback / quick picks
const POPULAR_CATEGORIES = [
  { id: 'beverages', name: 'Beverages' },
  { id: 'dairy', name: 'Dairy' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'cereals-and-their-products', name: 'Cereals' },
  { id: 'chocolates', name: 'Chocolates' },
  { id: 'biscuits-and-cakes', name: 'Biscuits & Cakes' },
  { id: 'fruits-and-vegetables', name: 'Fruits & Vegetables' },
  { id: 'meats', name: 'Meats' },
  { id: 'frozen-foods', name: 'Frozen Foods' },
  { id: 'sauces', name: 'Sauces' },
  { id: 'breads', name: 'Breads' },
  { id: 'ice-creams', name: 'Ice Creams' },
]

export default function CategoryFilter() {
  const { selectedCategory, setSelectedCategory, fetchProducts, searchMode } = useApp()
  const [categories, setCategories] = useState(POPULAR_CATEGORIES)

  useEffect(() => {
    // Try to load categories from API, fall back to popular ones
    getCategories()
      .then(data => {
        const cats = (data.tags || [])
          .filter(c => c.products > 1000)
          .sort((a, b) => b.products - a.products)
          .slice(0, 60)
          .map(c => ({
            id: c.id?.replace('en:', '') || c.name,
            name: c.name,
          }))
        if (cats.length > 0) setCategories(cats)
      })
      .catch(() => {
        // silently use default
      })
  }, [])

  const handleChange = (e) => {
    const cat = e.target.value
    setSelectedCategory(cat)
    fetchProducts({ category: cat, query: '', mode: 'name' })
  }

  const handleClear = () => {
    setSelectedCategory('')
    fetchProducts({ category: '', query: '', mode: 'name' })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="controls-label">Category</span>
      <select
        id="category-filter-select"
        className="filter-select"
        value={selectedCategory}
        onChange={handleChange}
        disabled={searchMode === 'barcode'}
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      {selectedCategory && (
        <button
          id="clear-category-btn"
          className="clear-filters-btn"
          onClick={handleClear}
          aria-label="Clear category filter"
        >
          ✕ Clear
        </button>
      )}
    </div>
  )
}
