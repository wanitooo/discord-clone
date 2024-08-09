import { Outlet } from "@tanstack/react-router";
import { ModalProvider } from "./components/providers/ModalProvider";
import "./globals.css";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "./hooks/global-store";
import { useEffect } from "react";
function Root() {
  const queryClient = new QueryClient();
  const theme = useTheme((t) => t.type);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme) {
      const isDark = theme === "dark";
      root.classList.remove(isDark ? "light" : "dark");
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ModalProvider />
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </QueryClientProvider>
      {/* user authenticated ? <Home /> : <LandingPage/> or <Login /> */}
    </>
  );
}

export default Root;
