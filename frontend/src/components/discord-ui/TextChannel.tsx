import { Bars2Icon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

import socket from "../../socket";
import ChatInput from "./ChatInput";
import { useParams } from "@tanstack/react-router";
import { useChannels, usePeers } from "../../hooks/global-store";
import Messages from "./Messages";

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
        <Bars2Icon height={35} width={35} className="text-center h-full" />
        <Bars2Icon height={35} width={35} className="text-center" />
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
          <div ref={scrollRef} />
        </div>
        {/* <VoicedChannels /> */}
      </div>
      <ChatInput channelName={activeChannel.channelName} />
    </>
  );
};

export default ChatBox;
