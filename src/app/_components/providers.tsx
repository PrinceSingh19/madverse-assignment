"use client";

import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { TRPCReactProvider } from "@/trpc/react";
import { MuiThemeProvider } from "@/app/_components/theme-provider";

/**
 * Client-side Providers Wrapper
 * 
 * Wraps all client-side providers that need to be used in the app.
 * This component is marked as "use client" to avoid server-side issues.
 */

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <TRPCReactProvider>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <MuiThemeProvider>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              autoHideDuration={5000}
            >
              {children}
            </SnackbarProvider>
          </MuiThemeProvider>
        </AppRouterCacheProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
