import axios from 'axios'

const BASE_URL = 'https://world.openfoodfacts.org'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'User-Agent': 'FoodProductExplorer/1.0',
  },
})

// Retry helper: retries up to `retries` times with exponential backoff
const withRetry = async (fn, retries = 2, delay = 1000) => {
  try {
    return await fn()
  } catch (err) {
    if (retries <= 0) throw err
    await new Promise(r => setTimeout(r, delay))
    return withRetry(fn, retries - 1, delay * 1.5)
  }
}

/**
 * Search products by name
 */
export const searchByName = (query, page = 1) =>
  withRetry(() => api.get('/cgi/search.pl', {
    params: {
      search_terms: query,
      search_simple: 1,
      action: 'process',
      json: 1,
      page,
      page_size: 24,
      fields: 'code,product_name,image_url,categories,ingredients_text,nutrition_grades,nutriments,labels',
    },
  }).then(r => r.data))

/**
 * Search product by barcode
 */
export const searchByBarcode = (barcode) =>
  withRetry(() => api.get(`/api/v0/product/${barcode}.json`).then(r => r.data))

/**
 * Get products by category
 */
export const getProductsByCategory = (category, page = 1) =>
  withRetry(() => api.get(`/category/${category}.json`, {
    params: { page },
  }).then(r => r.data))

/**
 * Get list of categories
 */
export const getCategories = () =>
  withRetry(() => api.get('/categories.json').then(r => r.data), 1)

/**
 * Get product detail by barcode
 */
export const getProductDetail = (barcode) =>
  withRetry(() => api.get(`/api/v0/product/${barcode}.json`).then(r => r.data))

/**
 * Get world products (default homepage load)
 */
export const getWorldProducts = (page = 1) =>
  withRetry(() => api.get('/cgi/search.pl', {
    params: {
      action: 'process',
      json: 1,
      page,
      page_size: 24,
      sort_by: 'popularity',
      fields: 'code,product_name,image_url,categories,ingredients_text,nutrition_grades,nutriments,labels',
    },
  }).then(r => r.data))
