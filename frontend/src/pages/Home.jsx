import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'

export default function Home() {
  const { categories } = useProducts()

  return (
    <>
      <header className="hero text-white text-center d-flex flex-column justify-content-center align-items-center px-3">
        <h1 className="display-4 fw-bold">Bienvenidos a Del Barrio</h1>
        <p className="lead">Productos hechos por emprendedores del sector Canal Chacao, Quilpué</p>
        <Link to="/gallery" className="btn btn-light btn-lg">
          Ver galería
        </Link>
      </header>

      <div className="container py-5">
        <h2 className="h4 mb-3">Tipos de producto</h2>
        <div className="row g-3 mb-5">
          {categories.map((category) => (
            <div className="col-6 col-md-4 col-lg-2" key={category.id}>
              <Link to={`/gallery?category=${category.id}`} className="btn btn-outline-dark w-100">
                {category.name}
              </Link>
            </div>
          ))}
        </div>

        <h2 className="h4 mb-3">¿Cómo funciona?</h2>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card h-100 p-3">1. Mira los productos de los emprendedores del sector, sin necesidad de registrarte.</div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 p-3">2. Contacta directo al emprendedor por teléfono, correo o red social.</div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 p-3">
              3. ¿Tienes un emprendimiento? <Link to="/register">Regístrate</Link> y publica tus productos.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
