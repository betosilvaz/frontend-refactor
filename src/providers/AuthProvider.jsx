import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { jwtDecode } from "jwt-decode";

import fetchThis from "@utils/fetchThis.js";
import { API_URL } from '@config/api/api.js'
import AppError from '@utils/AppError'
import { ERROR_CODES } from '@utils/ErrorCodes'

export const Auth = createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function verifyAuthentication() {
      let jwt = localStorage.getItem("jwt");
      if (!jwt) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchThis(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        
        if (!response.ok) {
          localStorage.removeItem("jwt");
          setIsAuthenticated(false);
          setUser(null);
          return;
        }
        const userData = await response.json();
        setUser({
          roles: userData?.roles
        });
        setIsAuthenticated(true)
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    verifyAuthentication();
  }, [])

  const refreshAuth = useCallback(async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const response = await fetchThis(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });

      if (!response.ok) {
        localStorage.removeItem("jwt");
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const userData = await response.json();
      setUser({
        roles: userData?.roles
      });
      setIsAuthenticated(true);
      return;
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }
  }, []);

  async function login(email, password) {
    try {
      const response = await fetchThis(API_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new AppError({
          status: data.status,
          message: data.message,
        });
      }

      const data = await response.json();

      if (!data?.jwt || typeof data.jwt !== 'string') {
        throw new AppError({
          code: ERROR_CODES.PARSE,
          status: response.status,
          message: 'Resposta de login inválida.',
        });
      }

      localStorage.setItem("jwt", data.jwt);
      const user = jwtDecode(data.jwt);
      setUser({
        roles: user?.roles
      });
      setIsAuthenticated(true);

    } catch (error) {
      localStorage.removeItem("jwt");
      setIsAuthenticated(false);
      throw new AppError({
        code: error.code,
        message: 'Erro ao logar: ' + error.message,
        status: error.status,
      });
    }
  }

  async function logout() {
    try {
      localStorage.removeItem("jwt");
      setIsAuthenticated(false);
      setUser(null);
      location.href = "/login";
    } catch (error) {
      throw new AppError({
        code: error.code,
        message: 'Erro ao deslogar: ' + error.message,
        status: error.status,
      });
    }
  }

  return (
    <Auth.Provider value={{ isAuthenticated, setIsAuthenticated, user, login, logout, refreshAuth }}>
      {children}
    </Auth.Provider>
  )

}

export const useAuth = () => useContext(Auth);