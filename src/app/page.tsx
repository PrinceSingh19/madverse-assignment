import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Login as LoginIcon,
  Lock,
  Timer,
  VisibilityOff,
  Shield,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";

import { SecretForm } from "@/app/_components/secret-form";
import { SignOutButton } from "@/app/_components/sign-out-button";
import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
        {/* Hero Section */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)",
            position: "relative",
            overflow: "hidden",
            py: 10,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
              opacity: 0.3,
            },
          }}
        >
          <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ textAlign: "center", color: "white" }}>
              <SecurityIcon
                sx={{
                  fontSize: 80,
                  mb: 3,
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                }}
              />
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  mb: 2,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Share Secrets Securely
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontWeight: 400,
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  lineHeight: 1.6,
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                Send sensitive information with confidence using ephemeral
                links, automatic expiration, and view limits
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  icon={<Lock />}
                  label="No Limitations"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 500,
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
                <Chip
                  icon={<Timer />}
                  label="Auto Expiry"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 500,
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
                <Chip
                  icon={<VisibilityOff />}
                  label="Anonymous"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 500,
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          {session?.user ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* User welcome section */}
              <Paper elevation={3} sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 56, height: 56 }}
                    >
                      {session.user.email?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        color="text.primary"
                        sx={{ fontWeight: 600 }}
                      >
                        Welcome back!
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Button
                      component={Link}
                      href="/dashboard"
                      variant="outlined"
                      startIcon={<DashboardIcon />}
                      sx={{ minWidth: 140 }}
                    >
                      My Dashboard
                    </Button>
                    <SignOutButton />
                  </Box>
                </Box>
              </Paper>

              {/* Secret creation form */}
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <SecretForm />
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Paper
                elevation={8}
                sx={{
                  mx: "auto",
                  maxWidth: 480,
                  p: 6,
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                  border: "1px solid rgba(139, 92, 246, 0.1)",
                }}
              >
                <Shield
                  sx={{
                    fontSize: 64,
                    color: "primary.main",
                    mb: 3,
                    filter: "drop-shadow(0 2px 4px rgba(139, 92, 246, 0.2))",
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}
                >
                  Get Started
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 4, color: "text.secondary", lineHeight: 1.6 }}
                >
                  Sign in to create and manage your secure secrets with advanced
                  encryption and privacy controls
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    component={Link}
                    href="/auth/signin"
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<LoginIcon />}
                    sx={{ py: 1.5 }}
                  >
                    Sign In
                  </Button>
                  <Button
                    component={Link}
                    href="/auth/register"
                    variant="outlined"
                    size="large"
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Create Account
                  </Button>
                </Box>
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
    </HydrateClient>
  );
}
