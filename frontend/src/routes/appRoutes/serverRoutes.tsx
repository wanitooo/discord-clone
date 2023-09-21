import { Route } from "@tanstack/react-router";
import { appRoute } from "../router";
import ServerSidebar from "../../components/layouts/ServerSidebar";

export const server = new Route({
  getParentRoute: () => appRoute,
  path: "/server",
  component: () => <ServerSidebar />,
});

export const serverDetail = new Route({
  getParentRoute: () => appRoute,
  path: "/server/$serverId",
  parseParams: (params) => params.serverId as string,
  component: () => <ServerSidebar />,
});

// Cant do this somehow, uncaught error, approute is called before being defined
// export const serverRoutes = appRoute.addChildren([server, serverDetail]);
