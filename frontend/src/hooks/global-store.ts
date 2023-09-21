import { create } from "zustand";

export type ModalType = "createServer";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}
export type ThemeType = "dark" | "light";

interface ThemeStore {
  type: ThemeType | null;
  setTheme: (type: ThemeType) => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set(() => ({ isOpen: true, type: type })),
  onClose: () => set(() => ({ isOpen: false, type: null })),
}));

export const useTheme = create<ThemeStore>((set) => ({
  type: null,
  setTheme: (type) => set(() => ({ type })),
}));
