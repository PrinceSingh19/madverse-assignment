import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  // Profile form state
  profileForm: {
    name: string;
    email: string;
  };

  // Password change form state
  passwordForm: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    showCurrentPassword: boolean;
    showNewPassword: boolean;
    showConfirmPassword: boolean;
  };

  // UI state
  activeTab: "profile" | "password";
  isProfileFormDirty: boolean;
  isPasswordFormDirty: boolean;
};

type Actions = {
  // Profile form actions
  setProfileName: (name: string) => void;
  setProfileEmail: (email: string) => void;
  resetProfileForm: () => void;
  populateProfileForm: (data: { name: string | null; email: string }) => void;

  // Password form actions
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  toggleCurrentPasswordVisibility: () => void;
  toggleNewPasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  resetPasswordForm: () => void;

  // UI actions
  setActiveTab: (tab: "profile" | "password") => void;

  // Validation
  isProfileFormValid: () => boolean;
  isPasswordFormValid: () => boolean;
  getPasswordStrength: (password: string) => {
    score: number;
    label: string;
    color: string;
  };

  // Utility actions
  resetProfile: () => void;
};

const initialState: State = {
  profileForm: {
    name: "",
    email: "",
  },
  passwordForm: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  },
  activeTab: "profile",
  isProfileFormDirty: false,
  isPasswordFormDirty: false,
};

export const useProfileStore = create<State & Actions>()(
  immer((set, get) => ({
    ...initialState,

    // Profile form actions
    setProfileName: (name: string) =>
      set((state) => {
        state.profileForm.name = name;
        state.isProfileFormDirty = true;
      }),

    setProfileEmail: (email: string) =>
      set((state) => {
        state.profileForm.email = email;
        state.isProfileFormDirty = true;
      }),

    resetProfileForm: () =>
      set((state) => {
        state.profileForm = {
          name: "",
          email: "",
        };
        state.isProfileFormDirty = false;
      }),

    populateProfileForm: (data: { name: string | null; email: string }) =>
      set((state) => {
        state.profileForm = {
          name: data.name ?? "",
          email: data.email,
        };
        state.isProfileFormDirty = false;
      }),

    // Password form actions
    setCurrentPassword: (password: string) =>
      set((state) => {
        state.passwordForm.currentPassword = password;
        state.isPasswordFormDirty = true;
      }),

    setNewPassword: (password: string) =>
      set((state) => {
        state.passwordForm.newPassword = password;
        state.isPasswordFormDirty = true;
      }),

    setConfirmPassword: (password: string) =>
      set((state) => {
        state.passwordForm.confirmPassword = password;
        state.isPasswordFormDirty = true;
      }),

    toggleCurrentPasswordVisibility: () =>
      set((state) => {
        state.passwordForm.showCurrentPassword =
          !state.passwordForm.showCurrentPassword;
      }),

    toggleNewPasswordVisibility: () =>
      set((state) => {
        state.passwordForm.showNewPassword =
          !state.passwordForm.showNewPassword;
      }),

    toggleConfirmPasswordVisibility: () =>
      set((state) => {
        state.passwordForm.showConfirmPassword =
          !state.passwordForm.showConfirmPassword;
      }),

    resetPasswordForm: () =>
      set((state) => {
        state.passwordForm = {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          showCurrentPassword: false,
          showNewPassword: false,
          showConfirmPassword: false,
        };
        state.isPasswordFormDirty = false;
      }),

    // UI actions
    setActiveTab: (tab: "profile" | "password") =>
      set((state) => {
        state.activeTab = tab;
      }),

    // Validation
    isProfileFormValid: () => {
      const { profileForm } = get();
      return (
        profileForm.name.trim().length > 0 &&
        profileForm.email.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)
      );
    },

    isPasswordFormValid: () => {
      const { passwordForm } = get();
      return (
        passwordForm.currentPassword.length > 0 &&
        passwordForm.newPassword.length >= 6 &&
        passwordForm.newPassword === passwordForm.confirmPassword
      );
    },

    getPasswordStrength: (password: string) => {
      let score = 0;

      if (password.length >= 8) score += 1;
      if (password.length >= 12) score += 1;
      if (/[a-z]/.test(password)) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;

      if (score <= 2) {
        return { score, label: "Weak", color: "#ef4444" };
      } else if (score <= 4) {
        return { score, label: "Medium", color: "#f59e0b" };
      } else {
        return { score, label: "Strong", color: "#10b981" };
      }
    },

    // Utility actions
    resetProfile: () =>
      set((state) => {
        Object.assign(state, initialState);
      }),
  })),
);
