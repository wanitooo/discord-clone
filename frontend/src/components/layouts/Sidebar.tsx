import SidebarIcon from "../discord-ui/Sidebar/SidebarIcon";
import { ScrollArea, Separator } from "../shadcn/ui";
import ThemeToggle from "../discord-ui/ThemeToggle";
import { Link } from "@tanstack/react-router";

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

const Sidebar = () => {
  return (
    <>
      <div className="h-screen w-[72px] bg-discord-blackest flex flex-col items-center gap-2 ">
        <SidebarIcon
          align="center"
          label="Add a server"
          side="right"
          type="action"
        />
        <Separator className="bg-discord-gray w-1/2 mx-auto" />
        <ScrollArea className="flex-1 w-full ">
          <Link to="/app/server/$serverId" params={{ serverId: "0" }}>
            <SidebarIcon />
          </Link>
          <Link to="/app/server/$serverId" params={{ serverId: "1" }}>
            <SidebarIcon />
          </Link>
          {/* <SidebarIcon 
              img={}
              tooltip={server.name}
          /> */}
          <SidebarIcon />
          <SidebarIcon />
        </ScrollArea>
        <ThemeToggle></ThemeToggle>
      </div>
      {/* Contains the content or navigation links for each server */}
    </>
  );
};

export default Sidebar;
