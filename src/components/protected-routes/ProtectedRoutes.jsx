import { Outlet, Navigate } from "react-router"
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoutes({ allowedRoles }) {

    let jwt = localStorage.getItem("jwt");
    if (!jwt) return <Navigate to="/login" replace/>

    let decoded = jwtDecode(jwt);
    let currentTime = Date.now() / 1000;

    if(( decoded.exp > currentTime )) {
        if (!allowedRoles || allowedRoles.length === 0) return <Outlet/>
        for(let role of decoded.roles)
            if(allowedRoles.includes(role)) return <Outlet/>
    }

    return <Navigate to="/login" replace/>
}