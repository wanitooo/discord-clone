import { Route } from "@tanstack/react-router";
import { appRoute } from "../router";
import ServerChannels from "../../components/layouts/ServerChannels";
import Channel from "../../components/discord-ui/Channel";

export const server = new Route({
  getParentRoute: () => appRoute,
  path: "/",
  component: () => <ServerChannels />,
});

export const serverDetail = new Route({
  getParentRoute: () => appRoute,
  path: "/$serverUUID",
  parseParams: (params) => params.serverUUID as string,
  component: () => <ServerChannels />,
});

export const channelDetail = new Route({
  getParentRoute: () => serverDetail,
  path: "/$channelUUID",
  parseParams: (params) => params.channelUUID as string,
  component: () => <Channel />,
});

// export const voicedChannels = new Route({
//   getParentRoute: () => serverDetail,
//   path: "/$channelId/voiced",
//   parseParams: (params) => params.channelId as string,
//   component: () => <VoicedChannels />,
// });
// Cant do this somehow, uncaught error, approute is called before being defined
// export const serverRoutes = appRoute.addChildren([server, serverDetail]);
