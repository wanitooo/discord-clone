import { useModal } from "../../../hooks/global-store";
import { cn } from "../../shadcn/utils/utils";
import SidebarTooltip, { SidebarTooltipProps } from "./SidebarTooltip";
import { PlusIcon } from "@radix-ui/react-icons";
interface SidebarProps extends SidebarTooltipProps {
  type?: "server" | "action";
}

// This component can either be action icon (e.g add a server) or actual servers icon
const SidebarIcon = ({
  type = "server",
  align = "center",
  side = "right",
  label = "server",
}: SidebarProps) => {
  const { onOpen } = useModal();

  return (
    <SidebarTooltip align={align} label={label} side={side}>
      <div className="flex flex-row justify-center items-center group my-1 group relative">
        {/* If current, show full bar */}
        {/* If hovering, show half bar */}
        <div
          className={cn(
            "w-[5px] h-1 bg-white rounded-r-full opacity-0 group-hover:h-6 group-hover:opacity-100 absolute left-0   transition-all duration-300  ease-in-out   animate-in",
            type == "server" ? "" : "hidden"
          )}
        ></div>
        {/* TODO: fix this logic, each icon click will open the create server modal */}
        {type == "server" ? (
          <button
            onClick={() =>
              console.log("Not yet implemented server icon action")
            }
          >
            <img
              src="https://images.unsplash.com/photo-1576158114131-f211996e9137?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=500"
              alt="server image"
              style={{
                objectFit: "fill",
              }}
              className="
              w-10 h-10 rounded-3xl 
              transition-all
              duration-300
              group-hover:rounded-xl 
              ease-in-out"
            />
          </button>
        ) : (
          <button onClick={() => onOpen("createServer")}>
            <div
              className="
              bg-discord-gray
              w-10 h-10 rounded-3xl 
              flex flex-col
              items-center
              align-middle
              justify-center
              transition-all
              duration-300
              ease-in-out
              group-hover:rounded-xl 
              group-hover:bg-green-500
              "
            >
              <PlusIcon
                width={24}
                height={24}
                className="text-green-400 group-hover:text-white"
              />
            </div>
          </button>
        )}
      </div>
    </SidebarTooltip>
  );
};

export default SidebarIcon;
