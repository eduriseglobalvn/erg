/**
 * FirebaseAnalyticsProvider — wraps the app and initialises Firebase Analytics.
 *
 * Responsibilities:
 * 1. Initialise Firebase ONLY after user grants GDPR consent.
 * 2. Set Firebase user_id on login (via erg's custom useAuth hook).
 * 3. Track every page_view automatically (after consent).
 *
 * The ConsentBanner component triggers Firebase init via localStorage.
 * This provider watches for consent changes and re-initialises Firebase.
 *
 * Usage: added inside QueryProvider in query-provider.tsx.
 */
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { devLog } from "@/lib/dev-logger";
import { readCookie } from "@/lib/client-session";

const CONSENT_KEY = "analytics_consent";
type FirebaseModule = typeof import("@/lib/firebase");

let firebaseModulePromise: Promise<FirebaseModule> | null = null;

function loadFirebase() {
  firebaseModulePromise ??= import("@/lib/firebase");
  return firebaseModulePromise;
}

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "accepted";
}

async function activateFirebase(userId?: string): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const { initFirebase, fbLogEvent, fbSetUserId, fbSetUserProperties } = await loadFirebase();
    const { analytics } = await initFirebase();
    if (!analytics) {
      devLog("%c[Firebase] ⚠️ Analytics not supported in this browser", "color: #999");
      return;
    }
    devLog("%c[Firebase] ✅ Activated (consent granted)", "color: #4caf50");

    if (userId) {
      void fbSetUserId(userId);
      void fbSetUserProperties({
        user_type: "authenticated",
        tenant_id: process.env.NEXT_PUBLIC_TENANT_ID ?? "default",
      });
    }

    // Track current page
    void fbLogEvent("page_view", {
      page_path: window.location.pathname,
      page_location: window.location.href,
      page_title: document.title,
      tenant_id: process.env.NEXT_PUBLIC_TENANT_ID ?? "default",
    });
  } catch (err) {
    devLog(`%c[Firebase] ❌ Activation failed: ${err}`, "color: #f44336");
  }
}

export function FirebaseAnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = readCookie("clientUserId") || undefined;

  // ── 1. Activate Firebase on mount IF consent already granted ─────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasConsent()) return;

    void activateFirebase(userId);
  }, [userId]);

  // ── 2. Sync user ID when auth state changes (login / logout) ────────────────
  useEffect(() => {
    if (!hasConsent()) return;

    void loadFirebase().then(({ isFirebaseReady, fbSetUserId, fbSetUserProperties }) => {
      if (!isFirebaseReady() || !userId) return;

      void fbSetUserId(userId);
      void fbSetUserProperties({ user_type: "authenticated" });
    });
  }, [userId]);

  // ── 3. Auto page_view on every route change ──────────────────────────────────
  useEffect(() => {
    if (!hasConsent()) return;

    const search = searchParams?.toString();
    const pagePath = search ? `${pathname}?${search}` : pathname;

    void loadFirebase().then(({ isFirebaseReady, fbLogEvent }) => {
      if (!isFirebaseReady()) return;

      void fbLogEvent("page_view", {
        page_path: pagePath,
        page_location: window.location.href,
        page_title: document.title,
        tenant_id: process.env.NEXT_PUBLIC_TENANT_ID ?? "default",
      });
    });
  }, [pathname, searchParams]);

  return <>{children}</>;
}
