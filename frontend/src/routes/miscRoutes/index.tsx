import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";

const landing2 = createRoute({
  getParentRoute: () => landingRoute,
  path: "/2",
  component: () => (
    <div>
      <h1>Ladnign 2</h1>
    </div>
  ),
});
const FAQ = createRoute({
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
