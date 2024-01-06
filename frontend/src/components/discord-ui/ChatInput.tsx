import React from "react";
import { Input } from "../shadcn/ui";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/solid";

const ChatInput = () => {
  return (
    <div className="inline-flex relative w-full px-4">
      <PlusCircleIcon
        height={25}
        width={25}
        className="absolute top-1 left-8"
      />
      <Input
        className="bg-[#383a40] pl-12 
      mb-2
      border-none outline-0 border-0 focus-visble:ring-1"
      />
    </div>
  );
};

export default ChatInput;
