// router/app-routes.tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "../layouts/app-layout";
//
import Dashboard from "../pages/dashboard";
import Customers from "../pages/customers";
import CustomerDetail from "../features/customers/pages/customer-detail-page";
import OrderDetailPage from "../features/customers/pages/order-detail-page";
import Orders from "../pages/orders";
import Products from "../pages/products";
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
      { path: "/", element: <Dashboard /> },
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
        path: "customers/:id/orders/:orderId",
        element: (
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
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
