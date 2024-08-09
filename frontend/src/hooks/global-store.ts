import { create } from "zustand";

import { persist } from "zustand/middleware";
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
