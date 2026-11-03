import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/profile')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <form className="form-card w-100 p-4 rounded bg-warning-subtle border" onSubmit={handleSubmit}>
        <h1 className="h4 mb-1">Del Barrio</h1>
        <p className="mb-3">Iniciar sesión</p>

        {location.state?.registered && (
          <div className="alert alert-success">Tu cuenta quedó creada, ya puedes iniciar sesión.</div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success me-2">
          Iniciar sesión
        </button>
        <Link to="/" className="btn btn-light">
          Volver
        </Link>
      </form>
    </div>
  )
}
