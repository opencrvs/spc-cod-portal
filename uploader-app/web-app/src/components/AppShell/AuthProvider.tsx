import { createContext, useContext, ReactNode, useState } from 'react'
import { Role } from '../../util/types'
import { DecodedToken, getDecodedToken } from '../../services/token'


interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
  isLoggedIn: boolean
  role: Role | null
  performLogout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getRoleFromScopes = (token: DecodedToken) => {
  if (token.scope?.includes('register')) {
    return 'Digitiser'
  } else if (token.scope?.includes('validate')) {
    return 'Data Entry Clerk'
  }
  return null
}

export function clearAuthToken() {
  localStorage.removeItem('authToken')
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('authToken')
  )

  const performLogout = () => {
    clearAuthToken()
    setToken(null)
  }

  const isLoggedIn = !!token

  const decodedToken = getDecodedToken(token)
  const role = (decodedToken && getRoleFromScopes(decodedToken)) || null

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isLoggedIn,
        role,
        performLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
