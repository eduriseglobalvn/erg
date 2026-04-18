import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const NEXT_AUTH_BASE_PATH = "/api/auth/oauth";

const sharedRootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "erg.edu.local";
const nextAuthBaseUrl = process.env.NEXTAUTH_URL || "http://erg.edu.local:3000";
const nextAuthBaseHost = (() => {
  try {
    return new URL(nextAuthBaseUrl).hostname;
  } catch {
    return sharedRootDomain;
  }
})();
const useSecureCookies = nextAuthBaseUrl.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const sharedCookieDomain = sharedRootDomain.startsWith(".")
  ? sharedRootDomain
  : `.${sharedRootDomain}`;

type GoogleProfileShape = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
};

export const nextAuthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: sharedCookieDomain,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: sharedCookieDomain,
      },
    },
    csrfToken: {
      name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        ...(useSecureCookies ? {} : { domain: sharedCookieDomain }),
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: sharedCookieDomain,
      },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: sharedCookieDomain,
      },
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: sharedCookieDomain,
      },
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const targetUrl = new URL(url);
        const targetHost = targetUrl.hostname;
        const isAllowedHost =
          targetHost === nextAuthBaseHost ||
          targetHost === sharedRootDomain ||
          targetHost.endsWith(`.${sharedRootDomain}`);

        if (isAllowedHost) {
          return targetUrl.toString();
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile) {
        const googleProfile = profile as GoogleProfileShape;
        token.provider = "google";
        token.googleSub = typeof googleProfile.sub === "string" ? googleProfile.sub : token.sub;
        token.emailVerified = Boolean(googleProfile.email_verified);
        token.picture = typeof googleProfile.picture === "string" ? googleProfile.picture : token.picture;
        token.name = typeof googleProfile.name === "string" ? googleProfile.name : token.name;
        token.email = typeof googleProfile.email === "string" ? googleProfile.email : token.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id =
          typeof token.googleSub === "string" ? token.googleSub : token.sub;
        session.user.email = typeof token.email === "string" ? token.email : session.user.email;
        session.user.name = typeof token.name === "string" ? token.name : session.user.name;
        session.user.image = typeof token.picture === "string" ? token.picture : session.user.image;
      }

      const enrichedSession = session as typeof session & {
        provider?: string;
        googleSub?: string;
        emailVerified?: boolean;
      };

      enrichedSession.provider = typeof token.provider === "string" ? token.provider : undefined;
      enrichedSession.googleSub = typeof token.googleSub === "string" ? token.googleSub : undefined;
      enrichedSession.emailVerified = Boolean(token.emailVerified);

      return session;
    },
  },
};
