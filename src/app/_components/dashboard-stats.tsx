"use client";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  useTheme,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { type SecretStats } from "@/stores";

interface DashboardStatsProps {
  stats: SecretStats | undefined;
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

function StatCard({
  title,
  value,
  icon,
  color,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <Card elevation={2} sx={{ height: "100%" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Skeleton variant="text" width={80} height={20} />
              <Skeleton variant="text" width={60} height={40} sx={{ mt: 1 }} />
            </Box>
            <Skeleton variant="circular" width={48} height={48} />
          </Box>
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {value.toLocaleString()}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${color}15`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function DashboardStats({
  stats,
  loading = false,
}: DashboardStatsProps) {
  const theme = useTheme();

  const statCards = [
    {
      title: "Total Secrets",
      value: stats?.total ?? 0,
      icon: <SecurityIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.primary.main,
    },
    {
      title: "Active Secrets",
      value: stats?.active ?? 0,
      icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.success.main,
    },
    {
      title: "Viewed Secrets",
      value: stats?.viewed ?? 0,
      icon: <VisibilityIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.info.main,
    },
    {
      title: "Expired Secrets",
      value: stats?.expired ?? 0,
      icon: <TimerIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.error.main,
    },
    {
      title: "One-Time Access",
      value: stats?.oneTimeAccess ?? 0,
      icon: <LockIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.warning.main,
    },
    {
      title: "Recent (30 days)",
      value: stats?.recentSecrets ?? 0,
      icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.secondary.main,
    },
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={index}>
          <StatCard
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            loading={loading}
          />
        </Grid>
      ))}
    </Grid>
  );
}
