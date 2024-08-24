import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import { useParams } from "@tanstack/react-router";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3000"
);

// TODO: Create 1 global socket maybe
// create zod validator
// allow file inputs
// make better plus icon
const ChatInput = ({ channelName = " " }) => {
  const chatInputForm = useForm({
    defaultValues: {
      chat: "",
    },
  });

  const {
    channelUUID,
    serverUUID,
  }: { channelUUID: string; serverUUID: string } = useParams({ from: "/app" });
  const onSubmit = (data) => {
    // console.log("TEST", );
    socket.emit("sendMessage", {
      userId: 1,
      chat: data.chat,
      channelUUID: channelUUID,
      serverUUID: serverUUID,
    });
    chatInputForm.reset();
  };

  return (
    <Form {...chatInputForm}>
      <form
        onSubmit={chatInputForm.handleSubmit(onSubmit)}
        className="w-4/5 space-y-6"
      >
        <FormField
          control={chatInputForm.control}
          name="chat"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="inline-flex relative w-full px-4">
                  <PlusCircleIcon
                    height={25}
                    width={25}
                    className="absolute top-1 left-8
                   text-discord-gray
                   dark:text-white
                    "
                  />
                  <Input
                    name="chat input"
                    className="bg-discord-lighter text-black dark:text-white dark:bg-[#383a40] pl-12 mb-2
                    border-none outline-0 border-0 focus-visble:ring-1"
                    placeholder={`Message # ${channelName}`}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
