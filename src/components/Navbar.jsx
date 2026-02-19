import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import CartDrawer from './CartDrawer.jsx'

export default function Navbar() {
  const { totalItems, isCartOpen, setIsCartOpen } = useCart()

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo-icon">🥗</div>
          <span className="navbar-title">Food Explorer</span>
        </Link>

        <div className="navbar-actions">
          <button
            id="cart-toggle-btn"
            className="cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            🛒 Cart
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </button>
        </div>
      </nav>

      {isCartOpen && <CartDrawer />}
    </>
  )
}
