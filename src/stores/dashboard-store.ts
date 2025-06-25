import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// Types for secret data from API
export type SecretStatus = "active" | "viewed" | "expired";
export type SortBy = "createdAt" | "expiresAt";
export type SortOrder = "asc" | "desc";

export interface Secret {
  id: string;
  content: string;
  oneTimeAccess: boolean;
  expiresAt: Date | null;
  isViewed: boolean;
  viewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  hasPassword: boolean;
  status: SecretStatus;
  isExpired: boolean;
}

export interface SecretStats {
  total: number;
  active: number;
  viewed: number;
  expired: number;
  oneTimeAccess: number;
  recentSecrets: number;
}

type State = {
  // Search state
  searchQuery: string;

  // Pagination state
  currentPage: number;
  itemsPerPage: number;

  // UI state
  selectedSecretId: string | null;
  isEditModalOpen: boolean;
  isDeleteDialogOpen: boolean;

  // Edit form state
  editForm: {
    password: string;
    oneTimeAccess: boolean;
    expiresAt: Date | null;
    showPassword: boolean;
  };
};

type Actions = {
  // Search actions
  setSearchQuery: (query: string) => void;

  // Pagination actions
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  resetPagination: () => void;

  // UI actions
  setSelectedSecretId: (id: string | null) => void;
  openEditModal: (secretId: string) => void;
  closeEditModal: () => void;
  openDeleteDialog: (secretId: string) => void;
  closeDeleteDialog: () => void;

  // Edit form actions
  setEditPassword: (password: string) => void;
  setEditOneTimeAccess: (oneTime: boolean) => void;
  setEditExpiresAt: (date: Date | null) => void;
  toggleEditPasswordVisibility: () => void;
  resetEditForm: () => void;
  populateEditForm: (secret: Secret) => void;

  // Utility actions
  resetDashboard: () => void;
};

const initialState: State = {
  // Search state
  searchQuery: "",

  // Pagination state
  currentPage: 1,
  itemsPerPage: 10,

  // UI state
  selectedSecretId: null,
  isEditModalOpen: false,
  isDeleteDialogOpen: false,

  // Edit form state
  editForm: {
    password: "",
    oneTimeAccess: false,
    expiresAt: null,
    showPassword: false,
  },
};

export const useDashboardStore = create<State & Actions>()(
  immer((set, _get) => ({
    ...initialState,

    // Search and filter actions
    setSearchQuery: (query: string) =>
      set((state) => {
        state.searchQuery = query;
        state.currentPage = 1; // Reset to first page when searching
      }),

    // Pagination actions
    setCurrentPage: (page: number) =>
      set((state) => {
        state.currentPage = page;
      }),

    setItemsPerPage: (items: number) =>
      set((state) => {
        state.itemsPerPage = items;
        state.currentPage = 1; // Reset to first page when changing items per page
      }),

    resetPagination: () =>
      set((state) => {
        state.currentPage = 1;
      }),

    // UI actions
    setSelectedSecretId: (id: string | null) =>
      set((state) => {
        state.selectedSecretId = id;
      }),

    openEditModal: (secretId: string) =>
      set((state) => {
        state.selectedSecretId = secretId;
        state.isEditModalOpen = true;
      }),

    closeEditModal: () =>
      set((state) => {
        state.isEditModalOpen = false;
        state.selectedSecretId = null;
      }),

    openDeleteDialog: (secretId: string) =>
      set((state) => {
        state.selectedSecretId = secretId;
        state.isDeleteDialogOpen = true;
      }),

    closeDeleteDialog: () =>
      set((state) => {
        state.isDeleteDialogOpen = false;
        state.selectedSecretId = null;
      }),

    // Edit form actions
    setEditPassword: (password: string) =>
      set((state) => {
        state.editForm.password = password;
      }),

    setEditOneTimeAccess: (oneTime: boolean) =>
      set((state) => {
        state.editForm.oneTimeAccess = oneTime;
      }),

    setEditExpiresAt: (date: Date | null) =>
      set((state) => {
        state.editForm.expiresAt = date;
      }),

    toggleEditPasswordVisibility: () =>
      set((state) => {
        state.editForm.showPassword = !state.editForm.showPassword;
      }),

    resetEditForm: () =>
      set((state) => {
        state.editForm = {
          password: "",
          oneTimeAccess: false,
          expiresAt: null,
          showPassword: false,
        };
      }),

    populateEditForm: (secret: Secret) =>
      set((state) => {
        state.editForm = {
          password: "", // Don't populate password for security
          oneTimeAccess: secret.oneTimeAccess,
          expiresAt: secret.expiresAt,
          showPassword: false,
        };
      }),

    // Utility actions
    resetDashboard: () =>
      set((state) => {
        Object.assign(state, initialState);
      }),
  })),
);
