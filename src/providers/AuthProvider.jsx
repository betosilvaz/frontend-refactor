import { createContext, useContext, useState, useEffect } from "react"
import { API_URL } from '@config/api/api.js'
import safeFetch, { ERROR_CODES } from "@utils/safeFetch";
import AppError from '@utils/AppError'

export const Auth = createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expiration, setExpiration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    async function verifyAuthentication() {
      try {
        let endpoint = API_URL + '/api/auth/me';
        const data = await safeFetch(endpoint, {
          method: 'GET',
          credentials: 'include',
        });
        
        setIsAuthenticated(true);
        setExpiration(data.expiration);
        setRoles(data.roles);
      } catch (error) {
        // limpa o estado de uma sessão que era válida, mas foi expirada
        setIsAuthenticated(false)
        setExpiration(null);
        setRoles([]);
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }

    }
    verifyAuthentication();
  }, [])

  async function login(email, password) {
    try {
      let data = await safeFetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });
      setExpiration(data.expiration);
      setIsAuthenticated(true);
      setRoles(data.roles);
    } catch (error) {
      throw new AppError({
        code: error.code,
        message: 'Erro ao logar: ' + error.message,
        status: error.status,
      });
    }
  }

  async function logout() {
    try {
      await safeFetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
      setRoles([]);
      setExpiration(null);
    } catch (error) {
      throw new AppError({
        code: error.code,
        message: 'Erro ao logar: ' + error.message,
        status: error.status,
      });
    }
  }

  return (
    <Auth.Provider value={{ isAuthenticated, expiration, roles, isLoading, login, logout }}>
      {children}
    </Auth.Provider>
  )

}

export const useAuth = () => useContext(Auth);