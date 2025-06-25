"use client";

import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Skeleton,
  Grid,
} from "@mui/material";
import { Security as SecurityIcon } from "@mui/icons-material";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

export function LoadingSpinner({
  message = "Loading...",
  size = "medium",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinnerSize = size === "small" ? 24 : size === "large" ? 64 : 40;

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 4,
      }}
    >
      <CircularProgress size={spinnerSize} thickness={4} />
      <Typography
        variant={size === "large" ? "h6" : "body2"}
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {message}
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 9999,
        }}
      >
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <SecurityIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              SecretShare
            </Typography>
          </Box>
          {content}
        </Paper>
      </Box>
    );
  }

  return content;
}

// Dashboard loading skeleton
export function DashboardSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Stats skeleton */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[...Array(6)].map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={index}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Skeleton variant="text" width={80} height={20} />
                  <Skeleton variant="text" width={60} height={40} />
                </Box>
                <Skeleton variant="circular" width={48} height={48} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Filters skeleton */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Skeleton variant="rectangular" width={300} height={40} />
          <Skeleton variant="rectangular" width={140} height={40} />
          <Skeleton variant="rectangular" width={160} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </Box>
      </Paper>

      {/* Table skeleton */}
      <Paper elevation={2}>
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="100%" height={40} />
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2, py: 2 }}>
              <Skeleton variant="text" width="30%" height={24} />
              <Skeleton variant="rectangular" width={80} height={24} />
              <Skeleton variant="text" width="20%" height={24} />
              <Skeleton variant="text" width="20%" height={24} />
              <Skeleton variant="text" width="10%" height={24} />
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

// Profile loading skeleton
export function ProfileSkeleton() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* Profile header skeleton */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Box>
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={250} height={24} />
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Skeleton variant="rectangular" width={80} height={24} />
              <Skeleton variant="rectangular" width={120} height={24} />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Tabs skeleton */}
      <Paper elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
          <Box sx={{ display: "flex", gap: 4, py: 2 }}>
            <Skeleton variant="text" width={150} height={32} />
            <Skeleton variant="text" width={150} height={32} />
          </Box>
        </Box>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width={250} height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={400} height={20} sx={{ mb: 3 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Skeleton variant="rectangular" width={80} height={40} />
              <Skeleton variant="rectangular" width={120} height={40} />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
