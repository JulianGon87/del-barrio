import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-5">404</h1>
      <p>Esta página no existe.</p>
      <Link to="/" className="btn btn-warning">
        Volver al inicio
      </Link>
    </div>
  )
}
