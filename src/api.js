const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api'

function getToken() {
  return localStorage.getItem('mp_token')
}

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { headers, ...options })

  // Handle 401 - redirect to login
  if (res.status === 401) {
    localStorage.removeItem('mp_token')
    localStorage.removeItem('mp_user')
    window.location.href = '/login'
    throw new Error('Session expired. Please login again.')
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'API request failed')
  }
  return res.json()
}

// Helper: unwrap { success, data } envelope or return raw array
function unwrap(response) {
  if (response && response.success !== undefined) {
    // Handle paginated responses: { success, data: { products, pagination } }
    if (response.data && response.data.products) return response.data.products
    // Handle flat array responses: { success, data: [...] }
    if (Array.isArray(response.data)) return response.data
    // Handle single item: { success, data: {...} }
    return response.data
  }
  // If it's already an array or plain object, return as-is
  return response
}

/* ── Auth ── */
export const authAPI = {
  login: (email, password, role) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) }),
  register: (data) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  verifyOTP: (email, otp, tempUser) =>
    apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp, tempUser }) }),
  resendOTP: (email) =>
    apiFetch('/auth/resend-otp', { method: 'POST', body: JSON.stringify({ email }) }),
}

/* ── Paints ── */
export const paintsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const res = await apiFetch(`/paints${query ? '?' + query : ''}`)
    return unwrap(res)
  },
  getById: async (id) => {
    const res = await apiFetch(`/paints/${id}`)
    return unwrap(res)
  },
  create: (data) => apiFetch('/paints', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/paints/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/paints/${id}`, { method: 'DELETE' }),
}

/* ── Hardware ── */
export const hardwareAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const res = await apiFetch(`/hardware${query ? '?' + query : ''}`)
    return unwrap(res)
  },
  getById: async (id) => {
    const res = await apiFetch(`/hardware/${id}`)
    return unwrap(res)
  },
  create: (data) => apiFetch('/hardware', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/hardware/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/hardware/${id}`, { method: 'DELETE' }),
}

/* ── Unified Search ── */
export const searchAPI = {
  search: async (query) => {
    const res = await apiFetch(`/products/search?q=${encodeURIComponent(query)}`)
    return unwrap(res)
  },
}

