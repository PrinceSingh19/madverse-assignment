"use client";

import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Fab,
  Alert,
  Tooltip,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { api } from "@/trpc/react";

// Import dashboard components
import { DashboardLayout } from "@/app/_components/dashboard-layout";
import { SecretEditModal } from "@/app/_components/secret-edit-modal";
import { SecretDeleteDialog } from "@/app/_components/secret-delete-dialog";
import { ErrorBoundary } from "@/app/_components/error-boundary";
import { DashboardStats } from "@/app/_components/dashboard-stats";
import { DashboardAnalytics } from "@/app/_components/dashboard-analytics";
import { SecretsSearch } from "@/app/_components/secrets-search";
import { SecretsTable } from "@/app/_components/secrets-table";
import { useDashboardStore, type Secret } from "@/stores";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // Zustand store state and actions
  const {
    searchQuery,
    currentPage,
    itemsPerPage,
    selectedSecretId,
    isEditModalOpen,
    isDeleteDialogOpen,
    setSearchQuery,
    setCurrentPage,
    openEditModal,
    closeEditModal,
    openDeleteDialog,
    closeDeleteDialog,
    resetDashboard,
  } = useDashboardStore();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Reset dashboard state on mount
  useEffect(() => {
    resetDashboard();
  }, [resetDashboard]);

  // Calculate pagination offset
  const offset = (currentPage - 1) * itemsPerPage;

  // Fetch secrets with search and pagination
  const {
    data: secretsData,
    isLoading: secretsLoading,
    error: secretsError,
    refetch: refetchSecrets,
  } = api.secret.getMySecrets.useQuery(
    {
      search: searchQuery || undefined,
      limit: itemsPerPage,
      offset,
    },
    {
      enabled: !!session?.user,
      refetchOnWindowFocus: false,
    },
  );

  // Fetch user statistics
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = api.secret.getMyStats.useQuery(undefined, {
    enabled: !!session?.user,
    refetchOnWindowFocus: false,
  });

  // Find selected secret for modals
  const selectedSecret = useMemo(() => {
    if (!selectedSecretId || !secretsData?.secrets) return null;
    return secretsData.secrets.find((s) => s.id === selectedSecretId) ?? null;
  }, [selectedSecretId, secretsData?.secrets]);

  // Handle pagination
  const totalPages = Math.ceil((secretsData?.total ?? 0) / itemsPerPage);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  // Handle secret actions
  const handleEditSecret = (secret: Secret) => {
    openEditModal(secret.id);
  };

  const handleDeleteSecret = (secret: Secret) => {
    openDeleteDialog(secret.id);
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchSecrets(), refetchStats()]);
      enqueueSnackbar("Dashboard refreshed successfully!", {
        variant: "success",
      });
    } catch {
      enqueueSnackbar("Failed to refresh dashboard", { variant: "error" });
    }
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Don't render if not authenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <DashboardLayout title="My Secrets Dashboard">
      <ErrorBoundary>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Statistics */}
          <DashboardStats stats={statsData} loading={statsLoading} />

          {/* Analytics */}
          <DashboardAnalytics
            stats={statsData}
            loading={statsLoading || secretsLoading}
          />

          {/* Search */}
          <SecretsSearch onSearch={setSearchQuery} searchQuery={searchQuery} />

          {/* Error State */}
          {secretsError && (
            <Alert
              severity="error"
              action={
                <Tooltip title="Refresh">
                  <RefreshIcon
                    onClick={handleRefresh}
                    sx={{ cursor: "pointer" }}
                  />
                </Tooltip>
              }
            >
              Failed to load secrets: {secretsError.message}
            </Alert>
          )}

          {/* Secrets Table */}
          <SecretsTable
            secrets={(secretsData?.secrets ?? []) as Secret[]}
            loading={secretsLoading}
            onEdit={handleEditSecret}
            onDelete={handleDeleteSecret}
          />

          {/* Pagination */}
          {secretsData && secretsData.total > itemsPerPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Paper>
            </Box>
          )}

          {/* Empty State Message */}
          {!secretsLoading && secretsData?.secrets?.length === 0 && (
            <Paper elevation={2} sx={{ p: 6, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchQuery
                  ? "No secrets match your search"
                  : "No secrets created yet"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Create your first secret to get started"}
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="create secret"
          onClick={() => router.push("/")}
          sx={{
            position: "fixed",
            bottom: 24,
            left: 24,
            zIndex: 2000,
          }}
        >
          <AddIcon />
        </Fab>

        {/* Modals */}
        <SecretEditModal
          open={isEditModalOpen}
          onClose={closeEditModal}
          secret={selectedSecret as Secret | null}
          onSuccess={() => {
            void refetchSecrets();
            void refetchStats();
          }}
        />

        <SecretDeleteDialog
          open={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          secret={selectedSecret as Secret | null}
          onSuccess={() => {
            void refetchSecrets();
            void refetchStats();
          }}
        />
      </ErrorBoundary>
    </DashboardLayout>
  );
}
