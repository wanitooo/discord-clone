import Peer from "peerjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { peer as frontendPeer } from "../socket";
export type ModalType = "createServer" | "createChannel";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}
export type ThemeType = "dark" | "light";

export interface ThemeStore {
  type: ThemeType | null;
  setTheme: (type: ThemeType) => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set(() => ({ isOpen: true, type: type })),
  onClose: () => set(() => ({ isOpen: false, type: null })),
}));

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      type: "light",
      setTheme: (type) => set(() => ({ type })),
    }),
    {
      name: "theme",
    }
  )
);
export type PeerStream = {
  peerId: string;
  stream: MediaStream;
};
export interface PeerStore {
  peerInstance: Peer;
  peerStreams: PeerStream[];
  addPeerStream: (peerId: string, stream: MediaStream) => void;
  removePeerStream: (id: string) => void;
  clearPeerStreams: () => void;
  setPeerStream: (peerStreams: PeerStream[]) => void;
}

export const usePeers = create<PeerStore>()((set) => ({
  peerStreams: [],
  peerInstance: frontendPeer,
  setPeerStream: (peerStreams) =>
    set(() => ({
      peerStreams,
    })),
  addPeerStream: (peerId, stream) =>
    set((state) => {
      // console.log("in add peer ", peerId);
      // console.log("in add peer ", stream);
      const exists = state.peerStreams.some(
        (peerStream) => peerStream.peerId == peerId
      );
      if (!exists) {
        return {
          peerStreams: [...state.peerStreams, { peerId, stream }],
        };
      }
      return state;
    }),
  removePeerStream: (id) =>
    set((state) => ({
      peerStreams: state.peerStreams.filter(
        (peerStream) => peerStream.peerId !== id
      ),
    })),
  clearPeerStreams: () =>
    set(() => ({
      peerStreams: [],
    })),
}));
export interface ChannelStore {
  activeChannelType: string;
  setActiveChannelType: (type: string) => void;
  activeChannel: string;
  setActiveChannel: (type: string) => void;
}

export const useChannels = create<ChannelStore>((set) => ({
  activeChannelType: "text",
  setActiveChannelType: (type) => set(() => ({ activeChannelType: type })),
  activeChannel: "text",
  setActiveChannel: (channelId) => set(() => ({ activeChannel: channelId })),
}));
