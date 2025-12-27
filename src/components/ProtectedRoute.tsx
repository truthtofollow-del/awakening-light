import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Protected route component - checks authentication via session context
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) {
    // Redirect to the gate if not authenticated
    return <Navigate to="/gate" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
