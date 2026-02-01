import { createContext, useContext, useState, useEffect } from "react"

import { jwtDecode } from "jwt-decode";

import { API_URL } from '@config/api/api.js'
import AppError from '@utils/AppError'

export const Auth = createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function verifyAuthentication() {
      let jwt = localStorage.getItem("jwt");
      if (!jwt) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const decoded = jwtDecode(jwt);
        const currentTime = Date.now() / 1000;
        if(decoded.exp < currentTime) {
          console.log("Token Jwt expirado!");
          localStorage.removeItem("jwt");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.log("Erro ao tentar autenticação!");
      }
    }
    verifyAuthentication();
  }, [])

  async function login(email, password) {
    try {

      const response = await fetch(API_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      localStorage.setItem("jwt", data.jwt);
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
      window.location.href = "/login";
    } catch (error) {
      throw new AppError({
        code: error.code,
        message: 'Erro ao deslogar: ' + error.message,
        status: error.status,
      });
    }
  }

  return (
    <Auth.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </Auth.Provider>
  )

}

export const useAuth = () => useContext(Auth);