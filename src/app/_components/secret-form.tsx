"use client";

import { useCallback, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Chip,
  Alert,
} from "@mui/material";
import {
  Lock as LockIcon,
  Security as SecurityIcon,
  Send as SendIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { api } from "@/trpc/react";
import { useSecretStore } from "@/stores";
import { useSnackbar } from "notistack";

// Secret creation form
export function SecretForm() {
  const utils = api.useUtils();
  const { enqueueSnackbar } = useSnackbar();

  // Zustand store state and actions
  const {
    content,
    password,
    oneTimeAccess,
    expiresAt,
    createdSecret,
    setContent,
    setPassword,
    setOneTimeAccess,
    setExpiresAt,
    setCreatedSecret,
    resetForm,
  } = useSecretStore();

  const isFormValid = useSecretStore((state) => state.isFormValid());
  const secretUrl = useSecretStore((state) => state.getSecretUrl());

  const createSecret = api.secret.create.useMutation({
    onSuccess: async (data) => {
      await utils.secret.invalidate();
      setCreatedSecret(data.id);
      resetForm();
      enqueueSnackbar(
        "Secret created successfully! Share the link with your recipient.",
        { variant: "success" },
      );
    },
    onError: (error) => {
      enqueueSnackbar(
        error.message || "Failed to create secret. Please try again.",
        { variant: "error" },
      );
    },
  });

  // Event handlers
  const copyToClipboard = useCallback(async () => {
    if (secretUrl) {
      try {
        await navigator.clipboard.writeText(secretUrl);
        enqueueSnackbar("Secret link copied to clipboard!", {
          variant: "info",
        });
      } catch {
        enqueueSnackbar("Failed to copy link. Please copy manually.", {
          variant: "error",
        });
      }
    }
  }, [secretUrl, enqueueSnackbar]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) return;

      createSecret.mutate({
        content: content,
        password: password || undefined,
        oneTimeAccess: oneTimeAccess,
        expiresAt: expiresAt ?? undefined,
      });
    },
    [createSecret, content, password, oneTimeAccess, expiresAt, isFormValid],
  );

  // Predefined expiration options - using functions to avoid hydration mismatch
  const expirationOptions = useMemo(
    () => [
      { label: "Never", key: "never", getValue: () => null },
      {
        label: "1 Hour",
        key: "1hour",
        getValue: () => new Date(Date.now() + 60 * 60 * 1000),
      },
      {
        label: "24 Hours",
        key: "24hours",
        getValue: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        label: "7 Days",
        key: "7days",
        getValue: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        label: "30 Days",
        key: "30days",
        getValue: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ],
    [],
  );

  // Helper function to get the current selected option key
  const getSelectedOptionKey = (currentExpiresAt: Date | null) => {
    if (!currentExpiresAt) return "never";

    const now = Date.now();
    const expiresTime = currentExpiresAt.getTime();
    const diff = expiresTime - now;

    // Check if it matches any of our predefined options (within 5 minutes tolerance)
    const tolerance = 5 * 60 * 1000; // 5 minutes

    if (Math.abs(diff - 60 * 60 * 1000) < tolerance) return "1hour";
    if (Math.abs(diff - 24 * 60 * 60 * 1000) < tolerance) return "24hours";
    if (Math.abs(diff - 7 * 24 * 60 * 60 * 1000) < tolerance) return "7days";
    if (Math.abs(diff - 30 * 24 * 60 * 60 * 1000) < tolerance) return "30days";

    return "custom";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 700,
          p: 6,
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid rgba(139, 92, 246, 0.1)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <SecurityIcon
            sx={{
              fontSize: 48,
              color: "primary.main",
              mb: 2,
              filter: "drop-shadow(0 2px 4px rgba(139, 92, 246, 0.2))",
            }}
          />
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
          >
            Create a Secret
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Share sensitive information securely
          </Typography>
        </Box>

        {createdSecret && secretUrl && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={copyToClipboard}>
                Copy Link
              </Button>
            }
          >
            <Typography variant="body2">
              Secret created successfully! Share this link:
            </Typography>
            <Typography
              variant="caption"
              sx={{ wordBreak: "break-all", display: "block", mt: 1 }}
            >
              {secretUrl}
            </Typography>
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Secret Message"
            placeholder="Enter your secret message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            variant="outlined"
            helperText="This message will be encrypted and can only be viewed by the recipient"
          />

          <TextField
            fullWidth
            type="password"
            label="Password Protection (Optional)"
            placeholder="Add an extra layer of security"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              },
            }}
            helperText="Recipients will need this password to view the secret"
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={oneTimeAccess}
                  onChange={(e) => setOneTimeAccess(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2">One-time access only</Typography>
                  <Chip
                    label="Recommended"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              }
            />
          </Box>

          {/* Expiration Time Section */}
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
            >
              <TimerIcon fontSize="small" />
              Expiration Time
            </Typography>

            {/* Quick Options */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {expirationOptions.map((option) => {
                const selectedKey = getSelectedOptionKey(expiresAt);
                const isSelected = selectedKey === option.key;

                return (
                  <Chip
                    key={option.key}
                    label={option.label}
                    variant={isSelected ? "filled" : "outlined"}
                    color={isSelected ? "primary" : "default"}
                    onClick={() => setExpiresAt(option.getValue())}
                    sx={{ cursor: "pointer" }}
                  />
                );
              })}
            </Box>

            {/* Custom Date/Time Picker */}
            <DateTimePicker
              label="Custom Expiration Date & Time"
              value={expiresAt}
              onChange={(newValue) => setExpiresAt(newValue)}
              minDateTime={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "medium",
                  helperText: expiresAt
                    ? `Secret will expire on ${expiresAt.toLocaleString()}`
                    : "Secret will never expire",
                },
                actionBar: {
                  actions: ["clear", "today"],
                },
              }}
            />
          </Box>

          {createSecret.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {createSecret.error.message}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={createSecret.isPending || !isFormValid}
            startIcon={<SendIcon />}
            sx={{ py: 1.5, mt: 2 }}
          >
            {createSecret.isPending ? "Creating Secret..." : "Create Secret"}
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}
