import Peer from "peerjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { peer as frontendPeer } from "../socket";
import { SelectChannels } from "@shared/index";
export type ModalType = "createServer" | "createChannel" | "loading";

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
  activeChannel: SelectChannels | null;
  setActiveChannel: (channel: SelectChannels) => void;
}

export const useChannels = create<ChannelStore>((set) => ({
  activeChannelType: "text",
  setActiveChannelType: (type) => set(() => ({ activeChannelType: type })),
  activeChannel: null,
  setActiveChannel: (channel: SelectChannels) =>
    set(() => ({ activeChannel: channel })),
}));

export interface LoadingStore {
  serversFetched: boolean;
  channelsFetched: boolean;
  setServersFetched: (state: boolean) => void;
  setChannelsFetched: (state: boolean) => void;
}

export const useLoading = create<LoadingStore>((set) => ({
  serversFetched: false,
  channelsFetched: false,
  setServersFetched: (isFetched: boolean) =>
    set(() => ({
      serversFetched: isFetched,
    })),
  setChannelsFetched: (isFetched: boolean) =>
    set(() => ({
      channelsFetched: isFetched,
    })),
}));
