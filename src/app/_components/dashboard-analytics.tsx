"use client";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { type SecretStats } from "@/stores";

interface DashboardAnalyticsProps {
  stats: SecretStats | undefined;
  loading?: boolean;
}

interface AnalyticsCardProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
}

function AnalyticsCard({
  title,
  children,
  loading = false,
}: AnalyticsCardProps) {
  if (loading) {
    return (
      <Card elevation={2} sx={{ height: "100%" }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={120} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          elevation: 4,
          transform: "translateY(-2px)",
        },
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

export function DashboardAnalytics({
  stats,
  loading = false,
}: DashboardAnalyticsProps) {
  // Calculate percentages and trends
  const activePercentage = stats?.total
    ? (stats.active / stats.total) * 100
    : 0;
  const viewedPercentage = stats?.total
    ? (stats.viewed / stats.total) * 100
    : 0;
  const expiredPercentage = stats?.total
    ? (stats.expired / stats.total) * 100
    : 0;
  const oneTimePercentage = stats?.total
    ? (stats.oneTimeAccess / stats.total) * 100
    : 0;

  // Recent activity trend (simplified)
  const recentTrend =
    stats?.recentSecrets && stats?.total
      ? stats.recentSecrets > stats.total * 0.3
        ? "up"
        : "down"
      : "neutral";

  return (
    <Grid container spacing={3}>
      {/* Status Distribution */}
      <Grid size={{ xs: 12, md: 6 }}>
        <AnalyticsCard title="Secret Status Distribution" loading={loading}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Active Secrets
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {stats?.active ?? 0} ({activePercentage.toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={activePercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "success.main",
                  },
                }}
              />
            </Box>

            <Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Viewed Secrets
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {stats?.viewed ?? 0} ({viewedPercentage.toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={viewedPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "info.main",
                  },
                }}
              />
            </Box>

            <Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Expired Secrets
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {stats?.expired ?? 0} ({expiredPercentage.toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={expiredPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "error.main",
                  },
                }}
              />
            </Box>
          </Box>
        </AnalyticsCard>
      </Grid>

      {/* Security Insights */}
      <Grid size={{ xs: 12, md: 6 }}>
        <AnalyticsCard title="Security Insights" loading={loading}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                One-time Access Secrets
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SecurityIcon fontSize="small" color="action" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {stats?.oneTimeAccess ?? 0}
                </Typography>
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={oneTimePercentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "warning.main",
                },
              }}
            />

            <Typography variant="caption" color="text.secondary">
              {oneTimePercentage.toFixed(1)}% of your secrets use one-time
              access for enhanced security
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Recent Activity (30 days)
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {recentTrend === "up" ? (
                  <TrendingUpIcon fontSize="small" color="success" />
                ) : recentTrend === "down" ? (
                  <TrendingDownIcon fontSize="small" color="error" />
                ) : (
                  <ScheduleIcon fontSize="small" color="action" />
                )}
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {stats?.recentSecrets ?? 0} secrets
                </Typography>
              </Box>
            </Box>
          </Box>
        </AnalyticsCard>
      </Grid>
    </Grid>
  );
}
