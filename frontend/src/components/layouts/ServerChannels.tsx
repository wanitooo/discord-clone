import { useNavigate, useParams } from "@tanstack/react-router";
import { server } from "../../routes/appRoutes/serverRoutes";
import { useEffect } from "react";
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

const ServerChannels = () => {
  const { serverId } = useParams({ from: "/app/server" });
  const navigate = useNavigate();
  useEffect(() => {
    if (serverId === undefined) {
      navigate({ to: "/app/server/0" });
    }
  }, []);

  // console.log("server id", serverId);

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
              {dummySidebarData[parseInt(serverId)].channels.map(
                (item, idx) => (
                  <CollapsibleContent key={idx} className="">
                    <div
                      className="w-11/12 flex items-center justify-between 
                      px-2 py-1 ml-1
                      text-sm hover:text-white
                      hover:bg-discord-gray hover:rounded-md"
                    >
                      <div className="flex items-center justify-center">
                        <HashtagIcon width={15} className="mr-2" />
                        <span>{item}</span>
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
                )
              )}
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
