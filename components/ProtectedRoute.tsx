
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from './Spinner';

interface ProtectedRouteProps {
    children: React.ReactElement;
    adminOnly?: boolean;
    adminUids?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false, adminUids = [] }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    if (adminOnly && !adminUids.includes(currentUser.uid)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
