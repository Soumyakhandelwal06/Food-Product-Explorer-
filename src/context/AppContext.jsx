import { createContext, useContext, useState, useCallback, useRef } from 'react'
import {
  searchByName,
  searchByBarcode,
  getProductsByCategory,
  getWorldProducts,
} from '../api/openFoodFacts.js'

const AppContext = createContext(null)

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function AppProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [barcodeQuery, setBarcodeQuery] = useState('')
  const [searchMode, setSearchMode] = useState('name') // 'name' | 'barcode'
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('default')

  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [barcodeProduct, setBarcodeProduct] = useState(null)

  // Sorting helper
  const sortProducts = useCallback((prods, sort) => {
    const list = [...prods]
    const gradeOrder = { a: 1, b: 2, c: 3, d: 4, e: 5, unknown: 6 }
    switch (sort) {
      case 'name_asc':
        return list.sort((a, b) =>
          (a.product_name || '').localeCompare(b.product_name || ''))
      case 'name_desc':
        return list.sort((a, b) =>
          (b.product_name || '').localeCompare(a.product_name || ''))
      case 'grade_asc':
        return list.sort((a, b) =>
          (gradeOrder[a.nutrition_grades?.toLowerCase()] || 6) -
          (gradeOrder[b.nutrition_grades?.toLowerCase()] || 6))
      case 'grade_desc':
        return list.sort((a, b) =>
          (gradeOrder[b.nutrition_grades?.toLowerCase()] || 6) -
          (gradeOrder[a.nutrition_grades?.toLowerCase()] || 6))
      default:
        return list
    }
  }, [])

  // Fetch first page (fresh search)
  const fetchProducts = useCallback(async ({ query, category, mode, currentSortBy } = {}) => {
    setLoading(true)
    setError(null)
    setBarcodeProduct(null)
    setPage(1)

    const q = query !== undefined ? query : searchQuery
    const cat = category !== undefined ? category : selectedCategory
    const m = mode !== undefined ? mode : searchMode
    const sort = currentSortBy !== undefined ? currentSortBy : sortBy

    try {
      if (m === 'barcode') {
        // barcode mode: single product lookup
        if (!q) { setProducts([]); setHasMore(false); setLoading(false); return }
        const data = await searchByBarcode(q)
        if (data.status === 1 && data.product) {
          setBarcodeProduct(data.product)
          setProducts([data.product])
        } else {
          setProducts([])
          setError('No product found for this barcode.')
        }
        setHasMore(false)
      } else if (cat) {
        const data = await getProductsByCategory(cat, 1)
        const prods = data.products || []
        setProducts(sortProducts(prods, sort))
        setHasMore(prods.length >= 20)
      } else if (q) {
        const data = await searchByName(q, 1)
        const prods = data.products || []
        setProducts(sortProducts(prods, sort))
        setHasMore(prods.length >= 20)
      } else {
        const data = await getWorldProducts(1)
        const prods = data.products || []
        setProducts(sortProducts(prods, sort))
        setHasMore(prods.length >= 20)
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategory, searchMode, sortBy, sortProducts])

  // Load more (next page)
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || searchMode === 'barcode') return
    setLoading(true)
    const nextPage = page + 1
    try {
      let data
      if (selectedCategory) {
        data = await getProductsByCategory(selectedCategory, nextPage)
      } else if (searchQuery) {
        data = await searchByName(searchQuery, nextPage)
      } else {
        data = await getWorldProducts(nextPage)
      }
      const prods = data.products || []
      setProducts(prev => sortProducts([...prev, ...prods], sortBy))
      setHasMore(prods.length >= 20)
      setPage(nextPage)
    } catch (err) {
      setError('Failed to load more products.')
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, searchQuery, selectedCategory, searchMode, sortBy, sortProducts])

  // Re-sort existing products without re-fetching
  const applySort = useCallback((sort) => {
    setSortBy(sort)
    setProducts(prev => sortProducts(prev, sort))
  }, [sortProducts])

  return (
    <AppContext.Provider value={{
      searchQuery, setSearchQuery,
      barcodeQuery, setBarcodeQuery,
      searchMode, setSearchMode,
      selectedCategory, setSelectedCategory,
      sortBy, setSortBy: applySort,
      products, setProducts,
      page, hasMore,
      loading, error,
      barcodeProduct,
      fetchProducts,
      loadMore,
    }}>
      {children}
    </AppContext.Provider>
  )
}
