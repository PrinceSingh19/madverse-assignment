"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Home as HomeIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as keyof typeof errorMessages;

  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: "100%",
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <ErrorIcon
              sx={{
                fontSize: 64,
                color: "error.main",
                mb: 2,
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Authentication Error
            </Typography>
          </Box>

          <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
            <Typography variant="body1">
              {errorMessage}
            </Typography>
            {error === "Configuration" && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Please contact the administrator if this problem persists.
              </Typography>
            )}
          </Alert>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              component={Link}
              href="/auth/signin"
              variant="contained"
              startIcon={<LoginIcon />}
              size="large"
            >
              Try Again
            </Button>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              startIcon={<HomeIcon />}
              size="large"
            >
              Go Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
