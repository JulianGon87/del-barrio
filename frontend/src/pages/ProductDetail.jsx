import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as api from '../services/api'
import { formatPrice } from '../utils'

export default function ProductDetail() {
  const { id } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return
    await api.deleteProduct(token, product.id)
    navigate('/profile')
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/gallery">Volver a la galería</Link>
      </div>
    )
  }

  if (!product) return <div className="container py-4">Cargando...</div>

  const isMine = user && user.id === product.entrepreneur.id

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-6">
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="img-fluid rounded w-100" />
          ) : (
            <div className="product-img bg-light rounded"></div>
          )}
        </div>

        <div className="col-md-6">
          <h1 className="h2">{product.title}</h1>
          <p className="fs-4 mb-2">{formatPrice(product.price)}</p>
          <span className="badge text-bg-secondary mb-3">{product.category.name}</span>
          {product.description && <p>{product.description}</p>}

          <div className="d-flex align-items-center gap-2 mb-3">
            {product.entrepreneur.avatar_url ? (
              <img src={product.entrepreneur.avatar_url} alt="" className="avatar" style={{ width: 40, height: 40 }} />
            ) : (
              <div className="avatar" style={{ width: 40, height: 40 }}></div>
            )}
            <div className="small">
              Vendido por <b>{product.entrepreneur.business_name}</b>
              <br />
              <Link to={`/entrepreneurs/${product.entrepreneur.id}`}>Ver todos sus productos</Link>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h2 className="h6">Contacto</h2>
              {product.contact_phone && (
                <p className="mb-1">
                  Teléfono: <a href={`tel:${product.contact_phone}`}>{product.contact_phone}</a>
                </p>
              )}
              {product.contact_email && (
                <p className="mb-1">
                  Correo: <a href={`mailto:${product.contact_email}`}>{product.contact_email}</a>
                </p>
              )}
              {product.contact_social && <p className="mb-0">Red social: {product.contact_social}</p>}
            </div>
          </div>

          <Link to="/gallery" className="btn btn-outline-dark me-2">
            Volver a la galería
          </Link>
          {isMine && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
