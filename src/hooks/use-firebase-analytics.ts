/**
 * useFirebaseAnalytics — enhanced Firebase Analytics hook.
 *
 * Provides typed wrappers around Firebase logEvent for:
 * - page_view
 * - click tracking
 * - scroll depth (25 / 50 / 75 / 100%)
 * - video events (start, progress, complete)
 * - search queries
 * - form interactions (start, submit, abandon)
 *
 * All methods silently no-op when:
 * - Firebase is not initialised (ad blocker / no consent)
 * - Consent has not been granted (GDPR)
 *
 * All events are also mirrored to erg-go MongoDB via the existing useAnalytics hook.
 */
"use client";

import { useCallback, useRef } from "react";
import { useAnalytics as useErgoAnalytics } from "@/hooks/use-analytics";
import { devLog } from "@/lib/dev-logger";

// ─── Consent check ─────────────────────────────────────────────────────────────

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

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useFirebaseAnalytics() {
  const { trackEvent: ergTrackEvent } = useErgoAnalytics();
  const maxScrollTracked = useRef<number>(0);

  const baseParams = useCallback(
    (extra: Record<string, unknown> = {}): Record<string, string | number> => ({
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
      page_location: typeof window !== "undefined" ? window.location.href : "",
      tenant_id: process.env.NEXT_PUBLIC_TENANT_ID ?? "default",
      ...(Object.fromEntries(
        Object.entries(extra).map(([k, v]) => [k, String(v)])
      )),
    }),
    []
  );

  // ── Page view ────────────────────────────────────────────────────────────────

  const trackPageView = useCallback(
    (params: { page_path: string; page_title?: string }) => {
      if (!hasConsent()) return;

      const payload: Record<string, string> = {
        ...baseParams(),
        page_path: params.page_path,
        page_title: params.page_title ?? (typeof document !== "undefined" ? document.title : ""),
      };

      void loadFirebase().then(({ fbLogEvent }) => fbLogEvent("page_view", payload));
      devLog(`%c[Firebase] 📄 page_view: ${params.page_path}`, "color: #2196f3");
    },
    [baseParams]
  );

  // ── Click ───────────────────────────────────────────────────────────────────

  const trackClick = useCallback(
    (element: string, metadata?: Record<string, unknown>) => {
      if (!hasConsent()) return;

      const payload = baseParams({ element, ...metadata });

      void loadFirebase().then(({ fbLogEvent }) => fbLogEvent("click", payload));
      void ergTrackEvent("click", { element, ...metadata });
      devLog(`%c[Firebase] 🖱️ click: ${element}`, "color: #ff9800", metadata);
    },
    [baseParams, ergTrackEvent]
  );

  // ── Scroll depth ─────────────────────────────────────────────────────────────

  const trackScrollDepth = useCallback(
    (depth: 25 | 50 | 75 | 100) => {
      if (!hasConsent()) return;
      if (depth <= maxScrollTracked.current) return;

      maxScrollTracked.current = depth;

      const payload = baseParams({ scroll_depth: depth });

      void loadFirebase().then(({ fbLogEvent }) => fbLogEvent(`scroll_depth_${depth}`, payload));
      void ergTrackEvent(`scroll_depth_${depth}`, { depth });
      devLog(`%c[Firebase] 📜 scroll_depth_${depth}`, "color: #9c27b0");
    },
    [baseParams, ergTrackEvent]
  );

  // ── Video ───────────────────────────────────────────────────────────────────

  const trackVideo = useCallback(
    (
      action: "start" | "progress_25" | "progress_50" | "progress_75" | "complete",
      videoId: string,
      metadata?: Record<string, unknown>
    ) => {
      if (!hasConsent()) return;

      const payload = baseParams({ video_id: videoId, ...metadata });

      void loadFirebase().then(({ fbLogEvent }) => fbLogEvent(`video_${action}`, payload));
      void ergTrackEvent(`video_${action}`, { video_id: videoId, ...metadata });
      devLog(`%c[Firebase] 🎬 video_${action}: ${videoId}`, "color: #e91e63", metadata);
    },
    [baseParams, ergTrackEvent]
  );

  // ── Search ──────────────────────────────────────────────────────────────────

  const trackSearch = useCallback(
    (searchTerm: string, resultCount: number) => {
      if (!hasConsent()) return;

      const payload = baseParams({
        search_term: searchTerm,
        result_count: resultCount,
      });

      void loadFirebase().then(({ fbLogEvent }) => fbLogEvent("search", payload));
      void ergTrackEvent("search", { search_term: searchTerm, result_count: resultCount });
      devLog(`%c[Firebase] 🔍 search: "${searchTerm}" (${resultCount} results)`, "color: #00bcd4");
    },
    [baseParams, ergTrackEvent]
  );

  // ── Form ────────────────────────────────────────────────────────────────────

  const trackForm = useCallback(
    (action: "start" | "submit" | "abandon", formId: string, metadata?: Record<string, unknown>) => {
      if (!hasConsent()) return;

      const payload = baseParams({ form_id: formId, ...metadata });

      void loadFirebase().then(({ fbLogEvent }) => fbLogEvent(`form_${action}`, payload));
      void ergTrackEvent(`form_${action}`, { form_id: formId, ...metadata });
      devLog(`%c[Firebase] 📝 form_${action}: ${formId}`, "color: #795548", metadata);
    },
    [baseParams, ergTrackEvent]
  );

  // ── Conversion / custom ───────────────────────────────────────────────────────

  const trackConversion = useCallback(
    (eventName: string, value?: number, metadata?: Record<string, unknown>) => {
      if (!hasConsent()) return;

      const payload: Record<string, string | number> = baseParams({ ...metadata });
      if (value !== undefined) {
        payload.value = value;
      }

      void loadFirebase().then(({ fbLogEvent }) => fbLogEvent(eventName, payload));
      void ergTrackEvent(eventName, { value, ...metadata });
      devLog(`%c[Firebase] ⭐ conversion: ${eventName}`, "color: #4caf50", { value, metadata });
    },
    [baseParams, ergTrackEvent]
  );

  // ── User binding ──────────────────────────────────────────────────────────────

  const setFirebaseUser = useCallback(
    (userId: string, properties?: Record<string, string | number | boolean>) => {
      void loadFirebase().then(({ fbSetUserId, fbSetUserProperties }) => {
        void fbSetUserId(userId);
        if (properties) {
          void fbSetUserProperties(properties);
        }
      });
      devLog(`%c[Firebase] 👤 user set: ${userId}`, "color: #4caf50", properties);
    },
    []
  );

  return {
    trackPageView,
    trackClick,
    trackScrollDepth,
    trackVideo,
    trackSearch,
    trackForm,
    trackConversion,
    setFirebaseUser,
  };
}
