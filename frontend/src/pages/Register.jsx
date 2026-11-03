import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    business_name: '',
    description: '',
    email: '',
    password: '',
    avatar_url: '',
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
      await api.register(form)
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <form className="form-card w-100 p-4 rounded bg-success text-white" onSubmit={handleSubmit}>
        <h1 className="h4 mb-1">Del Barrio</h1>
        <p className="mb-3">Registra tu emprendimiento</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Tu nombre</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre del emprendimiento</label>
          <input className="form-control" name="business_name" value={form.business_name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción del emprendimiento</label>
          <textarea className="form-control" rows="3" name="description" value={form.description} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="******"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">URL del logo o foto (opcional)</label>
          <input className="form-control" name="avatar_url" value={form.avatar_url} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-warning me-2">
          Registrarme
        </button>
        <Link to="/" className="btn btn-light">
          Volver
        </Link>
      </form>
    </div>
  )
}
