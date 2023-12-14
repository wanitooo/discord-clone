import SidebarIcon from "../discord-ui/Sidebar/SidebarIcon";
import { ScrollArea, Separator } from "../shadcn/ui";
import ThemeToggle from "../discord-ui/ThemeToggle";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import axios from "axios";
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
  useEffect(() => {
    fetchServers();
  }, []);
  const fetchServers = async () => {
    const data = await fetch("http://127.0.0.1:3000/api/servers", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((res) => console.log("Something went wrong ", res));

    // const data = axios
    //   .get("localhost:3000/api/servers")
    //   .then((res) => console.log(res));
    console.log("data ", data);
  };
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
