import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import ProductDetail from './pages/ProductDetail'
import Entrepreneur from './pages/Entrepreneur'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NewProduct from './pages/NewProduct'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/entrepreneurs/:id" element={<Entrepreneur />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/products/new" element={<NewProduct />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="text-center text-muted small py-4">
        Del Barrio · Emprendedores del sector Canal Chacao, Quilpué
      </footer>
    </>
  )
}
