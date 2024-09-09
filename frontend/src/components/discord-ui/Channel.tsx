import { useEffect, useState } from "react";
import TextChannel from "./TextChannel";
import VoicedChannel from "./VoicedChannel";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useChannels } from "../../hooks/global-store";
import { ChannelType, SelectChannels } from "@shared/index";

const fetchChannel = async (
  serverUUID: string,
  channelUUID: string
): Promise<SelectChannels> => {
  return await fetch(
    `http://127.0.0.1:3000/api/channels/${serverUUID}/${channelUUID}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((res) => Promise.reject(new Error(`Failed to fetch data: ${res}`)));
};

const routeApi = getRouteApi("/app/$serverUUID/$channelUUID");
const Channel = () => {
  const [channelType, setChannelType] = useState<ChannelType>();
  const [channel, setChannel] = useState<SelectChannels | null>(null);

  const { setActiveChannel } = useChannels();

  const { serverUUID, channelUUID } = routeApi.useParams();
  // console.log("cserverid, ch id", serverId, channelId);
  const channelQuery = useQuery({
    queryKey: ["channelId", channelUUID],
    queryFn: async () => {
      return await fetchChannel(serverUUID, channelUUID);
    },
  });
  // console.log("Channels: ", channelsQuery.data);
  useEffect(() => {
    if (channelQuery.isFetched && channelQuery.data) {
      setChannel(channelQuery.data);
      setChannelType(channelQuery.data.type);
      setActiveChannel(channelQuery.data);
    }
  }, [channelQuery.isFetched, channelQuery.data, channel, setActiveChannel]);

  if (channelQuery.isLoading) {
    console.log("Loading data...");
    return <h1 className="text-black">LOADING...</h1>;
  }

  if (channelQuery.isError) {
    console.log("Error loading data...", channelQuery.error);
  }

  type RenderMap = Partial<{
    [key in Exclude<ChannelType, null>]: JSX.Element;
  }>;

  const Render: RenderMap = {
    text: <TextChannel channel={channel} />,
    voice: <VoicedChannel channel={channel} />,
  };
  // console.log("channel ", channel);
  return <> {channelType && Render[channelType]} </>;
};

export default Channel;
