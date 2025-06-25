import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

/**
 * Secret Store
 *
 * Manages secret creation form state and related operations:
 * - Form field values and validation
 * - Created secret tracking
 * - Loading states and error handling
 * - Form submission and reset logic
 */

// Types for better type safety - only client-side form state
interface SecretFormState {
  content: string;
  password: string;
  oneTimeAccess: boolean;
  createdSecret: string | null;
}

interface SecretStore {
  // Form state - only client-side form data
  form: SecretFormState;

  // Actions - only form actions
  actions: {
    setContent: (content: string) => void;
    setPassword: (password: string) => void;
    setOneTimeAccess: (oneTimeAccess: boolean) => void;
    setCreatedSecret: (secretId: string) => void;
    resetForm: () => void;
    clearCreatedSecret: () => void;
  };

  // Computed values - only form validation
  computed: {
    isFormValid: () => boolean;
    getSecretUrl: () => string | null;
    hasPassword: () => boolean;
  };
}

// Initial state - only form data
const initialFormState: SecretFormState = {
  content: "",
  password: "",
  oneTimeAccess: false,
  createdSecret: null,
};

export const useSecretStore = create<SecretStore>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      form: initialFormState,

      // Actions
      actions: {
        setContent: (content) =>
          set((state) => {
            state.form.content = content;
          }),

        setPassword: (password) =>
          set((state) => {
            state.form.password = password;
          }),

        setOneTimeAccess: (oneTimeAccess) =>
          set((state) => {
            state.form.oneTimeAccess = oneTimeAccess;
          }),

        setCreatedSecret: (secretId) =>
          set((state) => {
            state.form.createdSecret = secretId;
          }),

        resetForm: () =>
          set((state) => {
            const createdSecret = state.form.createdSecret;
            state.form = {
              ...initialFormState,
              createdSecret, // Keep the created secret for display
            };
          }),

        clearCreatedSecret: () =>
          set((state) => {
            state.form.createdSecret = null;
          }),
      },

      // Computed values
      computed: {
        isFormValid: () => {
          const { form } = get();
          return form.content.trim().length > 0;
        },

        getSecretUrl: () => {
          const { form } = get();
          if (!form.createdSecret) return null;

          return typeof window !== "undefined"
            ? `${window.location.origin}/secret/${form.createdSecret}`
            : null;
        },

        hasPassword: () => {
          const { form } = get();
          return form.password.trim().length > 0;
        },
      },
    })),
    {
      name: "secret-store",
    },
  ),
);
