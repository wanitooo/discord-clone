import { Bars2Icon } from "@heroicons/react/24/solid";
import { ScrollArea } from "../shadcn/ui/ScrollArea";
import { useEffect, useState } from "react";
import { createPresignedUrlWithClient } from "../../s3";

import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../typings";

// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3000"
);
// TODO: get type interface from a lib folder of types -> zod
// append to the current list of chats, instead of getting all the rows -> chat service + chat box set state
interface Chat {
  userId: number;
  chat: string;
  channelId: number;
}
const ChatBox = () => {
  const [image, setImage] = useState("");
  const [chats, setChats] = useState<Chat[] | undefined>();
  const [updateChat, setUpdateChat] = useState<boolean>(false);
  useEffect(() => {
    const fetchImageUrl = async () => {
      const res = await createPresignedUrlWithClient(null);
      // console.log(res);
      setImage(res);
    };

    fetchImageUrl();
  }, []);

  useEffect(() => {
    console.log("CHANNEL JOIN SENT");
    socket.emit("joinChannel", { userId: 21, channelId: 9 });

    // socket.on("channelMessages", (data) => {
    //   console.log("joined channel ", data);
    // });

    socket.emit("channelMessages", { userId: 21, channelId: 9 }, (data) => {
      // setChats(data); trigger get all channel messages
    });

    socket.on("channelMessages", (data) => {
      setChats(data.messages); // retrieves channel messages
      console.log("chats", data);
    });

    socket.on("newMessageEvent", (data) => {
      console.log("new message", data);

      socket.emit("channelMessages", { userId: 22, channelId: 9 });
    });
  }, []);

  return (
    <>
      <div className="w-full h-12 flex flex-row justify-between px-4 py-2 shadow border-b-2 border-b-discord-gray ">
        <Bars2Icon height={35} width={35} className="text-center h-full" />
        <Bars2Icon height={35} width={35} className="text-center" />
      </div>
      {/* <ChatBoxChannel /> */}
      <ScrollArea className="w-full h-full px-4" color="black">
        <div className="">
          {/* {JSON.stringify(image)} */}
          {/* <img src={image} alt="aws image" /> */}
          {/* {JSON.stringify(chats)} */}
          <div>
            {chats?.map((chat) => (
              <div className="hover:bg-discord-black/50">
                {/* {chat} */}
                User {chat.userId}: {chat.chat}{" "}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </>
  );
};

export default ChatBox;
