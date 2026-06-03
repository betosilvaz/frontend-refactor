import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router"; // ou react-router-dom dependendo da versão
import { jwtDecode } from "jwt-decode";

import fetchThis from "@utils/fetchThis";
import { API_URL } from "@config/api/api.js";
import LoadingPage from "@components/loading-page/LoadingPage";

export default function ProtectedRoutes({ allowedRoles }) {
    const [isAuthorized, setIsAuthorized] = useState(null); 

    useEffect(() => {
        const verifyAuth = async () => {
            const jwt = localStorage.getItem("jwt");
            
            if (!jwt) return setIsAuthorized(false);

            try {
                const response = await fetchThis(`${API_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${jwt}` }
                });

                if (response.ok) {
                    const decoded = jwtDecode(jwt);

                    if (!allowedRoles || allowedRoles.length === 0) {
                        return setIsAuthorized(true);
                    }

                    const hasRole = decoded.roles?.some(role => allowedRoles.includes(role));
                    setIsAuthorized(hasRole);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.error("Erro ao verificar o token:", error);
                setIsAuthorized(false);
            }
        };

        verifyAuth();
    }, [allowedRoles]);
    
    if (isAuthorized === null) {
        return <LoadingPage/>;
    }

    return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
}