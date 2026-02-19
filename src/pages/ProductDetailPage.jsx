import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductDetail } from '../api/openFoodFacts.js'
import { useCart } from '../context/CartContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getGradeClass, getGradeLabel } from '../components/ProductCard.jsx'

const NUTRIMENT_LABELS = {
  'energy-kcal_100g': { label: 'Energy', unit: 'kcal' },
  'energy_100g': { label: 'Energy (kJ)', unit: 'kJ' },
  'fat_100g': { label: 'Fat', unit: 'g' },
  'saturated-fat_100g': { label: 'Saturated Fat', unit: 'g' },
  'carbohydrates_100g': { label: 'Carbohydrates', unit: 'g' },
  'sugars_100g': { label: 'Sugars', unit: 'g' },
  'fiber_100g': { label: 'Fiber', unit: 'g' },
  'proteins_100g': { label: 'Proteins', unit: 'g' },
  'salt_100g': { label: 'Salt', unit: 'g' },
  'sodium_100g': { label: 'Sodium', unit: 'g' },
}

export default function ProductDetailPage() {
  const { barcode } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProductDetail(barcode)
      .then(data => {
        if (data.status === 1 && data.product) {
          setProduct(data.product)
        } else {
          setError('Product not found for this barcode.')
        }
      })
      .catch(() => setError('Failed to fetch product. Please try again.'))
      .finally(() => setLoading(false))
  }, [barcode])

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <LoadingSpinner text="Fetching product details…" />

  if (error) {
    return (
      <div className="detail-page">
        <Link to="/" className="back-btn">← Back</Link>
        <div className="error-message">⚠️ {error}</div>
      </div>
    )
  }

  if (!product) return null

  const {
    product_name,
    image_url,
    categories,
    ingredients_text,
    nutrition_grades,
    nutriments = {},
    labels,
    code,
  } = product

  const gradeClass = getGradeClass(nutrition_grades)
  const gradeLabel = getGradeLabel(nutrition_grades)

  const categoryList = categories
    ? categories.split(',').map(c => c.trim()).filter(Boolean).slice(0, 8)
    : []

  const labelList = labels
    ? labels.split(',').map(l => l.trim()).filter(Boolean).slice(0, 6)
    : []

  const nutritionRows = Object.entries(NUTRIMENT_LABELS)
    .map(([key, { label, unit }]) => ({
      label,
      value: nutriments[key] !== undefined ? `${Number(nutriments[key]).toFixed(2)} ${unit}` : null,
    }))
    .filter(r => r.value !== null)

  return (
    <div className="detail-page">
      <Link to="/" className="back-btn" id="back-to-home">
        ← Back to Products
      </Link>

      <div className="detail-grid">
        {/* Left: Image + Grade + Cart */}
        <aside className="detail-image-card">
          {image_url ? (
            <img
              className="detail-image"
              src={image_url}
              alt={product_name || 'Product'}
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          <div
            className="detail-image-placeholder"
            style={{ display: image_url ? 'none' : 'flex' }}
          >
            🥫
          </div>

          <div className="detail-grade-display">
            <span className={`detail-grade-badge product-card-grade ${gradeClass}`}>
              {gradeLabel}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Nutrition Grade
            </span>
          </div>

          <button
            id="detail-add-cart-btn"
            className="detail-add-cart"
            onClick={handleAddToCart}
          >
            {added ? '✅ Added!' : '🛒 Add to Cart'}
          </button>
        </aside>

        {/* Right: Info */}
        <div className="detail-info">
          <div>
            <h1 className="detail-name">
              {product_name || 'Unknown Product'}
            </h1>
            <p className="detail-barcode">Barcode: {code || barcode}</p>
          </div>

          {/* Categories */}
          {categoryList.length > 0 && (
            <div className="detail-tags">
              {categoryList.map((cat, i) => (
                <span key={i} className="detail-tag">{cat}</span>
              ))}
            </div>
          )}

          {/* Labels */}
          {labelList.length > 0 && (
            <div className="section-card">
              <p className="section-title">Labels &amp; Certifications</p>
              <div className="detail-tags">
                {labelList.map((lbl, i) => (
                  <span key={i} className="detail-tag label-tag">{lbl}</span>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          <div className="section-card">
            <p className="section-title">Ingredients</p>
            {ingredients_text ? (
              <p className="ingredients-text">{ingredients_text}</p>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Ingredients not available for this product.
              </p>
            )}
          </div>

          {/* Nutritional Values */}
          {nutritionRows.length > 0 && (
            <div className="section-card">
              <p className="section-title">Nutritional Values (per 100g)</p>
              <table className="nutrition-table">
                <thead>
                  <tr>
                    <th>Nutrient</th>
                    <th>Per 100g</th>
                  </tr>
                </thead>
                <tbody>
                  {nutritionRows.map(({ label, value }) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {nutritionRows.length === 0 && (
            <div className="section-card">
              <p className="section-title">Nutritional Values</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Nutritional information not available for this product.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
