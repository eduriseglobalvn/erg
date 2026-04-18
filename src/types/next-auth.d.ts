import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    provider?: string;
    googleSub?: string;
    emailVerified?: boolean;
    user?: DefaultSession["user"] & {
      id?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    googleSub?: string;
    emailVerified?: boolean;
  }
}
