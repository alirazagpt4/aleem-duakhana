import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { admin, loading } = useAuth();

    if (loading) return <div className="p-6 text-muted">Loading...</div>;
    if (!admin) return <Navigate to="/admin/login" replace />;

    return <Outlet />;
}