import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";

import fetchThis from "@utils/fetchThis";
import { API_URL } from "@config/api/api.js";
import LoadingPage from "@components/loading-page/LoadingPage";
import { useAuth } from "@providers/AuthProvider";

export default function ProtectedRoutes({ allowedRoles }) {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [canAccess, setCanAccess] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            const jwt = localStorage.getItem("jwt");
            
            if (!jwt) {
                setCanAccess(false);
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await fetchThis(`${API_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${jwt}` }
                });

                if (response.ok) {
                    const decoded = jwtDecode(jwt);
                    setIsAuthenticated(true)
                    if (!allowedRoles || allowedRoles.length === 0) {
                        setCanAccess(false);
                        return;
                    }

                    const hasRole = decoded.roles?.some(role => allowedRoles.includes(role));
                    setCanAccess(hasRole);
                } else {
                    setIsAuthenticated(false);
                    setCanAccess(false);
                }
            } catch (error) {
                console.error("Erro ao verificar o token:", error);
                setIsAuthenticated(false);
                setCanAccess(false);
            }
        };

        verifyAuth();
    }, [allowedRoles]);
    
    if (canAccess === null) {
        return <LoadingPage/>;
    }

    return canAccess ? <Outlet /> : <Navigate to="/login" replace />;
}