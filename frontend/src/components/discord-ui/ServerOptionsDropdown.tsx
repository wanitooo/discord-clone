import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button, Separator } from "../shadcn/ui";
import {
  ChevronDownIcon,
  //   Cross1Icon,
  PersonIcon,
  GearIcon,
  PlusCircledIcon,
  FilePlusIcon,
  BellIcon,
  EyeClosedIcon,
  Pencil1Icon,
  ExitIcon,
} from "@radix-ui/react-icons";

const ServerOptionsDropdown = () => {
  return (
    <DropdownMenu>
      {/* Shoudld have an arrow and an x when clicked */}
      <DropdownMenuTrigger className="w-full flex outline-none" asChild>
        <Button
          className="
          rounded-none 
          bg-discord-black  
          w-full flex-items-center justify-between
          hover:bg-discord-gray/70
          font-normal
          transition-all
        "
        >
          Server Options
          <ChevronDownIcon />
          {/* <Cross1Icon /> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="
        flex flex-col
        w-[210px]
        text-xs font-medium text-black
        bg-discord-blackest
        space-y-[2px] my-2 py-2
        rounded-sm
        focus:outline-none
        "
      >
        <DropdownMenuItem
          onClick={() => {}}
          className="
          flex px-3 py-2 mx-2 rounded-sm
          text-indigo-600 text-xs  
          hover:bg-indigo-500 hover:text-white
          cursor-pointer
          "
        >
          Invite People
          <PersonIcon className="h-4 w-4 ml-auto" />
        </DropdownMenuItem>
        <Separator className="mx-auto w-11/12 bg-discord-black " />
        <DropdownMenuItem
          onClick={() => {}}
          className="
          flex px-3 py-2 mx-2 rounded-sm
          text-gray-400 text-xs 
          hover:bg-indigo-500 hover:text-white
          cursor-pointer
          "
        >
          Server Settings
          <GearIcon className="h-4 w-4 ml-auto" />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {}}
          className="
          flex px-3 py-2 mx-2 rounded-sm
          text-gray-400 text-xs 
          hover:bg-indigo-500 hover:text-white
          cursor-pointer
          "
        >
          Create Channel
          <PlusCircledIcon className="h-4 w-4 ml-auto" />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {}}
          className="
          flex px-3 py-2 mx-2 rounded-sm
          text-gray-400 text-xs 
          hover:bg-indigo-500 hover:text-white
          cursor-pointer
          "
        >
          Create Category
          <FilePlusIcon className="h-4 w-4 ml-auto" />
        </DropdownMenuItem>
        <Separator className="mx-auto w-11/12 bg-discord-black" />

        <DropdownMenuItem
          onClick={() => {}}
          className="
          flex px-3 py-2 mx-2 rounded-sm
          text-gray-400 text-xs 
          hover:bg-indigo-500 hover:text-white
          cursor-pointer
          "
        >
          Notification Settings
          <BellIcon className="h-4 w-4 ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {}}
          className="
          flex px-3 py-2 mx-2 rounded-sm
          text-gray-400 text-xs 
          hover:bg-indigo-500 hover:text-white
          cursor-pointer
          "
        >
          Privacy Settings
          <EyeClosedIcon className="h-4 w-4 ml-auto" />
        </DropdownMenuItem>
        <Separator className="mx-auto w-11/12 bg-discord-black" />
        <DropdownMenuItem
          onClick={() => {}}
          className="
          flex px-3 py-2 mx-2 rounded-sm
          text-gray-400 text-xs 
          hover:bg-indigo-500 hover:text-white
          cursor-pointer
          "
        >
          Edit Server Profile
          <Pencil1Icon className="h-4 w-4 ml-auto" />
        </DropdownMenuItem>
        <Separator className="mx-auto w-11/12 bg-discord-black " />
        <DropdownMenuItem
          onClick={() => {}}
          className="
          flex px-3 py-2 mx-2 rounded-sm
          text-red-500 text-xs 
          hover:bg-red-500 hover:text-white
          cursor-pointer
          "
        >
          {/* If server owner, dont show */}
          Leave Server
          <ExitIcon className="h-4 w-4 ml-auto" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerOptionsDropdown;
