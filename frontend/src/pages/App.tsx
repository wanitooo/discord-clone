import {
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import Sidebar from "../components/layouts/Sidebar";
import { useEffect } from "react";
const App = () => {
  const { location } = useRouterState();
  const navigate = useNavigate();
  // console.log(useNavigate())
  const pathname = window.location.pathname;
  console.log("pathname", pathname);
  console.log("location", location.pathname);
  useEffect(() => {
    if (location.pathname === "/app") {
      navigate({ to: "/app/server" }); // /app/server will redirect to the default server
    }
  }, []);

  return (
    <div className="w-full flex flex-row text-white">
      <Sidebar></Sidebar>
      <Outlet />
      <div className="w-full bg-discord-gray">Chat and shit </div>
    </div>
  );
};

export default App;
