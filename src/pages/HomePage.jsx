import { useEffect } from 'react'
import { useApp } from '../context/AppContext.jsx'
import SearchBar from '../components/SearchBar.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import SortControls from '../components/SortControls.jsx'
import ProductCard from '../components/ProductCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function HomePage() {
  const {
    products,
    loading,
    error,
    hasMore,
    loadMore,
    fetchProducts,
    searchMode,
    selectedCategory,
    searchQuery,
  } = useApp()

  // Initial fetch on mount
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts({})
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="home-page">
      <header className="home-hero">
        <h1>Discover Food Products</h1>
        <p>Search, filter &amp; explore food facts from around the world</p>
      </header>

      <SearchBar />

      <div className="controls-bar">
        <CategoryFilter />
        <SortControls />
        {products.length > 0 && (
          <span className="results-count">
            {products.length} product{products.length !== 1 ? 's' : ''} shown
          </span>
        )}
      </div>

      {error && (
        <div className="error-message" role="alert">
          ⚠️ {error}
        </div>
      )}

      {searchMode === 'barcode' && products.length === 1 && (
        <p className="barcode-mode-note">
          ✅ Barcode result
        </p>
      )}

      {!loading && products.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try a different search term or category</p>
        </div>
      )}

      <section
        id="product-grid"
        className="product-grid"
        aria-label="Product list"
      >
        {products.map((product, i) => (
          <ProductCard key={product.code || i} product={product} index={i} />
        ))}
      </section>

      {loading && <LoadingSpinner text="Loading products…" />}

      {!loading && hasMore && searchMode !== 'barcode' && products.length > 0 && (
        <div className="load-more-container">
          <button
            id="load-more-btn"
            className="load-more-btn"
            onClick={loadMore}
          >
            <span>Load More Products</span>
          </button>
        </div>
      )}
    </div>
  )
}
