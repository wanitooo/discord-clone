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

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required.",
  }),
  image: z.instanceof(FileList).refine((file) => {
    console.log("file length,", file.length);
    return file?.length == 1;
  }, "Select an image to upload."),
});

const createServer = async (
  name: string,
  serverOwner: string,
  imageFile: File
) => {
  // const fileBlob = await fetch(image).then((r) => r.blob());
  const form = new FormData();
  // console.log("fileblob ", fileBlob);
  form.append("file", imageFile);
  form.append("name", name);
  form.append("serverOwner", "1"); // should be taken form a cookie that contains the user
  const data = await fetch(`http://127.0.0.1:3000/api/servers`, {
    method: "POST",
    mode: "cors",
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
    body: form,
  })
    .then((res) => res.json())
    .catch((res) => Promise.reject(new Error(`Failed to fetch data: ${res}`)));

  // console.log("data ", data);

  return data;
};

// TODO: Toast for succesful server creation
// Refect sidebar servers on modal close
// Remove preview if cancelled image selection
export const CreateServerModal = () => {
  const { isOpen, onClose, type } = useModal();
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Must be taken from the current authenticated user.
  // @ts-expect-error: cookies not setup yet
  const [serverOwner, setServerOwner] = useState<string>("");

  const uploadQuery = useQuery({
    queryKey: ["uploadServerImage", imageFile],
    queryFn: async () => {
      const { name, image } = form.getValues();
      // console.log("name", name, "image ", image[0] ? image[0] : null);
      if (image[0]) {
        return await createServer(name, serverOwner, image[0]);
      }
    },
    enabled: false,
  });

  const onImageChange = (): void => {
    // console.log("triggered image change");
    const { image } = form.getValues();

    if (image) {
      // console.log("image ", image);
      setImageFile(image[0]);
      const url = URL.createObjectURL(image[0]);
      setImagePreview(url);
    }
  };
  const isModalOpen = isOpen && type === "createServer";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const fileRef = form.register("image");

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    // console.log("VALUES", values);
    // console.log("FORM", form.getValues());
    try {
      //   await axios.post("/api/servers", values);
      // console.log("triggered submit");
      setImagePreview(undefined);
      await uploadQuery.refetch();
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
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6 ">
              <div className="flex items-center justify-center text-center">
                {/* TODO: Figure out how to include this component to the form field */}
                {/* <UploadAddServerIcon
                  image={imagePreview}
                  onImageChange={onImageChange}
                /> */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center gap-4">
                      {/* <FormLabel>Server Image</FormLabel> */}
                      <FormControl>
                        <UploadAddServerIcon
                          fileRef={fileRef}
                          image={imagePreview}
                          field={field}
                          onImageChange={onImageChange}
                        />
                      </FormControl>
                      {/* <FormDescription>Upload a file</FormDescription> */}
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
                      Server Name:
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter your server name"
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
