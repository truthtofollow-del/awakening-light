import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Simple placeholder for protected route - in a real app, this would check authentication
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // For now, we'll assume the user is always authenticated
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
