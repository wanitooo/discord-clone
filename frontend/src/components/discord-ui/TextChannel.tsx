import {
  Bars2Icon,
  HashtagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

import socket from "../../socket";
import ChatInput from "./ChatInput";
import { useParams } from "@tanstack/react-router";
import { useChannels, usePeers } from "../../hooks/global-store";
import Messages from "./Messages";
import { ArchiveIcon } from "@radix-ui/react-icons";
import { Separator } from "../shadcn/ui";

// TODO: get type interface from a lib folder of types -> zod
// - append to the current list of chats, instead of getting all the rows -> chat service + chat box set state
// - change userId 21 to actual user id, get from cookies
// - update messages to only specific channels.
interface Chat {
  userId: number;
  chat: string;
  channelId: number;
}

const ChatBox = ({ channel }) => {
  const [chats, setChats] = useState<Chat[] | undefined>();
  const { activeChannel } = useChannels();
  let { channelUUID, serverUUID }: { channelUUID: string; serverUUID: string } =
    useParams({ from: "/app" });
  const { peerStreams } = usePeers();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [chats]);

  useEffect(() => {
    socket.emit("joinChannel", {
      userId: 21,
      channelUUID,
      activeUsers: peerStreams,
    });
    socket.emit("channelMessages", {
      userId: 21,
      channelUUID,
      serverUUID,
    });
  }, [channelUUID]);

  socket.on("channelMessages", (data) => {
    setChats(data.messages); // retrieves channel messages
  });

  socket.on("newMessageEvent", (data) => {
    // console.log("new message", data);

    socket.emit("channelMessages", {
      userId: 21,
      serverUUID,
      channelUUID,
    });
  });
  // console.log("chats?.channelId == channelId", chats[0]?.channelId);
  // console.log("chats", typeof chats);

  return (
    <>
      <div
        className="w-full h-12 flex flex-row justify-between px-4 py-2 shadow border-b-2  text-discord-gray
      dark:border-b-discord-gray
      dark:text-white"
      >
        <div className="inline-flex justify-between gap-2 items-center">
          <HashtagIcon height={25} width={25} className="text-center h-full" />
          <span className="font-semibold">{activeChannel.channelName}</span>
        </div>
        <div className="inline-flex justify-between gap-4">
          <ArchiveIcon
            height={25}
            width={25}
            className="text-center h-full cursor-not-allowed"
          />
          <UserGroupIcon
            height={25}
            width={25}
            className="text-center h-full cursor-not-allowed"
          />
        </div>
      </div>
      {/* <ChatBoxChannel /> */}

      <div className=" w-full h-full pb-4 overflow-hidden">
        <div className="w-full h-full overflow-y-auto flex flex-col-reverse">
          {/* {JSON.stringify(image)} */}
          {/* <img src={image} alt="aws image" /> */}
          {/* {JSON.stringify(chats)} */}
          {chats
            ?.map((c) => (
              <Messages chat={c.chat} userId={c.userId} key={Math.random()} />
            ))
            .reverse()}
          <div className="p-4">
            <div className="bg-white w-fit h-[72px] rounded-full dark:bg-gray-300/10 p-3">
              <HashtagIcon
                height={38}
                width={48}
                className="text-center h-full "
              />
            </div>
            <div className="flex flex-col gap-1 my-6">
              <span className="text-3xl font-ggSans font-bold">
                Welcome to the #{activeChannel.channelName}!
              </span>
              <span className="text-md font-ggSans font-normal text-slate-300/30">
                This is the start of #{activeChannel.channelName} channel.
              </span>
            </div>
            <Separator className="dark:bg-gray-200/10 h-[2.5px] rounded-full" />
          </div>
          <div ref={scrollRef} />
        </div>
        {/* <VoicedChannels /> */}
      </div>
      <ChatInput channelName={activeChannel.channelName} />
    </>
  );
};

export default ChatBox;
