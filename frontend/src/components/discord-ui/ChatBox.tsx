import { Bars2Icon } from "@heroicons/react/24/solid";
import { ScrollArea } from "../shadcn/ui/ScrollArea";
import { useEffect, useState } from "react";
import { createPresignedUrlWithClient } from "../../s3";

const ChatBox = () => {
  const [image, setImage] = useState("");
  useEffect(() => {
    const fetchImageUrl = async () => {
      const res = await createPresignedUrlWithClient(null);
      console.log(res);
      setImage(res);
    };

    fetchImageUrl();
  }, []);
  return (
    <>
      <div className="w-full h-12 flex flex-row justify-between px-4 py-2 shadow border-b-2 border-b-discord-gray ">
        <Bars2Icon height={35} width={35} className="text-center h-full" />
        <Bars2Icon height={35} width={35} className="text-center" />
      </div>
      {/* <ChatBoxChannel /> */}
      <ScrollArea className="w-full h-full px-4" color="black">
        <div className="hover:bg-discord-black/50">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus,
          consequatur ipsam nisi, a natus ratione iusto optio necessitatibus
          sunt, quasi repellendus molestiae unde quo. Voluptas cumque fugit
          corrupti ratione aspernatur ad, architecto beatae modi sint dolorum
          ab, tempora praesentium natus ullam repellat! Tempore, nihil
          consequatur! Aliquid tenetur quam dicta nulla?
          {/* {JSON.stringify(image)} */}
          <img src={image} alt="aws image" />
        </div>
      </ScrollArea>
    </>
  );
};

export default ChatBox;
