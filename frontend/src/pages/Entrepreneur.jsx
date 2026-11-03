import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import * as api from '../services/api'

export default function Entrepreneur() {
  const { id } = useParams()
  const [entrepreneur, setEntrepreneur] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getEntrepreneur(id)
      .then(setEntrepreneur)
      .catch((err) => setError(err.message))
  }, [id])

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/gallery">Volver a la galería</Link>
      </div>
    )
  }

  if (!entrepreneur) return <div className="container py-4">Cargando...</div>

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        {entrepreneur.avatar_url ? (
          <img src={entrepreneur.avatar_url} alt="" className="avatar" />
        ) : (
          <div className="avatar"></div>
        )}
        <div>
          <h1 className="h3 mb-1">{entrepreneur.business_name}</h1>
          {entrepreneur.description && <p className="mb-0">{entrepreneur.description}</p>}
        </div>
      </div>

      <h2 className="h5 mb-3">Productos de este emprendedor</h2>
      <ProductGrid products={entrepreneur.products} emptyMessage="Todavía no tiene productos publicados." />
    </div>
  )
}
