import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Authentication Store

// Types for form state
interface AuthFormState {
  email: string;
  password: string;
  name?: string;
  showPassword: boolean;
}

interface AuthStore {
  // Sign In
  signIn: AuthFormState;

  // Registration
  register: AuthFormState & {
    name: string;
  };

  // Actions for Sign In
  signInActions: {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    togglePasswordVisibility: () => void;
    resetForm: () => void;
  };

  // Actions for Registration
  registerActions: {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setName: (name: string) => void;
    togglePasswordVisibility: () => void;
    resetForm: () => void;
  };

  // Form validation
  computed: {
    isSignInFormValid: () => boolean;
    isRegisterFormValid: () => boolean;
    getPasswordStrength: (password: string) => {
      strength: number;
      label: string;
    };
  };
}

// Initial state
const initialSignInState: AuthFormState = {
  email: "",
  password: "",
  showPassword: false,
};

const initialRegisterState: AuthFormState & { name: string } = {
  email: "",
  password: "",
  name: "",
  showPassword: false,
};

// Password strength check
const calculatePasswordStrength = (password: string) => {
  if (!password) return { strength: 0, label: "No password" };

  let strength = 0;
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  strength = (checks.filter(Boolean).length / checks.length) * 100;

  if (strength < 40) return { strength, label: "Weak" };
  if (strength < 70) return { strength, label: "Fair" };
  if (strength < 90) return { strength, label: "Good" };
  return { strength, label: "Strong" };
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      signIn: initialSignInState,
      register: initialRegisterState,

      // Sign In
      signInActions: {
        setEmail: (email) =>
          set((state) => {
            state.signIn.email = email;
          }),

        setPassword: (password) =>
          set((state) => {
            state.signIn.password = password;
          }),

        togglePasswordVisibility: () =>
          set((state) => {
            state.signIn.showPassword = !state.signIn.showPassword;
          }),

        resetForm: () =>
          set((state) => {
            state.signIn = { ...initialSignInState };
          }),
      },

      // Registration
      registerActions: {
        setEmail: (email) =>
          set((state) => {
            state.register.email = email;
          }),

        setPassword: (password) =>
          set((state) => {
            state.register.password = password;
          }),

        setName: (name) =>
          set((state) => {
            state.register.name = name;
          }),

        togglePasswordVisibility: () =>
          set((state) => {
            state.register.showPassword = !state.register.showPassword;
          }),

        resetForm: () =>
          set((state) => {
            state.register = { ...initialRegisterState };
          }),
      },

      // Form validation
      computed: {
        isSignInFormValid: () => {
          const { signIn } = get();
          return signIn.email.trim() !== "" && signIn.password.trim() !== "";
        },

        isRegisterFormValid: () => {
          const { register } = get();
          return register.email.trim() !== "" && register.password.length >= 6;
        },

        getPasswordStrength: calculatePasswordStrength,
      },
    })),
    {
      name: "auth-store",
    },
  ),
);
