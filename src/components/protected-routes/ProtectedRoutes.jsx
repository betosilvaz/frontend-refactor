import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router";

import LoadingPage from "@components/loading-page/LoadingPage";
import { useAuth } from "@providers/AuthProvider";

export default function ProtectedRoutes({ allowedRoles }) {
    const { isAuthenticated, user, refreshAuth } = useAuth();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        refreshAuth().finally(() => setChecked(true));
    }, [refreshAuth]);

    if (!checked) {
        return <LoadingPage />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const hasRole = user?.roles?.some(role => allowedRoles.includes(role));
        if (!hasRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Outlet />;
}
