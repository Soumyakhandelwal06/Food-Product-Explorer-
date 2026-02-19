import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export function getGradeClass(grade) {
  if (!grade) return 'grade-unknown'
  const g = grade.toLowerCase()
  if (['a', 'b', 'c', 'd', 'e'].includes(g)) return `grade-${g}`
  return 'grade-unknown'
}

export function getGradeLabel(grade) {
  return grade ? grade.toUpperCase() : '?'
}

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const {
    code,
    product_name,
    image_url,
    categories,
    ingredients_text,
    nutrition_grades,
  } = product

  const displayName = product_name || 'Unknown Product'
  const gradeClass = getGradeClass(nutrition_grades)
  const gradeLabel = getGradeLabel(nutrition_grades)
  const category = categories
    ? categories.split(',')[0].trim()
    : 'Uncategorized'

  const handleClick = (e) => {
    if (e.target.closest('.add-to-cart-btn')) return
    if (code) navigate(`/product/${code}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <article
      className="product-card"
      onClick={handleClick}
      style={{ animationDelay: `${Math.min(index, 11) * 0.04}s` }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${displayName}`}
      onKeyDown={e => e.key === 'Enter' && handleClick(e)}
    >
      {image_url ? (
        <img
          className="product-card-img"
          src={image_url}
          alt={displayName}
          loading="lazy"
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className="product-card-img-placeholder"
        style={{ display: image_url ? 'none' : 'flex' }}
      >
        🥫
      </div>

      <div className="product-card-body">
        <div className="product-card-header">
          <h3 className="product-card-name">{displayName}</h3>
          <span
            className={`product-card-grade ${gradeClass}`}
            title={`Nutrition Grade: ${gradeLabel}`}
          >
            {gradeLabel}
          </span>
        </div>

        <p className="product-card-category">{category}</p>

        {ingredients_text && (
          <p className="product-card-ingredients">{ingredients_text}</p>
        )}

        <div className="product-card-footer">
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            aria-label={`Add ${displayName} to cart`}
          >
            + Cart
          </button>
        </div>
      </div>
    </article>
  )
}
