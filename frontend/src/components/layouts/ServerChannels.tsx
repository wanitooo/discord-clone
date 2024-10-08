import { Outlet, useLocation } from "@tanstack/react-router";
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
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import { Link } from "@tanstack/react-router";
import IconTooltip from "../discord-ui/IconTooltip";
import { useQuery } from "@tanstack/react-query";
import { useChannels, useLoading, useModal } from "../../hooks/global-store";
import { cn } from "../shadcn/utils/utils";
import { getRouteApi } from "@tanstack/react-router";
import { SelectChannels } from "@shared/index";

const fetchChannels = async (serverUUID: string): Promise<SelectChannels[]> => {
  return await fetch(`http://127.0.0.1:3000/api/channels/${serverUUID}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((res) => Promise.reject(new Error(`Failed to fetch data: ${res}`)));
};

const routeApi = getRouteApi("/app");
// TODO: Separate into diff files server detail, channel detail

const ServerChannels = () => {
  const { serverUUID, channelUUID } = routeApi.useParams();
  console.log("serveruuid", serverUUID);
  console.log("asdhajdhas", channelUUID);
  const { onOpen } = useModal();
  const [collapsed, setCollapsed] = useState(true);
  const { activeChannel } = useChannels();

  const [channels, setChannels] = useState<SelectChannels[]>([]);
  const channelsQuery = useQuery({
    queryKey: ["serverUUID", serverUUID],
    queryFn: async () => {
      return await fetchChannels(serverUUID);
    },
  });
  // TODO: Add types to fetched data, could use zod schema types
  // console.log("Channels: ", channelsQuery.data);

  // Conditionally perform actions based on channelsQuery.isFetched
  const { setChannelsFetched } = useLoading();
  useEffect(() => {
    if (channelsQuery.isFetched && channelsQuery.data) {
      setChannels(channelsQuery.data);
      setChannelsFetched(true);
      // console.log(channelsQuery.data);
    }
  }, [channelsQuery.isFetched, channelsQuery.data, setChannelsFetched]);
  if (channelsQuery.isLoading) {
    console.log("Loading data...");
    return <h1 className="text-black">LOADING...</h1>;
  }

  if (channelsQuery.isError) {
    console.log("Error loading data...", channelsQuery.error);
  }
  return (
    <>
      <div className="h-screen bg-discord-lighter dark:bg-discord-black w-[286px]">
        {serverUUID ? (
          <div>
            {/*  Drop down component here */}
            <ServerOptionsDropdown />
            <div>
              {/* TODO: EVENTS Component*/}
              <Collapsible
                className="w-full flex flex-col text-discord-gray/75 dark:text-gray-400 text-sm "
                open={collapsed}
                onOpenChange={setCollapsed}
              >
                <CollapsibleTrigger className="w-11/12 group" asChild>
                  <div className="flex items-center my-4">
                    <div className="w-full flex items-center gap-1 dark:hover:text-white hover:text-black ">
                      <ChevronRightIcon
                        width={15}
                        className={cn(collapsed ? "rotate-90" : "", "ml-2")}
                      />
                      <span className="text-xs">CATEGORY NAME</span>
                    </div>

                    <button onClick={() => onOpen("createChannel")}>
                      <IconTooltip
                        align="center"
                        side="top"
                        label="Create channel"
                      >
                        <PlusIcon className="ml-2" width={20} />
                      </IconTooltip>
                    </button>
                  </div>
                </CollapsibleTrigger>
                {channels.map((channel, idx) => (
                  <CollapsibleContent key={idx} className="">
                    <Link
                      to={`/app/${serverUUID}/${channel.uuid}`}
                      // params={{ serverId: "0" }}
                    >
                      <div
                        className={cn(
                          "w-11/12 flex items-center justify-between px-2 py-1 ml-1 ",
                          "hover:bg-discord-light hover:text-discord-blackest dark:hover:text-white dark:hover:bg-discord-gray hover:rounded-sm text-base font-medium font-ggSans",
                          activeChannel?.uuid === channel.uuid
                            ? "bg-discord-light dark:bg-discord-gray text-discord-blackest dark:text-white rounded-sm"
                            : ""
                        )}
                      >
                        <div className="flex items-center justify-center ">
                          {channel.type == "text" ? (
                            <HashtagIcon width={15} className="mr-2" />
                          ) : (
                            <SpeakerWaveIcon width={15} className="mr-2" />
                          )}
                          <span className="lowercase">{channel.name}</span>
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
                    </Link>
                  </CollapsibleContent>
                ))}
              </Collapsible>
            </div>
          </div>
        ) : (
          <div>"Pick a server"</div> // Should be a loading state instead
        )}
      </div>

      <div className="w-full h-screen bg-white dark:bg-discord-gray flex flex-col ">
        <Outlet />
        {/* <ChatInput /> */}
      </div>
    </>
  );
};

export default ServerChannels;
