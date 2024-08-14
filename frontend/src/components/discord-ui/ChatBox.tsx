import { Bars2Icon } from "@heroicons/react/24/solid";
import { ScrollArea } from "../shadcn/ui/ScrollArea";
import { useEffect, useState } from "react";
import { createPresignedUrlWithClient } from "../../s3";

import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../typings";
import ChatInput from "./ChatInput";
import { useParams } from "@tanstack/react-router";
import VoicedChannels from "./VoicedChannels";

// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3000"
);
// TODO: get type interface from a lib folder of types -> zod
// - append to the current list of chats, instead of getting all the rows -> chat service + chat box set state
// - change userId 21 to actual user id, get from cookies
// - update messages to only specific channels.
interface Chat {
  userId: number;
  chat: string;
  channelId: number;
}

const ChatBox = () => {
  const [image, setImage] = useState("");
  const [chats, setChats] = useState<Chat[] | undefined>();
  const [updateChat, setUpdateChat] = useState<boolean>(false);

  let { channelId }: { channelId: string } = useParams();
  channelId = parseInt(channelId);

  useEffect(() => {
    const fetchImageUrl = async () => {
      const res = await createPresignedUrlWithClient(null);
      // console.log(res);
      setImage(res);
    };

    fetchImageUrl();
  }, []);

  useEffect(() => {
    // console.log("channel ID", channelId);

    socket.emit("joinChannel", { userId: 21, channelId: channelId });
    socket.emit("channelMessages", {
      userId: 21,
      channelId: channelId,
    });
  }, [channelId]);

  socket.on("channelMessages", (data) => {
    setChats(data.messages); // retrieves channel messages
    // console.log("chats", data);
  });

  socket.on("newMessageEvent", (data) => {
    // console.log("new message", data);

    socket.emit("channelMessages", {
      userId: 21,
      channelId: channelId,
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

      <ScrollArea className="w-full h-full">
        <div className="w-full h-full">
          {/* {JSON.stringify(image)} */}
          {/* <img src={image} alt="aws image" /> */}
          {/* {JSON.stringify(chats)} */}
          <div className="">
            {chats?.map((chat) =>
              chat.channelId == channelId ? (
                <div
                  className=" text-discord-gray 
                hover:bg-discord-black/25
                dark:hover:bg-discord-black/50 px-4
               dark:text-white 
                "
                  key={chat.chat + chat.userId}
                >
                  {/* {chat} */}
                  CH: {chat.channelId} User {chat.userId}: {chat.chat}{" "}
                </div>
              ) : (
                ""
              )
            )}
          </div>
        </div>
        <VoicedChannels />
      </ScrollArea>
      <ChatInput channelName={channelId} />
    </>
  );
};

export default ChatBox;
