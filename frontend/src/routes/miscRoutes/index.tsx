import { Route } from "@tanstack/react-router";
import { rootRoute } from "../router";
import Landing from "../../pages/Landing";

const landingRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const landing2 = new Route({
  getParentRoute: () => landingRoute,
  path: "/2",
  component: () => (
    <div>
      <h1>Ladnign 2</h1>
    </div>
  ),
});
const FAQ = new Route({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: () => (
    <div>
      <h1>FAQ</h1>
    </div>
  ),
});

const landingRouteTree = landingRoute.addChildren([landing2, FAQ]);

export default landingRouteTree;
