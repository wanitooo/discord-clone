import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/ui";
import { useLoading, useModal } from "../../hooks/global-store";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const Loading = () => {
  const { isOpen, onClose, type, onOpen } = useModal();

  const { serversFetched, channelsFetched } = useLoading();
  useEffect(() => {
    if (!serversFetched || !channelsFetched) {
      onOpen("loading");
    } else {
      onClose();
    }
  }, [serversFetched, channelsFetched, onClose, onOpen]);

  const open = isOpen && type == "loading";
  return (
    <Dialog open={open}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent
        className="w-1/3 h-1/3 p-12 bg-white text-black dark:bg-discord-black dark:text-white flex flex-col items-center justify-center outline-none"
        type="loading"
      >
        <ArrowPathIcon className="animate-spin" width={200} />
      </DialogContent>
    </Dialog>
  );
};

export default Loading;
