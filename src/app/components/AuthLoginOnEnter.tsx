"use client";

import { loginWithEnvCredentials } from "@/lib/authEnvLogin";
import { useEffect } from "react";

export function AuthLoginOnEnter({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    loginWithEnvCredentials();
  }, []);

  return <>{children}</>;
}
