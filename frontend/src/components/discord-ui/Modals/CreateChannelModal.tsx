import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  ChannelSwitch,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormDescription,
} from "../../shadcn/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from "../../shadcn/ui";

import { useModal } from "../../../hooks/global-store";
import { RadioGroup, RadioGroupItem } from "../../shadcn/ui/RadioGroup";
import { getRouteApi } from "@tanstack/react-router";
import { HashtagIcon, SpeakerWaveIcon } from "@heroicons/react/24/solid";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Channel name is required.",
  }),
  channelType: z.enum(["text", "voice"], {
    required_error: "You need to select a channel type.",
  }),
  isPrivate: z.boolean().default(false),
});

const createChannel = async (
  name: string,
  channelType: string,
  isPrivate: boolean,
  serverUUID: string
) => {
  const data = await fetch(`http://127.0.0.1:3000/api/channels`, {
    method: "POST",
    mode: "cors",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      serverUUID,
      type: channelType,
      mode: isPrivate ? "private" : "public",
    }),
  })
    .then((res) => res.json())
    .catch((res) =>
      Promise.reject(new Error(`Failed to create channel: ${res}`))
    );

  console.log("channel ", data);

  return data;
};

// TODO: Toast for succesful channel creation
// Fix get route API, instead of global it should only be active whenever the route is in /app/$serverUUID
const routeApi = getRouteApi();
export const CreateChannelModal = () => {
  const { serverUUID } = routeApi.useParams();
  // console.log("serverid", serverId);
  const createChannelQuery = useQuery({
    queryKey: ["createChannelQuery", serverUUID],
    queryFn: async () => {
      const { name, channelType, isPrivate } = form.getValues();
      // console.log("name", name, "image ", image[0] ? image[0] : null);
      return await createChannel(name, channelType, isPrivate, serverUUID);
    },
    enabled: false,
  });

  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "createChannel";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      channelType: "text",
      isPrivate: false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    // console.log("VALUES", values);
    // console.log("FORM", form.getValues());
    try {
      //   await axios.post("/api/servers", values);
      // console.log("triggered submit")
      // setImagePreview(undefined);
      await createChannelQuery.refetch();
      handleClose();
      // router.refresh();
    } catch (error) {
      console.log(error); // TODO: actually handle this error
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden bg-slate-50 text-black dark:text-slate-300 dark:bg-discord-gray">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold">
            Create your channel
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-slate-300">
            {/* dynamically able to change based on channel categories*/}
            <span>in server X</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6 ">
              <div className="flex text-zinc-500 dark:text-slate-300 bg-slate-50 dark:bg-discord-gray">
                <FormField
                  control={form.control}
                  name="channelType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2 w-full">
                      <FormLabel className="text-xs uppercase">
                        Channel Type
                      </FormLabel>
                      <FormControl className="w-full">
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={"text"}
                          className="space-y-1 "
                        >
                          <FormItem
                            className="flex flex-row-reverse justify-between items-center space-x-3 space-y-0  
                          dark:bg-discord-black dark:hover:bg-discord-gray
                          bg-slate-50 
                         hover:bg-slate-100
                         focus:bg-slate-100
                          w-full p-4 rounded-sm"
                          >
                            <FormControl>
                              <RadioGroupItem value="text" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <div className="flex flex-row gap-1 pb-1">
                                <HashtagIcon width={15} />
                                <span className="text-sm">Text</span>
                              </div>
                              <FormDescription className="text-slate-400/75">
                                Send text messages
                              </FormDescription>
                            </FormLabel>
                          </FormItem>

                          <FormItem
                            className="flex flex-row-reverse justify-between items-center space-x-3 space-y-0 
                          dark:bg-discord-black dark:hover:bg-discord-gray 
                          bg-slate-50 
                         hover:bg-slate-100
                         focus:bg-slate-100
                          w-full p-4 rounded-sm"
                          >
                            <FormControl>
                              <RadioGroupItem value="voice" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {" "}
                              <div className="flex flex-row gap-1 pb-1">
                                <SpeakerWaveIcon width={15} />
                                <span className="text-sm">Voice</span>
                              </div>
                              <FormDescription className="text-slate-400/75">
                                Hang out together with voice, and video
                              </FormDescription>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-slate-100 dark:bg-discord-black border-0 focus-visible:ring-0 dark:text-slate-300 text-black focus-visible:ring-offset-0 placeholder:text-slate-500/50 dark:placeholder:text-slate-100/50 placeholder:font-normal"
                        placeholder="# channel name"
                        {...field}
                        onChange={(e) => {
                          // console.log("NAME FIELD", field);
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="flex flex-row justify-between w-full items-center">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                      PRIVATE CHANNEL
                    </FormLabel>
                    <FormControl>
                      <ChannelSwitch
                        checked={field.value}
                        // className="w-10 y-10"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-discord-black">
              <Button
                disabled={isLoading}
                type="submit"
                className="bg-discord-indigo text-white hover:bg-discord-indigo/75"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
