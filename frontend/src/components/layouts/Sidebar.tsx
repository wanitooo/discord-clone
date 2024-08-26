import SidebarIcon from "../discord-ui/Sidebar/SidebarIcon";
import { ScrollArea, Separator } from "../shadcn/ui";
import ThemeToggle from "../discord-ui/ThemeToggle";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const fetchServers = async () => {
  return await fetch("http://127.0.0.1:3000/api/servers", {
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

const Sidebar = () => {
  const [servers, setServers] = useState([]);
  const serversQuery = useQuery({
    queryKey: ["servers", servers],
    queryFn: async () => {
      return await fetchServers();
    },
  });
  // TODO: Add types to fetched data, could use zod types shit
  // console.log("SERVERS: ", serversQuery.data);

  // Conditionally perform actions based on serversQuery.isFetched
  useEffect(() => {
    if (serversQuery.isFetched) {
      setServers(serversQuery.data);
      // console.log(serversQuery.data);
    }
  }, [serversQuery.isFetched, serversQuery.data]);

  if (serversQuery.isLoading) {
    console.log("Loading data...");
    return <h1 className="text-black">LOADING...</h1>;
  }

  if (serversQuery.isError) {
    console.log("Error loading data...", serversQuery.error);
  }

  // Always call useEffect unconditionally
  return (
    <>
      <div className="h-screen w-[86px] bg-discord-light dark:bg-discord-blackest flex flex-col items-center gap-2 pt-2">
        <SidebarIcon
          align="center"
          label="Add a server"
          side="right"
          type="action"
        />
        <Separator className="bg-gray-300 dark:bg-discord-gray w-1/2 mx-auto" />
        <ScrollArea className="flex-1 w-full ">
          {servers.map((server) => (
            <Link
              to={`/app/${server.serverUUID}`}
              params={{ serverId: "0" }}
              key={server.serverUUID}
            >
              <SidebarIcon
                label={`${server.serverName}`}
                name={`${server.serverName}`}
                imageUrl={`${server.serverImage}`}
              />
            </Link>
          ))}

          {/* {JSON.stringify(serversQuery.data)} */}
          {/* <Link to="/app/server/$serverId" params={{ serverId: "0" }}>
            <SidebarIcon />
          </Link>
          <Link to="/app/server/$serverId" params={{ serverId: "1" }}>
            <SidebarIcon />
          </Link> */}
          {/* <SidebarIcon 
              img={}
              tooltip={server.name}
          /> */}
        </ScrollArea>
        <ThemeToggle></ThemeToggle>
      </div>
      {/* Contains the content or navigation links for each server */}
    </>
  );
};

export default Sidebar;
