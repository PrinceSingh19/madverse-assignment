"use client";

import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Container,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper
            elevation={4}
            sx={{
              p: 6,
              textAlign: "center",
              border: "1px solid",
              borderColor: "error.main",
            }}
          >
            <ErrorIcon sx={{ fontSize: 64, color: "error.main", mb: 3 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              We encountered an unexpected error. Please try refreshing the page
              or contact support if the problem persists.
            </Typography>

            {this.state.error && (
              <Alert severity="error" sx={{ mb: 4, textAlign: "left" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Error Details:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "monospace", wordBreak: "break-word" }}
                >
                  {this.state.error.message}
                </Typography>
              </Alert>
            )}

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.resetError}
                size="large"
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={() => (window.location.href = "/")}
                size="large"
              >
                Go Home
              </Button>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>
  );
}

// Custom fallback component for dashboard errors
export function DashboardErrorFallback({
  error,
  resetError,
}: {
  error?: Error;
  resetError: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        p: 4,
      }}
    >
      <ErrorIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Dashboard Error
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {error?.message ?? "An error occurred while loading the dashboard"}
      </Typography>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={resetError}
      >
        Retry
      </Button>
    </Box>
  );
}
