// router/protected-route.tsx
import React from "react";
import { Navigate } from "react-router";


// temp mock auth state
const isAuthenticated = true; // temp auth

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

