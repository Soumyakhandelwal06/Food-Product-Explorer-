import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.code === product.code)
      if (existing) {
        return prev.map(i =>
          i.code === product.code ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
    setIsCartOpen(true)
  }, [])

  const removeFromCart = useCallback((code) => {
    setCartItems(prev => prev.filter(i => i.code !== code))
  }, [])

  const updateQty = useCallback((code, qty) => {
    if (qty <= 0) {
      setCartItems(prev => prev.filter(i => i.code !== code))
      return
    }
    setCartItems(prev =>
      prev.map(i => i.code === code ? { ...i, qty } : i)
    )
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const totalItems = cartItems.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen, setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      totalItems,
    }}>
      {children}
    </CartContext.Provider>
  )
}
