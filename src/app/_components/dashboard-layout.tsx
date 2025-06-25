"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Security as SecurityIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { signOut } from "next-auth/react";
import { useSnackbar } from "notistack";

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({
  children,
  title = "Dashboard",
}: DashboardLayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { enqueueSnackbar } = useSnackbar();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      enqueueSnackbar("You have been signed out successfully.", {
        variant: "success",
      });
      router.push("/");
    } catch {
      enqueueSnackbar("An error occurred while signing out.", {
        variant: "error",
      });
    }
    handleUserMenuClose();
  };

  const navigationItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      text: "Create Secret",
      icon: <AddIcon />,
      path: "/",
      active: pathname === "/",
    },
    {
      text: "Profile",
      icon: <PersonIcon />,
      path: "/profile",
      active: pathname === "/profile",
    },
  ];

  const drawer = (
    <Box>
      {/* Logo/Brand Section */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
          color: "white",
        }}
      >
        <SecurityIcon sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
            SecretShare
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            Secure Platform
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List sx={{ px: 2, py: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => router.push(item.path)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                backgroundColor: item.active ? "primary.main" : "transparent",
                color: item.active ? "white" : "text.primary",
                "&:hover": {
                  backgroundColor: item.active
                    ? "primary.dark"
                    : "action.hover",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: item.active ? "white" : "text.secondary",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{
                  primary: {
                    sx: { fontWeight: item.active ? 600 : 400 },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      {/* User Info Section */}
      {session?.user && (
        <Box sx={{ px: 3, py: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 40,
                height: 40,
                fontSize: "1rem",
              }}
            >
              {session.user.email?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {session.user.name ?? "User"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {session.user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: "background.paper",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 600 }}
            >
              {title}
            </Typography>
            <Chip
              label="Beta"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: "0.75rem" }}
            />
          </Box>

          {/* User Menu */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="user-menu"
            aria-haspopup="true"
            onClick={handleUserMenuOpen}
            color="inherit"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => {
                router.push("/profile");
                handleUserMenuClose();
              }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
