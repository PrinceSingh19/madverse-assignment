import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  password: string;
  showPassword: boolean;
  secretContent: string | null;
  isRevealed: boolean;
  isOneTimeAccess: boolean;
};

type Actions = {
  setPassword: (password: string) => void;
  togglePasswordVisibility: () => void;
  setSecretContent: (content: string, isOneTime: boolean) => void;
  resetState: () => void;
  clearPassword: () => void;
  canRevealSecret: (requiresPassword: boolean) => boolean;
  hasPassword: () => boolean;
};

export const useViewSecretStore = create<State & Actions>()(
  immer((set, get) => ({
    password: "",
    showPassword: false,
    secretContent: null,
    isRevealed: false,
    isOneTimeAccess: false,

    setPassword: (password: string) =>
      set((state) => {
        state.password = password;
      }),

    togglePasswordVisibility: () =>
      set((state) => {
        state.showPassword = !state.showPassword;
      }),

    setSecretContent: (content: string, isOneTime: boolean) =>
      set((state) => {
        state.secretContent = content;
        state.isRevealed = true;
        state.isOneTimeAccess = isOneTime;
      }),

    resetState: () =>
      set((state) => {
        state.password = "";
        state.showPassword = false;
        state.secretContent = null;
        state.isRevealed = false;
        state.isOneTimeAccess = false;
      }),

    clearPassword: () =>
      set((state) => {
        state.password = "";
      }),

    canRevealSecret: (requiresPassword: boolean) => {
      const { password } = get();
      return requiresPassword ? password.trim() !== "" : true;
    },

    hasPassword: () => {
      const { password } = get();
      return password.trim() !== "";
    },
  })),
);
