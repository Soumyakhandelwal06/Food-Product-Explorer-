import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

export default function CartDrawer() {
  const {
    cartItems,
    setIsCartOpen,
    removeFromCart,
    updateQty,
    clearCart,
    totalItems,
  } = useCart()

  const [checkedOut, setCheckedOut] = useState(false)
  const [orderedItems, setOrderedItems] = useState([])

  function handleCheckout() {
    setOrderedItems([...cartItems])
    setCheckedOut(true)
    setTimeout(() => {
      clearCart()
      setCheckedOut(false)
      setIsCartOpen(false)
    }, 3000)
  }

  return (
    <>
      <div
        id="cart-overlay"
        className="cart-overlay"
        onClick={() => setIsCartOpen(false)}
        role="presentation"
      />

      <aside
        id="cart-drawer"
        className="cart-drawer"
        role="dialog"
        aria-label="Shopping Cart"
        aria-modal="true"
      >
        <div className="cart-header">
          <h2>🛒 Your Cart ({checkedOut ? 0 : totalItems})</h2>
          <button
            id="cart-close-btn"
            className="cart-close"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {checkedOut ? (
          <div className="cart-empty" style={{ gap: '12px' }}>
            <span className="cart-empty-icon" style={{ fontSize: '3rem' }}>✅</span>
            <p style={{ color: 'var(--grade-a)', fontWeight: 700, fontSize: '1.1rem' }}>Order Placed!</p>
            <small style={{ textAlign: 'center', lineHeight: 1.6 }}>
              {orderedItems.map(i => `${i.product_name || 'Product'} ×${i.qty}`).join(', ')}
            </small>
            <small style={{ color: 'var(--text-muted)' }}>Closing automatically…</small>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Your cart is empty</p>
            <small>Add some products to get started!</small>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.code} className="cart-item">
                  {item.image_url ? (
                    <img
                      className="cart-item-img"
                      src={item.image_url}
                      alt={item.product_name || 'Product'}
                      loading="lazy"
                      onError={e => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div
                    className="cart-item-img-placeholder"
                    style={{ display: item.image_url ? 'none' : 'flex' }}
                  >
                    🥫
                  </div>

                  <div className="cart-item-info">
                    <p className="cart-item-name">
                      {item.product_name || 'Unknown Product'}
                    </p>
                    <div className="cart-item-qty">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.code, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qty-number">{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.code, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.code)}
                    aria-label={`Remove ${item.product_name || 'product'} from cart`}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total items</span>
                <strong>{totalItems}</strong>
              </div>
              <button
                id="cart-checkout-btn"
                className="cart-checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              <button
                id="cart-clear-btn"
                className="clear-filters-btn"
                style={{ textAlign: 'center' }}
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
