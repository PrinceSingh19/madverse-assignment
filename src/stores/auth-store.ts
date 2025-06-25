import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  // Sign In
  signInEmail: string;
  signInPassword: string;
  signInShowPassword: boolean;

  // Registration
  registerEmail: string;
  registerPassword: string;
  registerName: string;
  registerShowPassword: boolean;
};

type Actions = {
  // Sign In Actions
  setSignInEmail: (email: string) => void;
  setSignInPassword: (password: string) => void;
  toggleSignInPasswordVisibility: () => void;
  resetSignInForm: () => void;

  // Registration Actions
  setRegisterEmail: (email: string) => void;
  setRegisterPassword: (password: string) => void;
  setRegisterName: (name: string) => void;
  toggleRegisterPasswordVisibility: () => void;
  resetRegisterForm: () => void;

  // Form validation
  isSignInFormValid: () => boolean;
  isRegisterFormValid: () => boolean;
  getPasswordStrength: (password: string) => {
    strength: number;
    label: string;
  };
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

export const useAuthStore = create<State & Actions>()(
  immer((set, get) => ({
    // Sign In initial state
    signInEmail: "",
    signInPassword: "",
    signInShowPassword: false,

    // Registration initial state
    registerEmail: "",
    registerPassword: "",
    registerName: "",
    registerShowPassword: false,

    // Sign In Actions
    setSignInEmail: (email: string) =>
      set((state) => {
        state.signInEmail = email;
      }),

    setSignInPassword: (password: string) =>
      set((state) => {
        state.signInPassword = password;
      }),

    toggleSignInPasswordVisibility: () =>
      set((state) => {
        state.signInShowPassword = !state.signInShowPassword;
      }),

    resetSignInForm: () =>
      set((state) => {
        state.signInEmail = "";
        state.signInPassword = "";
        state.signInShowPassword = false;
      }),

    // Registration Actions
    setRegisterEmail: (email: string) =>
      set((state) => {
        state.registerEmail = email;
      }),

    setRegisterPassword: (password: string) =>
      set((state) => {
        state.registerPassword = password;
      }),

    setRegisterName: (name: string) =>
      set((state) => {
        state.registerName = name;
      }),

    toggleRegisterPasswordVisibility: () =>
      set((state) => {
        state.registerShowPassword = !state.registerShowPassword;
      }),

    resetRegisterForm: () =>
      set((state) => {
        state.registerEmail = "";
        state.registerPassword = "";
        state.registerName = "";
        state.registerShowPassword = false;
      }),

    // Form validation
    isSignInFormValid: () => {
      const { signInEmail, signInPassword } = get();
      return signInEmail.trim() !== "" && signInPassword.trim() !== "";
    },

    isRegisterFormValid: () => {
      const { registerEmail, registerPassword } = get();
      return registerEmail.trim() !== "" && registerPassword.length >= 6;
    },

    getPasswordStrength: calculatePasswordStrength,
  })),
);
