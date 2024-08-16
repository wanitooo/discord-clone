import { Route } from "@tanstack/react-router";
import { appRoute } from "../router";
import ServerChannels from "../../components/layouts/ServerChannels";
import ChatBox from "../../components/discord-ui/ChatBox";
import VoicedChannels from "../../components/discord-ui/VoicedChannels";

export const server = new Route({
  getParentRoute: () => appRoute,
  path: "/",
  component: () => <ServerChannels />,
});

export const serverDetail = new Route({
  getParentRoute: () => appRoute,
  path: "/$serverId",
  parseParams: (params) => params.serverId as string,
  component: () => <ServerChannels />,
});

export const channelDetail = new Route({
  getParentRoute: () => serverDetail,
  path: "/$channelId",
  parseParams: (params) => params.channelId as string,
  component: () => <ChatBox />,
});

export const voicedChannels = new Route({
  getParentRoute: () => serverDetail,
  path: "/$channelId/voiced",
  parseParams: (params) => params.channelId as string,
  component: () => <VoicedChannels />,
});
// Cant do this somehow, uncaught error, approute is called before being defined
// export const serverRoutes = appRoute.addChildren([server, serverDetail]);
