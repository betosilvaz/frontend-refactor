import { Outlet, Navigate } from "react-router"

import { useAuth } from '@providers/AuthProvider'
import Center from '@components/center/Center'

export default function ProtectedRoutes({ allowedRoles }) {
    const { isAuthenticated, expiration, roles, isLoading } = useAuth();

    if(isLoading) return (
        <Center>
            <span style={{fontWeight: 700, fontSize: '1.5rem'}}>Carregando permissões...</span>
        </Center>
    );

    if(isAuthenticated && expiration != null && expiration > Date.now()) {
        if (!allowedRoles || allowedRoles.length === 0) return <Outlet/>
        for(let role of roles)
            if(allowedRoles.includes(role)) return <Outlet/>
    }

    return <Navigate to="/login" replace/>
}