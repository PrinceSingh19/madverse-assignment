"use client";

import { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  ContentCopy as CopyIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { api } from "@/trpc/react";
import { useViewSecretStore } from "@/stores";

/**
 * View Secret Page
 *
 * Handles secure viewing of secrets with:
 * - Password protection
 * - One-time access logic
 * - Expiration checking
 * - Professional UI/UX
 */

export default function ViewSecret() {
  const params = useParams();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const secretId = params.id as string;

  // Zustand store state and actions
  const {
    password,
    showPassword,
    secretContent,
    isRevealed,
    isOneTimeAccess,
    setPassword,
    togglePasswordVisibility,
    setSecretContent,
    resetState,
  } = useViewSecretStore();

  // TRPC queries and mutations
  const secretQuery = api.secret.getById.useQuery(
    { id: secretId },
    {
      enabled: !!secretId,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const viewSecretMutation = api.secret.viewSecret.useMutation({
    onSuccess: (data) => {
      setSecretContent(data.content, data.isViewed);
      enqueueSnackbar(
        data.isViewed
          ? "Secret revealed! This was a one-time access secret."
          : "Secret revealed successfully!",
        { variant: "success" },
      );
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  // Handle password submission
  const handleRevealSecret = useCallback(() => {
    if (!secretId) return;

    viewSecretMutation.mutate({
      id: secretId,
      password: password || undefined,
    });
  }, [secretId, password, viewSecretMutation]);

  // Copy secret content to clipboard
  const copyToClipboard = useCallback(async () => {
    if (secretContent) {
      try {
        await navigator.clipboard.writeText(secretContent);
        enqueueSnackbar("Secret copied to clipboard!", { variant: "info" });
      } catch {
        enqueueSnackbar("Failed to copy. Please copy manually.", {
          variant: "error",
        });
      }
    }
  }, [secretContent, enqueueSnackbar]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isRevealed && !viewSecretMutation.isPending) {
        handleRevealSecret();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleRevealSecret, isRevealed, viewSecretMutation.isPending]);

  // Reset store state when component unmounts or secret ID changes
  useEffect(() => {
    return () => {
      resetState();
    };
  }, [secretId, resetState]);

  // Loading state
  if (secretQuery.isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={24}
          sx={{ p: 6, textAlign: "center", borderRadius: 3 }}
        >
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading secret...
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Error state
  if (secretQuery.error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{ p: 6, textAlign: "center", borderRadius: 3 }}
          >
            <ErrorIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom color="error">
              Secret Not Available
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {secretQuery.error.message}
            </Typography>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => router.push("/")}
              size="large"
            >
              Go Home
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const secret = secretQuery.data;
  const requiresPassword = Boolean(secret?.password) && !isRevealed;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            p: 6,
            background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid rgba(102, 126, 234, 0.1)",
            borderRadius: 3,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <LockIcon
              sx={{
                fontSize: 48,
                color: isRevealed ? "success.main" : "primary.main",
                mb: 2,
              }}
            />
            <Typography variant="h4" gutterBottom>
              {isRevealed ? "Secret Revealed" : "Secure Secret"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isRevealed
                ? "Here is your secret content"
                : requiresPassword
                  ? "Enter the password to reveal the secret"
                  : "Click the button below to reveal the secret"}
            </Typography>
          </Box>

          {/* Secret metadata */}
          {secret && (
            <Box
              sx={{
                mb: 4,
                display: "flex",
                gap: 1,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {secret.oneTimeAccess && (
                <Chip
                  icon={<WarningIcon />}
                  label="One-Time Access"
                  color="warning"
                  variant="outlined"
                />
              )}
              {secret.password && (
                <Chip
                  icon={<LockIcon />}
                  label="Password Protected"
                  color="primary"
                  variant="outlined"
                />
              )}
              {secret.expiresAt && (
                <Chip
                  label={`Expires: ${new Date(secret.expiresAt).toLocaleDateString()}`}
                  color="info"
                  variant="outlined"
                />
              )}
            </Box>
          )}

          <Divider sx={{ mb: 4 }} />

          {/* Password input or secret content */}
          {!isRevealed ? (
            <Box sx={{ maxWidth: 400, mx: "auto" }}>
              {requiresPassword && (
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the secret password"
                  variant="outlined"
                  sx={{ mb: 3 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleRevealSecret}
                disabled={
                  viewSecretMutation.isPending ||
                  Boolean(requiresPassword && !password.trim())
                }
                sx={{ py: 1.5 }}
              >
                {viewSecretMutation.isPending
                  ? "Revealing..."
                  : "Reveal Secret"}
              </Button>

              {requiresPassword && (
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
                >
                  Press Enter to reveal the secret
                </Typography>
              )}
            </Box>
          ) : (
            /* Secret content display */
            <Box>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                  mb: 3,
                  position: "relative",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontFamily: "monospace",
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                  }}
                >
                  {secretContent}
                </Typography>

                <IconButton
                  onClick={copyToClipboard}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "background.paper",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                  size="small"
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Box>

              {isOneTimeAccess && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <strong>One-Time Access:</strong> This secret has been marked
                  as viewed and is no longer accessible via this link.
                </Alert>
              )}

              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={() => router.push("/")}
                  size="large"
                >
                  Go Home
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
