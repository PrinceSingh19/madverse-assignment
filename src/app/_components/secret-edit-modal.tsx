"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  Edit as EditIcon,
  Lock as LockIcon,
  Timer as TimerIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useSnackbar } from "notistack";
import { api } from "@/trpc/react";
import { type Secret, useDashboardStore } from "@/stores";

interface SecretEditModalProps {
  open: boolean;
  onClose: () => void;
  secret: Secret | null;
  onSuccess?: () => void;
}

export function SecretEditModal({
  open,
  onClose,
  secret,
  onSuccess,
}: SecretEditModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const utils = api.useUtils();

  const {
    editForm,
    setEditPassword,
    setEditOneTimeAccess,
    setEditExpiresAt,
    toggleEditPasswordVisibility,
    resetEditForm,
    populateEditForm,
  } = useDashboardStore();

  const [hasPasswordChange, setHasPasswordChange] = useState(false);
  const [editContent, setEditContent] = useState("");

  const updateSecretMutation = api.secret.update.useMutation({
    onSuccess: async () => {
      await utils.secret.getMySecrets.invalidate();
      await utils.secret.getMyStats.invalidate();
      enqueueSnackbar("Secret updated successfully!", { variant: "success" });
      handleClose();
      onSuccess?.();
    },
    onError: (error) => {
      enqueueSnackbar(error.message || "Failed to update secret", {
        variant: "error",
      });
    },
  });

  useEffect(() => {
    if (open && secret) {
      populateEditForm(secret);
      setEditContent(secret.content);
      setHasPasswordChange(false);
    }
  }, [open, secret, populateEditForm]);

  const handleClose = () => {
    resetEditForm();
    setHasPasswordChange(false);
    setEditContent("");
    onClose();
  };

  const handlePasswordChange = (value: string) => {
    setEditPassword(value);
    setHasPasswordChange(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!secret) return;

    // Prepare update data
    const updateData: {
      id: string;
      content: string;
      oneTimeAccess: boolean;
      expiresAt: Date | null;
      password?: string;
    } = {
      id: secret.id,
      content: editContent,
      oneTimeAccess: editForm.oneTimeAccess,
      expiresAt: editForm.expiresAt,
    };

    // Only include password if it was changed
    if (hasPasswordChange) {
      updateData.password = editForm.password || undefined;
    }

    updateSecretMutation.mutate(updateData);
  };

  const isFormValid = () => {
    // Content is required and must not be empty
    return editContent.trim().length > 0;
  };

  if (!secret) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            },
          },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <EditIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Edit Secret
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 3 }}>
          {/* Secret Status Info */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Chip
                label={`Status: ${secret.status}`}
                size="small"
                color={secret.status === "active" ? "success" : "default"}
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
            </Box>
          </Box>

          {secret.isViewed && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              This secret has already been viewed and cannot be modified.
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Secret Content Field */}
            <Box>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <SecurityIcon fontSize="small" />
                Secret Content
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Secret Message"
                placeholder="Enter your secret message..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                disabled={secret.isViewed || updateSecretMutation.isPending}
                required
                variant="outlined"
                helperText={
                  secret.isViewed
                    ? "Cannot edit content of viewed secrets"
                    : "This message will be encrypted and can only be viewed by the recipient"
                }
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "monospace",
                  },
                }}
              />
            </Box>

            {/* Password Field */}
            <Box>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <LockIcon fontSize="small" />
                Password Protection
              </Typography>
              <TextField
                fullWidth
                label="Password (leave empty to remove)"
                type={editForm.showPassword ? "text" : "password"}
                value={editForm.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={secret.isViewed || updateSecretMutation.isPending}
                placeholder={
                  secret.hasPassword
                    ? "Enter new password or leave empty to remove"
                    : "Enter password to protect this secret"
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleEditPasswordVisibility}
                          edge="end"
                          disabled={
                            secret.isViewed || updateSecretMutation.isPending
                          }
                        >
                          {editForm.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                helperText={
                  hasPasswordChange
                    ? editForm.password
                      ? "Password will be updated"
                      : "Password will be removed"
                    : secret.hasPassword
                      ? "Secret is currently password protected"
                      : "Secret is not password protected"
                }
              />
            </Box>

            {/* One-time Access */}
            <Box>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <SecurityIcon fontSize="small" />
                Access Control
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editForm.oneTimeAccess}
                    onChange={(e) => setEditOneTimeAccess(e.target.checked)}
                    disabled={secret.isViewed || updateSecretMutation.isPending}
                  />
                }
                label="One-time access (secret will be deleted after first view)"
              />
            </Box>

            {/* Expiration Date */}
            <Box>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <TimerIcon fontSize="small" />
                Expiration
              </Typography>
              <DateTimePicker
                label="Expiration Date & Time"
                value={editForm.expiresAt}
                onChange={(newValue) => setEditExpiresAt(newValue)}
                disabled={secret.isViewed || updateSecretMutation.isPending}
                minDateTime={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    helperText: editForm.expiresAt
                      ? "Secret will expire on the selected date"
                      : "Secret will never expire",
                  },
                  actionBar: {
                    actions: ["clear", "today"],
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={updateSecretMutation.isPending}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              secret.isViewed ||
              updateSecretMutation.isPending ||
              !isFormValid()
            }
            sx={{ minWidth: 120 }}
          >
            {updateSecretMutation.isPending ? "Updating..." : "Update Secret"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
