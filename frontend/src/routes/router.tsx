import { Router, Route, RootRoute } from "@tanstack/react-router";
import App from "../pages/App.tsx";
import Root from "../Root.tsx";
import landingRouteTree from "./miscRoutes/index.tsx";
import { server, serverDetail } from "./appRoutes/serverRoutes.tsx";

// Create a root route
export const rootRoute = new RootRoute({
  component: Root,
});

// Create an index route
export const appRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: App,
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: about,
});

function about() {
  return <div>Hello from About!</div>;
}
// Create the route tree using your routes
export const appRouteTree = appRoute.addChildren([server, serverDetail]);
const routeTree = rootRoute.addChildren([
  landingRouteTree,
  aboutRoute,
  appRouteTree,
]);

// Create the router using your route tree
export const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
