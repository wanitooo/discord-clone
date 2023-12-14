import { useNavigate, useParams } from "@tanstack/react-router";
import { server } from "../../routes/appRoutes/serverRoutes";
import { useEffect } from "react";
import ServerOptionsDropdown from "../discord-ui/ServerOptionsDropdown";

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
            {dummySidebarData[parseInt(serverId)].channels.map((item, idx) => (
              <div key={idx}>{item}</div>
            ))}
          </div>
        </div>
      ) : (
        <div>"Pick a server"</div> // Should be a loading state instead
      )}
    </div>
  );
};

export default ServerChannels;
