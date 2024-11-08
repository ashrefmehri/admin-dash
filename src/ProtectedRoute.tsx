// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode; // Children prop to render protected content
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // If authenticated, render the children
    if (isAuthenticated) {
        return <>{children}</>; // Render the protected component(s)
    }

    // If not authenticated, redirect to the login page
    return <Navigate to="/" replace />;
};

export default ProtectedRoute;
