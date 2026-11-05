// Llamadas a la API del backend (ver el contrato del Hito 1).
// En desarrollo apunta a localhost; en producción se define VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

async function request(path, { method = 'GET', token, body } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: body && JSON.stringify(body) })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }

  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) {
    const error = new Error(data.error || 'Ocurrió un error')
    error.status = res.status
    throw error
  }
  return data
}

// los formularios entregan texto; el backend espera números
const toNumber = (value) => (value === '' || value === undefined ? undefined : Number(value))

// POST /api/users
export const register = (data) => request('/users', { method: 'POST', body: data })

// POST /api/login
export const login = (email, password) => request('/login', { method: 'POST', body: { email, password } })

// GET /api/categories
export const getCategories = () => request('/categories')

// GET /api/products?category=&name=&order=
export function getProducts({ category, name, order } = {}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (name) params.set('name', name)
  if (order) params.set('order', order)
  return request(`/products?${params}`)
}

// GET /api/products/:id
export const getProduct = (id) => request(`/products/${id}`)

// GET /api/entrepreneurs/:id
export const getEntrepreneur = (id) => request(`/entrepreneurs/${id}`)

// GET /api/users/me
export const getMe = (token) => request('/users/me', { token })

// GET /api/users/me/products
export const getMyProducts = (token) => request('/users/me/products', { token })

// POST /api/products
export const createProduct = (token, data) =>
  request('/products', {
    method: 'POST',
    token,
    body: { ...data, price: toNumber(data.price), category_id: toNumber(data.category_id) },
  })

// DELETE /api/products/:id
export const deleteProduct = (token, id) => request(`/products/${id}`, { method: 'DELETE', token })
