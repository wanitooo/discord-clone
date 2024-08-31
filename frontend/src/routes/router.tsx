import {
  Router,
  Route,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import App from "../pages/App.tsx";
import Root from "../Root.tsx";
import {
  channelDetail,
  server,
  serverDetail,
} from "./appRoutes/serverRoutes.tsx";
import Landing from "../pages/Landing.tsx";

// Create a root route
export const rootRoute = createRootRoute({ component: Root });

// Create an index route
export const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});
export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "app",
  component: App,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "about",
  component: about,
});

function about() {
  return <div>Hello from About!</div>;
}
// Create the route tree using your routes
export const serverRouteTree = serverDetail.addChildren([channelDetail]);
export const appRouteTree = appRoute.addChildren([server, serverRouteTree]);
const routeTree = rootRoute.addChildren([
  landingRoute,
  aboutRoute,
  appRouteTree,
]);

// Create the router using your route tree
export const router = createRouter({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
