import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// si no hay sesión, manda al login
export default function PrivateRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
