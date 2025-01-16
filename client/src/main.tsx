// main.tsx
import "@mantine/core/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./router/app-routes";
//
import "./styles/global.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import theme from "./styles/mantine-theme";
import "@mantine/notifications/styles.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications />
        <AppRoutes />
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
