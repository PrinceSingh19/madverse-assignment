"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { api } from "@/trpc/react";
import { type Secret } from "@/stores";

interface SecretDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  secret: Secret | null;
  onSuccess?: () => void;
}

export function SecretDeleteDialog({
  open,
  onClose,
  secret,
  onSuccess,
}: SecretDeleteDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const utils = api.useUtils();

  const deleteSecretMutation = api.secret.delete.useMutation({
    onSuccess: async () => {
      await utils.secret.getMySecrets.invalidate();
      await utils.secret.getMyStats.invalidate();
      enqueueSnackbar("Secret deleted successfully!", { variant: "success" });
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      enqueueSnackbar(error.message || "Failed to delete secret", {
        variant: "error",
      });
    },
  });

  const handleDelete = () => {
    if (!secret) return;
    deleteSecretMutation.mutate({ id: secret.id });
  };

  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (!secret) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: "1px solid",
          borderColor: "error.main",
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <WarningIcon color="error" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete Secret
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            This action cannot be undone!
          </Typography>
          <Typography variant="body2">
            The secret will be permanently deleted and the link will no longer
            work.
          </Typography>
        </Alert>

        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this secret?
        </Typography>

        {/* Secret Preview */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: "background.default",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Secret Content:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              wordBreak: "break-word",
              p: 1,
              backgroundColor: "background.paper",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {truncateContent(secret.content)}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
            <Chip
              label={`Status: ${secret.status}`}
              size="small"
              color={
                secret.status === "active"
                  ? "success"
                  : secret.status === "viewed"
                    ? "info"
                    : "error"
              }
              variant="outlined"
            />
            {secret.hasPassword && (
              <Chip
                label="Password Protected"
                size="small"
                icon={<LockIcon />}
                variant="outlined"
              />
            )}
            {secret.oneTimeAccess && (
              <Chip
                label="One-time Access"
                size="small"
                icon={<VisibilityIcon />}
                color="warning"
                variant="outlined"
              />
            )}
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Created: {new Date(secret.createdAt).toLocaleString()}
          </Typography>
          {secret.expiresAt && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              Expires: {new Date(secret.expiresAt).toLocaleString()}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={deleteSecretMutation.isPending}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={deleteSecretMutation.isPending}
          startIcon={<DeleteIcon />}
          sx={{ minWidth: 120 }}
        >
          {deleteSecretMutation.isPending ? "Deleting..." : "Delete Secret"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
