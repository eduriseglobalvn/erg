"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { NEXT_AUTH_BASE_PATH } from "@/lib/next-auth";

export function NextAuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider
      basePath={NEXT_AUTH_BASE_PATH}
      session={session}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
      refetchInterval={0}
    >
      {children}
    </SessionProvider>
  );
}
