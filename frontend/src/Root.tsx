import { Outlet } from "@tanstack/react-router";
import { ModalProvider } from "./components/providers/ModalProvider";
import "./globals.css";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function Root() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ModalProvider />
        <Outlet />
        <TanStackRouterDevtools />
      </QueryClientProvider>
      {/* user authenticated ? <Home /> : <LandingPage/> or <Login /> */}
    </>
  );
}

export default Root;
