import { createContext, useContext, useState } from 'react'
import * as api from '../services/api'

const AuthContext = createContext(null)
const SESSION_KEY = 'del-barrio-session'

export function AuthProvider({ children }) {
  // la sesión ({ token, user }) se guarda también en localStorage para que no se pierda al recargar
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem(SESSION_KEY)))

  const login = async (email, password) => {
    const data = await api.login(email, password)
    localStorage.setItem(SESSION_KEY, JSON.stringify(data))
    setSession(data)
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setSession(null)
  }

  const value = { user: session?.user ?? null, token: session?.token ?? null, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
