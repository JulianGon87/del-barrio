import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as api from '../services/api'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getCategories().then(setCategories)
  }, [])

  const loadProducts = useCallback(async (filters) => {
    setLoading(true)
    setError('')
    try {
      setProducts(await api.getProducts(filters))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const value = { categories, products, loading, error, loadProducts }

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export const useProducts = () => useContext(ProductsContext)
