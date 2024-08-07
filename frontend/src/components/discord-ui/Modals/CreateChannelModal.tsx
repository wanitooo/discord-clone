import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
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

import UploadAddServerIcon from "../UploadAddServerIcon";
// import { FileUpload } from "@/components/file-upload";
import { useModal } from "../../../hooks/global-store";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../../shadcn/ui/RadioGroup";
import { Switch } from "../../shadcn/ui/Switch";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Channel name is required.",
  }),
  channelType: z.enum(["text", "voice"], {
    required_error: "You need to select a channel type.",
  }),
  isPrivate: z.boolean().default(false),
});

// const createChannel = async (
//   name: string,
//   channelType: string,
//   isPrivate: boolean
// ) => {
//   // const fileBlob = await fetch(image).then((r) => r.blob());
//   const form = new FormData();
//   // console.log("fileblob ", fileBlob);
//   form.append("file", imageFile);
//   form.append("name", name);
//   form.append("serverOwner", "1"); // should be taken form a cookie that contains the user
//   const data = await fetch(`http://127.0.0.1:3000/api/servers`, {
//     method: "POST",
//     mode: "cors",
//     // headers: {
//     //   "Content-Type": "multipart/form-data",
//     // },
//     body: form,
//   })
//     .then((res) => res.json())
//     .catch((res) => Promise.reject(new Error(`Failed to fetch data: ${res}`)));

//   // console.log("data ", data);

//   return data;
// };

// TODO: Toast for succesful channel creation
// Add icons to channel type radio buttons
// Add icons in general
// Polish alignments
export const CreateChannelModal = () => {
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
      // console.log("triggered submit");
      // setImagePreview(undefined);
      // await uploadQuery.refetch();
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
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold">
            Create your channel
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            {/* dynamically able to change based on channel categories*/}
            in {""} channels
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6 ">
              <div className="flex text-zinc-500">
                <FormField
                  control={form.control}
                  name="channelType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-4 w-full">
                      <FormLabel>CHANNEL TYPE</FormLabel>
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
                              # Text
                              <FormDescription>
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
                              {">"} Voice
                              <FormDescription>
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
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter your channel name"
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
                      <Switch
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

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
