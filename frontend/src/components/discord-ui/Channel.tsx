import { useEffect, useState } from "react";
import TextChannel from "./TextChannel";
import VoicedChannel from "./VoicedChannel";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useChannels } from "../../hooks/global-store";

const fetchChannel = async (serverUUID: string, channelUUID: string) => {
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

const Channel = () => {
  const [channelType, setChannelType] = useState();
  const [channel, setChannel] = useState(null);

  const { setActiveChannel } = useChannels();

  const {
    serverUUID,
    channelUUID,
  }: { serverUUID: string; channelUUID: string } = useParams({ from: "/app" });

  // console.log("cserverid, ch id", serverId, channelId);
  const channelQuery = useQuery({
    queryKey: ["channelId", channelUUID],
    queryFn: async () => {
      return await fetchChannel(serverUUID, channelUUID);
    },
  });
  // TODO: Add types to fetched data, could use zod schema types
  // console.log("Channels: ", channelsQuery.data);

  // Conditionally perform actions based on channelsQuery.isFetched
  useEffect(() => {
    if (channelQuery.isFetched) {
      setChannel(channelQuery.data);
      setChannelType(channelQuery.data.channelType);
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

  const Render = {
    text: <TextChannel channel={channel} />,
    voice: <VoicedChannel channel={channel} />,
  };
  // console.log("channel ", channel);
  return <> {channelType && Render[channelType]} </>;
};

export default Channel;