/* ── Reviews ── */
export const reviewsAPI = {
  create: (data) => apiFetch('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getByProduct: (productId, type) => apiFetch(`/reviews/${productId}?type=${type}`),
}

/* ── Wishlist ── */
export const wishlistAPI = {
  get: async () => {
    const res = await apiFetch('/wishlist')
    return unwrap(res)
  },
  add: (productId, productType, variantId) => apiFetch('/wishlist', { method: 'POST', body: JSON.stringify({ productId, productType, variantId }) }),
  remove: (productId, variantId) => apiFetch(`/wishlist/${productId}${variantId ? '?variantId=' + variantId : ''}`, { method: 'DELETE' }),
  check: (productId, variantId) => apiFetch(`/wishlist/check/${productId}${variantId ? '?variantId=' + variantId : ''}`),
  clear: () => apiFetch('/wishlist', { method: 'DELETE' }),
}

/* ── Coupons ── */
export const couponsAPI = {
  getAll: () => apiFetch('/coupons'),
  create: (data) => apiFetch('/coupons', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/coupons/${id}`, { method: 'DELETE' }),
  validate: (code, orderAmount) => apiFetch('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, orderAmount }) }),
}

/* ── Orders ── */
export const ordersAPI = {
  getAll: async (userId) => {
    const res = await apiFetch(`/orders${userId ? '?userId=' + userId : ''}`)
    return unwrap(res)
  },
  getById: async (id) => {
    const res = await apiFetch(`/orders/${id}`)
    return unwrap(res)
  },
  create: async (orderData) => {
    const res = await apiFetch('/orders', { method: 'POST', body: JSON.stringify(orderData) })
    return unwrap(res)
  },
  updateStatus: (id, status) => apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
}

/* ── User Addresses ── */
export const addressAPI = {
  getAll: async () => {
    const res = await apiFetch('/users/me/addresses')
    return unwrap(res)
  },
  add: (address) => apiFetch('/users/me/address', { method: 'POST', body: JSON.stringify(address) }),
  delete: (id) => apiFetch(`/users/me/address/${id}`, { method: 'DELETE' }),
}

/* ── Inventory ── */
export const inventoryAPI = {
  getSummary: async () => {
    const res = await apiFetch('/inventory')
    return unwrap(res)
  },
  updateStock: (type, id, stock) => apiFetch(`/inventory/${type}/${id}/stock`, { method: 'PUT', body: JSON.stringify({ stock }) }),
}

/* ── Inventory Logs ── */
export const inventoryLogsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const res = await apiFetch(`/inventory-logs${query ? '?' + query : ''}`)
    return unwrap(res)
  },
}

/* ── Analytics ── */
export const analyticsAPI = {
  getAnalytics: async () => {
    const res = await apiFetch('/analytics')
    return unwrap(res)
  },
}

/* ── Users ── */
export const usersAPI = {
  getAll: async () => {
    const res = await apiFetch('/users')
    return unwrap(res)
  },
}

/* ── Suppliers ── */
export const suppliersAPI = {
  getAll: () => apiFetch('/suppliers'),
  create: (data) => apiFetch('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/suppliers/${id}`, { method: 'DELETE' }),
}

/* ── Recommendations ── */
export const recommendationsAPI = {
  get: (type, id) => apiFetch(`/recommendations/${type}/${id}`),
}

/* ── Alerts ── */
export const alertsAPI = {
  getLowStock: async () => {
    try {
      const res = await apiFetch('/inventory')
      const data = unwrap(res)
      
      // Extract low stock alerts from inventory data
      const lowStockProducts = data?.products?.filter(p => p.stock <= (p.minStock || 20)) || []
      
      return {
        totalAlerts: lowStockProducts.length,
        critical: lowStockProducts.filter(p => p.stock === 0).length,
        high: lowStockProducts.filter(p => p.stock > 0 && p.stock <= 5).length,
        medium: lowStockProducts.filter(p => p.stock > 5 && p.stock <= 20).length,
        alerts: lowStockProducts.map(p => ({
          ...p,
          urgency: p.stock === 0 ? 'critical' : p.stock <= 5 ? 'high' : 'medium'
        }))
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
      return {
        totalAlerts: 0,
        critical: 0,
        high: 0,
        medium: 0,
        alerts: []
      }
    }
  },
}

/* ── Contact ── */
export const contactAPI = {
  send: (data) => apiFetch('/contact', { method: 'POST', body: JSON.stringify(data) }),
}

/* ── Paint Calculator ── */
export const paintCalculatorAPI = {
  calculate: (data) => apiFetch('/paint-calculator/calculate', { method: 'POST', body: JSON.stringify(data) }),
  estimate: (data) => apiFetch('/paint-calculator/estimate', { method: 'POST', body: JSON.stringify(data) }),
  getRecommendations: (roomType) => apiFetch(`/paint-calculator/recommendations/${roomType}`),
  recommendProducts: (data) => apiFetch('/paint-calculator/recommend-products', { method: 'POST', body: JSON.stringify(data) }),
}

/* ── Color Matcher ── */
export const colorMatcherAPI = {
  match: (hex, maxResults, category, finish) => apiFetch('/color-matcher/match', { method: 'POST', body: JSON.stringify({ hex, maxResults, category, finish }) }),
  generatePalette: (hex) => apiFetch('/color-matcher/palette', { method: 'POST', body: JSON.stringify({ hex }) }),
  getColors: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/color-matcher/colors${query ? '?' + query : ''}`)
  },
  extractColors: (imageData) => apiFetch('/color-matcher/extract', { method: 'POST', body: JSON.stringify({ imageData }) }),
}

/* ── Service Providers ── */
export const serviceProvidersAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const res = await apiFetch(`/service-providers${query ? '?' + query : ''}`)
    return unwrap(res)
  },
  getById: async (id) => {
    const res = await apiFetch(`/service-providers/${id}`)
    return unwrap(res)
  },
  match: (data) => apiFetch('/service-providers/match', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => apiFetch('/service-providers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/service-providers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getMyProfile: async () => {
    const res = await apiFetch('/service-providers/my/profile')
    return unwrap(res)
  },
}

/* ── Service Bookings ── */
export const serviceBookingsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const res = await apiFetch(`/service-bookings${query ? '?' + query : ''}`)
    return unwrap(res)
  },
  getById: async (id) => {
    const res = await apiFetch(`/service-bookings/${id}`)
    return unwrap(res)
  },
  create: (data) => apiFetch('/service-bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status, note) => apiFetch(`/service-bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, note }) }),
  updatePayment: (id, type, status, transactionId, method) => apiFetch(`/service-bookings/${id}/payment`, { method: 'PUT', body: JSON.stringify({ type, status, transactionId, method }) }),
  complete: (id, data) => apiFetch(`/service-bookings/${id}/complete`, { method: 'POST', body: JSON.stringify(data) }),
  rate: (id, rating, review, ratingType) => apiFetch(`/service-bookings/${id}/rate`, { method: 'POST', body: JSON.stringify({ rating, review, ratingType }) }),
  cancel: (id, reason) => apiFetch(`/service-bookings/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
}

/* ── Payments ── */
export const paymentsAPI = {
  generateQR: (orderId, amount, shippingAddress) => apiFetch('/payments/generate-qr', { method: 'POST', body: JSON.stringify({ orderId, amount, shippingAddress }) }),
  uploadScreenshot: async (paymentId, file) => {
    const token = getToken()
    const formData = new FormData()
    formData.append('screenshot', file)
    
    const res = await fetch(`${API_BASE}/payments/${paymentId}/upload-screenshot`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }))
      throw new Error(err.message || 'Upload failed')
    }
    return res.json()
  },
  getMyPayments: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const res = await apiFetch(`/payments/my-payments${query ? '?' + query : ''}`)
    return unwrap(res)
  },
  getById: async (id) => {
    const res = await apiFetch(`/payments/${id}`)
    return unwrap(res)
  },
  // Admin endpoints
  getPending: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const res = await apiFetch(`/payments/admin/pending${query ? '?' + query : ''}`)
    return unwrap(res)
  },
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const res = await apiFetch(`/payments/admin/all${query ? '?' + query : ''}`)
    return unwrap(res)
  },
  verify: (id) => apiFetch(`/payments/${id}/verify`, { method: 'PUT' }),
  reject: (id, reason) => apiFetch(`/payments/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) }),
}
