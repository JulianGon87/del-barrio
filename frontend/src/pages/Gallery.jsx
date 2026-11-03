import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { useProducts } from '../context/ProductsContext'

export default function Gallery() {
  const { categories, products, loading, error, loadProducts } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [name, setName] = useState('')
  const [order, setOrder] = useState('')

  // el tipo de producto va en la URL para poder llegar desde el inicio con el filtro puesto
  const category = searchParams.get('category') || ''

  useEffect(() => {
    loadProducts({ name, category, order })
  }, [name, category, order, loadProducts])

  const handleCategory = (e) => {
    setSearchParams(e.target.value ? { category: e.target.value } : {})
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-3">Galería</h1>

      <div className="row g-2 mb-4">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={category} onChange={handleCategory}>
            <option value="">Todos los tipos</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="">Más nuevos primero</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ProductGrid products={products} emptyMessage="No encontramos productos con esos filtros." />
      )}
    </div>
  )
}
