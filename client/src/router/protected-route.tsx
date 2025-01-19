// router/protected-route.tsx
import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../features/auth/context/auth-context";

// temp mock auth state
// const isAuthenticated = true; // temp auth

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

