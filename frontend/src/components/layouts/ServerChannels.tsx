import { useNavigate, useParams } from "@tanstack/react-router";
import { server } from "../../routes/appRoutes/serverRoutes";
import { useEffect, useState } from "react";
import ServerOptionsDropdown from "../discord-ui/ServerOptionsDropdown";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../discord-ui/Collapsible";

import {
  UserPlusIcon,
  HashtagIcon,
  Cog8ToothIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { Tooltip, TooltipProvider } from "../shadcn/ui";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import IconTooltip from "../discord-ui/IconTooltip";
import { useQuery } from "@tanstack/react-query";
interface ServerSidebar {
  serverName: string;
  serverOwner: string;
  channels: string[];
}

const dummySidebarData = [
  {
    serverName: "Server 1",
    serverOwner: "Server 1 owner",
    channels: ["Channel Orange", "Chanel", "Blonded"],
  },
  {
    serverName: "Server 2",
    serverOwner: "Server 2 owner",
    channels: ["505", "Sweetdreams TN", "Miracle Aligner"],
  },
];

const fetchChannels = async (serverId: number) => {
  return await fetch(`http://127.0.0.1:3000/api/channels/${serverId}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((res) => Promise.reject(new Error(`Failed to fetch data: ${res}`)));

  // const data = axios
  //   .get("localhost:3000/api/servers")
  //   .then((res) => console.log(res));
  // console.log("data ", data);
};

const ServerChannels = () => {
  const { serverId }: { serverId: number } = useParams({ from: "/app/server" });
  // console.log("server id", serverId);
  const navigate = useNavigate();

  useEffect(() => {
    if (serverId === undefined) {
      navigate({ to: "/app/server/0" }); // Send to the first item in get all channels in a server
    }
  }, []);

  // console.log("server id", serverId);

  const [channels, setChannels] = useState([]);
  const channelsQuery = useQuery({
    queryKey: ["serverId", serverId],
    queryFn: async () => {
      return await fetchChannels(serverId);
    },
  });
  // TODO: Add types to fetched data, could use zod schema types
  // console.log("Channels: ", channelsQuery.data);

  // Conditionally perform actions based on channelsQuery.isFetched
  useEffect(() => {
    if (channelsQuery.isFetched) {
      setChannels(channelsQuery.data);
    }
  }, [channelsQuery.isFetched, channelsQuery.data]);
  if (channelsQuery.isLoading) {
    console.log("Loading data...");
    return <h1 className="text-black">LOADING...</h1>;
  }

  if (channelsQuery.isError) {
    console.log("Error loading data...", channelsQuery.error);
  }
  return (
    <div className="h-screen bg-discord-black w-[245px]">
      {serverId ? (
        <div>
          {/*  Drop down component here */}
          <ServerOptionsDropdown />
          <div>
            {/* TODO: EVENTS Component*/}
            <Collapsible
              className="w-full flex flex-col
            text-gray-400 text-sm"
            >
              <CollapsibleTrigger className="w-11/12">
                <div className="flex items-center my-4">
                  <div className="w-full flex items-center gap-1 hover:text-white">
                    <ChevronRightIcon width={15} />
                    <span className="text-xs">CATEGORY NAME</span>
                  </div>
                  <IconTooltip align="center" side="top" label="Create channel">
                    <PlusIcon className="ml-2" width={20} />
                  </IconTooltip>
                </div>
              </CollapsibleTrigger>
              {channels.map((channel, idx) => (
                <CollapsibleContent key={idx} className="">
                  <div
                    className="w-11/12 flex items-center justify-between 
                      px-2 py-1 ml-1
                      text-sm hover:text-white
                      hover:bg-discord-gray hover:rounded-md"
                  >
                    <div className="flex items-center justify-center">
                      <HashtagIcon width={15} className="mr-2" />
                      <span>{channel.channelName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconTooltip
                        align={"center"}
                        side="top"
                        label="Create Invite"
                      >
                        {/* TODO: Invite Modal */}
                        <UserPlusIcon width={15} />
                      </IconTooltip>
                      {/* TODO: Edit channel Modal */}
                      <IconTooltip
                        align={"center"}
                        side="top"
                        label="Edit channel"
                      >
                        <Cog8ToothIcon width={15} />
                      </IconTooltip>
                    </div>
                  </div>
                </CollapsibleContent>
              ))}
            </Collapsible>
          </div>
        </div>
      ) : (
        <div>"Pick a server"</div> // Should be a loading state instead
      )}
    </div>
  );
};

export default ServerChannels;
