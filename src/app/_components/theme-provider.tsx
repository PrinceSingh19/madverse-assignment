"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8b5cf6",
      light: "#a78bfa",
      dark: "#7c3aed",
    },
    secondary: {
      main: "#ec4899",
      light: "#f472b6",
      dark: "#db2777",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
    error: {
      main: "#ef4444",
    },
    success: {
      main: "#10b981",
    },
    info: {
      main: "#3b82f6",
    },
  },
  typography: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "12px",
          padding: "12px 24px",
        },
        contained: {
          background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
          boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)",
            boxShadow: "0 6px 20px 0 rgba(139, 92, 246, 0.4)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(139, 92, 246, 0.1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          fontWeight: 500,
        },
        outlined: {
          borderColor: "rgba(139, 92, 246, 0.3)",
          color: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.05)",
        },
      },
    },
  },
});

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
