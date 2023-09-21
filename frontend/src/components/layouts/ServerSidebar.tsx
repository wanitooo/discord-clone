import { useNavigate, useParams } from "@tanstack/react-router";
import { server } from "../../routes/appRoutes/serverRoutes";
import { useEffect } from "react";

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

const ServerSidebar = () => {
  const { serverId } = useParams({ from: "/app/server" });
  const navigate = useNavigate();
  useEffect(() => {
    if (serverId === undefined) {
      navigate({ to: "/app/server/0" });
    }
  }, []);

  console.log("server id", serverId);

  return (
    <div className="h-screen bg-discord-black w-[245px]">
      {serverId ? (
        <div>
          <div className="bg-discord-blackest">
            {dummySidebarData[parseInt(serverId)].serverName}
          </div>
          <div>
            {dummySidebarData[parseInt(serverId)].channels.map((item, idx) => (
              <div key={idx}>{item}</div>
            ))}
          </div>
        </div>
      ) : (
        <div>"Pick a server"</div>
      )}
    </div>
  );
};

export default ServerSidebar;
