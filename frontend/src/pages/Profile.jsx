import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { useAuth } from '../context/AuthContext'
import * as api from '../services/api'

export default function Profile() {
  const { token } = useAuth()
  const [me, setMe] = useState(null)
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.getMe(token), api.getMyProducts(token)])
      .then(([meData, productsData]) => {
        setMe(meData)
        setProducts(productsData)
      })
      .catch((err) => setError(err.message))
  }, [token])

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return
    await api.deleteProduct(token, id)
    setProducts(products.filter((p) => p.id !== id))
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    )
  }

  if (!me) return <div className="container py-4">Cargando...</div>

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        {me.avatar_url ? <img src={me.avatar_url} alt="" className="avatar" /> : <div className="avatar"></div>}
        <div>
          <h1 className="h3 mb-1">{me.business_name}</h1>
          <p className="small mb-1">
            {me.name} · {me.email}
          </p>
          {me.description && <p className="small mb-0">{me.description}</p>}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Mis productos</h2>
        <Link to="/products/new" className="btn btn-success">
          + Publicar producto
        </Link>
      </div>

      <ProductGrid products={products} onDelete={handleDelete} emptyMessage="Todavía no has publicado ningún producto." />
    </div>
  )
}
