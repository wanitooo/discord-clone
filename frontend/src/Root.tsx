import { Outlet } from "@tanstack/react-router";
import { ModalProvider } from "./components/providers/ModalProvider";
import "./globals.css";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

function Root() {
  return (
    <>
      <ModalProvider />
      <Outlet />
      <TanStackRouterDevtools />
      {/* user authenticated ? <Home /> : <LandingPage/> or <Login /> */}
    </>
  );
}

export default Root;
