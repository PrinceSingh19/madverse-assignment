"use client";

import { signOut } from "next-auth/react";
import { Button } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";

export function SignOutButton() {
  return (
    <Button
      onClick={() => signOut()}
      variant="outlined"
      color="error"
      startIcon={<LogoutIcon />}
      className="border-red-500 text-red-400 hover:bg-red-500/10"
    >
      Sign Out
    </Button>
  );
}
