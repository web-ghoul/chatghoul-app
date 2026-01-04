import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../globals/useAuthStore';

interface PublicRouteProps {
    redirectTo?: string;
}

export function PublicRoute({ redirectTo = '/' }: PublicRouteProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
}

export default PublicRoute;
