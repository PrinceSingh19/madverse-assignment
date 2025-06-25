"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Alert,
  LinearProgress,
  InputAdornment,
  IconButton,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { api } from "@/trpc/react";
import { useProfileStore } from "@/stores";
import { DashboardLayout } from "@/app/_components/dashboard-layout";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // Zustand store state and actions
  const {
    profileForm,
    passwordForm,
    activeTab,
    isProfileFormDirty,
    isPasswordFormDirty,
    setProfileName,
    setProfileEmail,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    toggleCurrentPasswordVisibility,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    resetProfileForm,
    resetPasswordForm,
    populateProfileForm,
    setActiveTab,
    isProfileFormValid,
    isPasswordFormValid,
    getPasswordStrength,
    resetProfile,
  } = useProfileStore();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Reset profile state on mount
  useEffect(() => {
    resetProfile();
  }, [resetProfile]);

  // Fetch user profile
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = api.auth.getProfile.useQuery(undefined, {
    enabled: !!session?.user,
    refetchOnWindowFocus: false,
  });

  // Populate form when profile data is loaded
  useEffect(() => {
    if (profileData) {
      populateProfileForm({
        name: profileData.name,
        email: profileData.email,
      });
    }
  }, [profileData, populateProfileForm]);

  // Update profile mutation
  const updateProfileMutation = api.auth.updateProfile.useMutation({
    onSuccess: async (data) => {
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
        },
      });
      await refetchProfile();
      resetProfileForm();
      populateProfileForm({
        name: data.name,
        email: data.email,
      });
      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || "Failed to update profile", {
        variant: "error",
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = api.auth.changePassword.useMutation({
    onSuccess: () => {
      resetPasswordForm();
      enqueueSnackbar("Password changed successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || "Failed to change password", {
        variant: "error",
      });
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue === 0 ? "profile" : "password");
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProfileFormValid()) return;

    updateProfileMutation.mutate({
      name: profileForm.name || undefined,
      email: profileForm.email,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordFormValid()) return;

    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  // Show loading state while checking authentication
  if (status === "loading" || profileLoading) {
    return (
      <DashboardLayout title="Profile">
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  if (profileError) {
    return (
      <DashboardLayout title="Profile">
        <Alert severity="error">
          Failed to load profile: {profileError.message}
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile Settings">
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {/* Profile Header */}
        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 80,
                height: 80,
                fontSize: "2rem",
              }}
            >
              {profileData?.email?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {profileData?.name ?? "User"}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {profileData?.email}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label={profileData?.emailVerified ? "Verified" : "Unverified"}
                  size="small"
                  color={profileData?.emailVerified ? "success" : "warning"}
                  variant="outlined"
                />
                <Chip
                  label={`Member since ${new Date(profileData?.createdAt ?? "").getFullYear()}`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Tabs */}
        <Paper elevation={2}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab === "profile" ? 0 : 1}
              onChange={handleTabChange}
              aria-label="profile tabs"
            >
              <Tab
                icon={<PersonIcon />}
                label="Profile Information"
                iconPosition="start"
              />
              <Tab
                icon={<LockIcon />}
                label="Change Password"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Profile Tab */}
          <TabPanel value={activeTab === "profile" ? 0 : 1} index={0}>
            <Box component="form" onSubmit={handleProfileSubmit} sx={{ px: 3 }}>
              <Typography variant="h6" gutterBottom>
                Update Profile Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Update your account details below
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileForm.name}
                  onChange={(e) => setProfileName(e.target.value)}
                  disabled={updateProfileMutation.isPending}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  disabled={updateProfileMutation.isPending}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                {updateProfileMutation.error && (
                  <Alert severity="error">
                    {updateProfileMutation.error.message}
                  </Alert>
                )}

                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      resetProfileForm();
                      if (profileData) {
                        populateProfileForm({
                          name: profileData.name,
                          email: profileData.email,
                        });
                      }
                    }}
                    disabled={
                      !isProfileFormDirty || updateProfileMutation.isPending
                    }
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={
                      !isProfileFormValid() ||
                      !isProfileFormDirty ||
                      updateProfileMutation.isPending
                    }
                    sx={{ minWidth: 120 }}
                  >
                    {updateProfileMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          {/* Password Tab */}
          <TabPanel value={activeTab === "profile" ? 0 : 1} index={1}>
            <Box
              component="form"
              onSubmit={handlePasswordSubmit}
              sx={{ px: 3 }}
            >
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Update your password to keep your account secure
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={passwordForm.showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={changePasswordMutation.isPending}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleCurrentPasswordVisibility}
                          edge="end"
                          disabled={changePasswordMutation.isPending}
                        >
                          {passwordForm.showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="New Password"
                  type={passwordForm.showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={changePasswordMutation.isPending}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleNewPasswordVisibility}
                          edge="end"
                          disabled={changePasswordMutation.isPending}
                        >
                          {passwordForm.showNewPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={
                    passwordForm.newPassword && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <Typography variant="caption">
                          Password strength: {passwordStrength.label}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(passwordStrength.score / 6) * 100}
                          sx={{
                            flex: 1,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: "grey.300",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: passwordStrength.color,
                            },
                          }}
                        />
                      </Box>
                    )
                  }
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={passwordForm.showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={changePasswordMutation.isPending}
                  error={
                    passwordForm.confirmPassword.length > 0 &&
                    passwordForm.newPassword !== passwordForm.confirmPassword
                  }
                  helperText={
                    passwordForm.confirmPassword.length > 0 &&
                    passwordForm.newPassword !== passwordForm.confirmPassword
                      ? "Passwords do not match"
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                          disabled={changePasswordMutation.isPending}
                        >
                          {passwordForm.showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {changePasswordMutation.error && (
                  <Alert severity="error">
                    {changePasswordMutation.error.message}
                  </Alert>
                )}

                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={resetPasswordForm}
                    disabled={
                      !isPasswordFormDirty || changePasswordMutation.isPending
                    }
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<LockIcon />}
                    disabled={
                      !isPasswordFormValid() ||
                      !isPasswordFormDirty ||
                      changePasswordMutation.isPending
                    }
                    sx={{ minWidth: 140 }}
                  >
                    {changePasswordMutation.isPending
                      ? "Changing..."
                      : "Change Password"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
