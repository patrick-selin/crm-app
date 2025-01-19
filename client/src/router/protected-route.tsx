// router/protected-route.tsx
import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../features/auth/context/auth-context";
import { Loader } from "@mantine/core";

// temp mock auth state
// const isAuthenticated = true; // temp auth

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  // Show a loader while authentication is initializing
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
