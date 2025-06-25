"use client";

import { useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useAuthStore } from "@/stores";
import { useSnackbar } from "notistack";

export default function SignIn() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // Zustand store state and actions
  const {
    signInEmail: email,
    signInPassword: password,
    signInShowPassword: showPassword,
    setSignInEmail: setEmail,
    setSignInPassword: setPassword,
    toggleSignInPasswordVisibility: togglePasswordVisibility,
    resetSignInForm: resetForm,
  } = useAuthStore();

  const isFormValid = useAuthStore((state) => state.isSignInFormValid());

  // Memoized submit handler - let NextAuth handle loading/error states
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isFormValid) return;

      try {
        const result = await signIn("credentials", {
          email: email,
          password: password,
          redirect: false,
        });

        if (result?.error) {
          enqueueSnackbar("Invalid email or password. Please try again.", {
            variant: "error",
          });
        } else {
          enqueueSnackbar(
            "Welcome back! You have been signed in successfully.",
            { variant: "success" },
          );
          resetForm();
          router.push("/");
        }
      } catch {
        enqueueSnackbar("An unexpected error occurred. Please try again.", {
          variant: "error",
        });
      }
    },
    [email, password, isFormValid, resetForm, router, enqueueSnackbar],
  );

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
            <LoginIcon
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
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Sign in to your Secret Sharing account
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              fullWidth
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

            <TextField
              fullWidth
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{ color: "text.secondary" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isFormValid}
              sx={{ py: 1.5, mt: 2 }}
            >
              Sign In
            </Button>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Don&apos;t have an account?{" "}
              <MuiLink
                component={Link}
                href="/auth/register"
                sx={{
                  color: "primary.main",
                  fontWeight: 500,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Create one here
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
