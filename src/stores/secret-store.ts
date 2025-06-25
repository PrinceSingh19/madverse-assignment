import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  content: string;
  password: string;
  oneTimeAccess: boolean;
  expiresAt: Date | null;
  createdSecret: string | null;
};

type Actions = {
  setContent: (content: string) => void;
  setPassword: (password: string) => void;
  setOneTimeAccess: (oneTimeAccess: boolean) => void;
  setExpiresAt: (date: Date | null) => void;
  setCreatedSecret: (secretId: string) => void;
  resetForm: () => void;
  clearCreatedSecret: () => void;
  isFormValid: () => boolean;
  getSecretUrl: () => string | null;
  hasPassword: () => boolean;
};

export const useSecretStore = create<State & Actions>()(
  immer((set, get) => ({
    content: "",
    password: "",
    oneTimeAccess: false,
    expiresAt: null,
    createdSecret: null,

    setContent: (content: string) =>
      set((state) => {
        state.content = content;
      }),

    setPassword: (password: string) =>
      set((state) => {
        state.password = password;
      }),

    setOneTimeAccess: (oneTimeAccess: boolean) =>
      set((state) => {
        state.oneTimeAccess = oneTimeAccess;
      }),

    setExpiresAt: (date: Date | null) =>
      set((state) => {
        state.expiresAt = date;
      }),

    setCreatedSecret: (secretId: string) =>
      set((state) => {
        state.createdSecret = secretId;
      }),

    resetForm: () =>
      set((state) => {
        const createdSecret = state.createdSecret;
        state.content = "";
        state.password = "";
        state.oneTimeAccess = false;
        state.expiresAt = null;
        state.createdSecret = createdSecret; // Keep the created secret for display
      }),

    clearCreatedSecret: () =>
      set((state) => {
        state.createdSecret = null;
      }),

    isFormValid: () => {
      const { content } = get();
      return content.trim().length > 0;
    },

    getSecretUrl: () => {
      const { createdSecret } = get();
      if (!createdSecret) return null;

      return typeof window !== "undefined"
        ? `${window.location.origin}/secret/${createdSecret}`
        : null;
    },

    hasPassword: () => {
      const { password } = get();
      return password.trim().length > 0;
    },
  })),
);
