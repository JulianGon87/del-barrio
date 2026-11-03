import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    // primero navego: si cierro la sesión estando en una ruta privada, PrivateRoute me manda a /login
    navigate('/')
    logout()
    setOpen(false)
  }

  const close = () => setOpen(false)

  return (
    <nav className="navbar navbar-expand-md bg-warning">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" onClick={close}>
          Del Barrio
        </Link>
        <button className="navbar-toggler" type="button" onClick={() => setOpen(!open)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/gallery" onClick={close}>
                Galería
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav align-items-md-center gap-md-2">
            {user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/products/new" onClick={close}>
                    Publicar
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile" onClick={close}>
                    Mi perfil
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm" to="/login" onClick={close}>
                    Iniciar sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-success btn-sm" to="/register" onClick={close}>
                    Regístrate
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
