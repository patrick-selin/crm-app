// router/app-routes.tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "../layouts/app-layout";
//
import Home from "../pages/home";
import Dashboard from "../pages/dashboard";
import Customers from "../pages/customers";
import CustomerDetail from "../features/customers/pages/customer-detail-page";
import Sales from "../pages/sales";
import Products from "../pages/products";
import Analytics from "../pages/analytics";
import Profile from "../pages/profile";
// import AdminPanel from "../pages/admin-panel";
import SignIn from "../pages/sign-in";
import Register from "../pages/register";
//
import ProtectedRoute from "./protected-route";
// import AdminRoute from "./admin-route";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> }, // testi, redirect to /dashboard
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "customers",
        element: (
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        ),
      },
      {
        path: "customers/:id",
        element: (
          <ProtectedRoute>
            <CustomerDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "sales",
        element: (
          <ProtectedRoute>
            <Sales />
          </ProtectedRoute>
        ),
      },
      {
        path: "products",
        element: (
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: "sign-in", element: <SignIn /> },
      { path: "register", element: <Register /> },
    ],
  },
  { path: "*", element: <div>Page Not Found</div> },
]);

const AppRoutes = () => <RouterProvider router={router} />;
export default AppRoutes;
