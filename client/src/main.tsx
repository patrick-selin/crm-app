// main.tsx
import "@mantine/core/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./router/app-routes";
//
import "./styles/global.css";
import { MantineProvider } from "@mantine/core";
import theme from "./styles/mantine-theme";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <AppRoutes />
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
