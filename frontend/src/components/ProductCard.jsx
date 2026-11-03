import { Link } from 'react-router-dom'
import { formatPrice } from '../utils'

// onDelete es opcional: solo se pasa desde Mi perfil
export default function ProductCard({ product, onDelete }) {
  return (
    <div className="card h-100 shadow-sm">
      <Link to={`/products/${product.id}`}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="card-img-top product-img"
            onError={(e) => (e.target.style.visibility = 'hidden')}
          />
        ) : (
          <div className="product-img bg-light"></div>
        )}
      </Link>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.title}</h5>
        {product.category && <span className="badge text-bg-secondary align-self-start mb-2">{product.category.name}</span>}
        <p className="card-text mb-1">Precio: {formatPrice(product.price)}</p>
        {product.entrepreneur && (
          <p className="card-text small text-muted">
            Por: <Link to={`/entrepreneurs/${product.entrepreneur.id}`}>{product.entrepreneur.business_name}</Link>
          </p>
        )}
        {onDelete && (
          <button className="btn btn-outline-danger btn-sm mt-auto align-self-start" onClick={() => onDelete(product.id)}>
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}
