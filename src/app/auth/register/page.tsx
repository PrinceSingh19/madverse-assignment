"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { api } from "@/trpc/react";
import { useAuthStore } from "@/stores";
import { useSnackbar } from "notistack";

export default function Register() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // Zustand store state and actions
  const registerState = useAuthStore((state) => state.register);
  const registerActions = useAuthStore((state) => state.registerActions);
  const isFormValid = useAuthStore((state) =>
    state.computed.isRegisterFormValid(),
  );
  const getPasswordStrength = useAuthStore(
    (state) => state.computed.getPasswordStrength,
  );

  const registerMutation = api.auth.register.useMutation({
    onSuccess: () => {
      registerActions.resetForm();
      enqueueSnackbar(
        "Account created successfully! Please sign in with your new credentials.",
        { variant: "success" },
      );
      router.push("/auth/signin");
    },
    onError: (error) => {
      enqueueSnackbar(
        error.message || "Failed to create account. Please try again.",
        { variant: "error" },
      );
    },
  });

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isFormValid) return;

      if (registerState.password.length < 6) {
        enqueueSnackbar("Password must be at least 6 characters long", {
          variant: "error",
        });
        return;
      }

      registerMutation.mutate({
        email: registerState.email,
        password: registerState.password,
        name: registerState.name || undefined,
      });
    },
    [
      registerState.email,
      registerState.password,
      registerState.name,
      isFormValid,
      registerMutation,
      enqueueSnackbar,
    ],
  );

  // Get password strength from Zustand store
  const passwordStrength = getPasswordStrength(registerState.password);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 6,
            background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid rgba(139, 92, 246, 0.1)",
            borderRadius: 3,
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <PersonAddIcon
              sx={{
                fontSize: 64,
                color: "primary.main",
                mb: 2,
                filter: "drop-shadow(0 2px 4px rgba(139, 92, 246, 0.2))",
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
            >
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Join the Secret Sharing Platform
            </Typography>
          </Box>

          {registerMutation.error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {registerMutation.error.message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              fullWidth
              id="name"
              label="Full Name (Optional)"
              type="text"
              value={registerState.name}
              onChange={(e) => registerActions.setName(e.target.value)}
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                },
              }}
              placeholder="Enter your full name"
            />

            <TextField
              fullWidth
              id="email"
              label="Email Address"
              type="email"
              value={registerState.email}
              onChange={(e) => registerActions.setEmail(e.target.value)}
              required
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                },
              }}
              placeholder="Enter your email address"
            />

            <Box>
              <TextField
                fullWidth
                id="password"
                label="Password"
                type={registerState.showPassword ? "text" : "password"}
                value={registerState.password}
                onChange={(e) => registerActions.setPassword(e.target.value)}
                required
                variant="outlined"
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
                          onClick={registerActions.togglePasswordVisibility}
                          edge="end"
                          sx={{ color: "text.secondary" }}
                        >
                          {registerState.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                placeholder="Enter your password (min 6 characters)"
                helperText="Password must be at least 6 characters long"
              />

              {registerState.password && (
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      Password Strength
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {passwordStrength.label}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.strength}
                    sx={{ height: 8, borderRadius: 1 }}
                    color={
                      passwordStrength.strength < 50
                        ? "error"
                        : passwordStrength.strength < 75
                          ? "warning"
                          : "success"
                    }
                  />
                </Box>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={registerMutation.isPending || !isFormValid}
              sx={{ py: 1.5, mt: 2 }}
            >
              {registerMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Already have an account?{" "}
              <MuiLink
                component={Link}
                href="/auth/signin"
                sx={{
                  color: "primary.main",
                  fontWeight: 500,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign in here
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
