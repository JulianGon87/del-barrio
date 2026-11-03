import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import * as api from '../services/api'

export default function NewProduct() {
  const { token } = useAuth()
  const { categories } = useProducts()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    contact_phone: '',
    contact_email: '',
    contact_social: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const product = await api.createProduct(token, form)
      navigate(`/products/${product.id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-3">Nuevo producto</h1>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          <div className="col-md-7">
            <div className="mb-3">
              <label className="form-label">Título</label>
              <input className="form-control" name="title" value={form.title} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" rows="4" name="description" value={form.description} onChange={handleChange} />
            </div>
            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label">Precio</label>
                <input type="number" min="0" className="form-control" name="price" value={form.price} onChange={handleChange} />
              </div>
              <div className="col-6 mb-3">
                <label className="form-label">Tipo de producto</label>
                <select className="form-select" name="category_id" value={form.category_id} onChange={handleChange}>
                  <option value="">Elige uno</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">URL de la foto</label>
              <input className="form-control" name="image_url" value={form.image_url} onChange={handleChange} />
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h2 className="h6">Contacto (completa al menos uno)</h2>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input className="form-control" name="contact_phone" placeholder="+56 9 ..." value={form.contact_phone} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input type="email" className="form-control" name="contact_email" value={form.contact_email} onChange={handleChange} />
                </div>
                <div className="mb-0">
                  <label className="form-label">Red social</label>
                  <input className="form-control" name="contact_social" placeholder="@usuario o enlace" value={form.contact_social} onChange={handleChange} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-success me-2">
              Publicar
            </button>
            <Link to="/profile" className="btn btn-outline-dark">
              Cancelar
            </Link>
          </div>

          <div className="col-md-5">
            <p className="small text-muted mb-1">Vista previa de la foto</p>
            {form.image_url ? (
              <img
                src={form.image_url}
                alt="vista previa"
                className="img-fluid rounded w-100"
                onError={(e) => (e.target.style.visibility = 'hidden')}
              />
            ) : (
              <div className="product-img bg-light rounded"></div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
