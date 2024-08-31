import { createRoute } from "@tanstack/react-router";
import { appRoute } from "../router";
import ServerChannels from "../../components/layouts/ServerChannels";
import Channel from "../../components/discord-ui/Channel";

export const server = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: ServerChannels,
});

// const data = server.useParams()
export const serverDetail = createRoute({
  getParentRoute: () => appRoute,
  path: "$serverUUID",
  // params: (params) => params.serverUUID as string,
  loader: ({ params }) => params.serverUUID,
  component: ServerChannels,
});

export const channelDetail = createRoute({
  getParentRoute: () => serverDetail,
  path: "/$channelUUID",
  // parseParams: (params) => params.channelUUID as string,
  component: Channel,
});

// export const voicedChannels = new Route({
//   getParentRoute: () => serverDetail,
//   path: "/$channelId/voiced",
//   parseParams: (params) => params.channelId as string,
//   component: () => <VoicedChannels />,
// });
// Cant do this somehow, uncaught error, approute is called before being defined
// export const serverRoutes = appRoute.addChildren([server, serverDetail]);
