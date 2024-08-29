import LoadingModal from "../discord-ui/LoadingModal";
import { CreateChannelModal } from "../discord-ui/Modals/CreateChannelModal";
import { CreateServerModal } from "../discord-ui/Modals/CreateSeverModal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <CreateChannelModal />
      <LoadingModal />
    </>
  );
};
