"use client";
import { SnackbarProvider } from "notistack";

export function SnackbarProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
