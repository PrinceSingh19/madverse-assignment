import "@/styles/globals.css";

import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { TRPCReactProvider } from "@/trpc/react";
import { MuiThemeProvider } from "@/app/_components/theme-provider";

export const metadata: Metadata = {
  title: "Secret Sharing Platform",
  description: "Secure, temporary transmission of sensitive information",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <TRPCReactProvider>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <MuiThemeProvider>{children}</MuiThemeProvider>
            </AppRouterCacheProvider>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
