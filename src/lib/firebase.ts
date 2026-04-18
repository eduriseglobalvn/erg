/**
 * Firebase Analytics client singleton.
 * SSR-safe: only initialises in the browser environment.
 *
 * Usage:
 *   const { analytics } = await initFirebase();
 *   logEvent(analytics, 'page_view', { page_path: '/posts' });
 *
 * Environment variables required (NEXT_PUBLIC_* for client-side):
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 *   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
 */
"use client";

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics, logEvent, setUserId, setUserProperties, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ─── Singleton state ────────────────────────────────────────────────────────────

let _app: FirebaseApp | null = null;
let _analytics: Analytics | null = null;
let _initPromise: Promise<{ app: FirebaseApp; analytics: Analytics }> | null = null;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Initialise Firebase once per browser session.
 * Safe to call multiple times — returns the existing instance.
 */
export async function initFirebase(): Promise<{ app: FirebaseApp; analytics: Analytics }> {
  if (_app && _analytics) {
    return { app: _app, analytics: _analytics };
  }

  if (_initPromise) {
    return _initPromise;
  }

  _initPromise = _doInit();
  return _initPromise;
}

async function _doInit(): Promise<{ app: FirebaseApp; analytics: Analytics }> {
  if (typeof window === "undefined") {
    throw new Error("initFirebase must be called client-side only");
  }

  // Prevent duplicate init (Next.js strict mode calls useEffect twice in dev).
  if (!getApps().length) {
    _app = initializeApp(firebaseConfig);
  } else {
    _app = getApps()[0];
  }

  const supported = await isSupported();
  if (supported) {
    _analytics = getAnalytics(_app);
  }

  return { app: _app!, analytics: _analytics! };
}

/**
 * Log a Firebase Analytics event.
 * Silently no-ops if Firebase is not yet initialised.
 */
export async function fbLogEvent(
  eventName: string,
  params?: Record<string, unknown>
): Promise<void> {
  try {
    if (!_analytics) {
      await initFirebase();
    }
    if (_analytics) {
      logEvent(_analytics, eventName, params as Record<string, string | number | boolean>);
    }
  } catch {
    // Firebase may be blocked by ad blockers — swallow the error.
  }
}

/**
 * Associate the current Firebase user with a persistent user ID.
 * Call this after the user logs in.
 */
export async function fbSetUserId(userId: string): Promise<void> {
  try {
    if (!_analytics) {
      await initFirebase();
    }
    if (_analytics) {
      setUserId(_analytics, userId);
    }
  } catch {
    // Swallow errors from ad blockers.
  }
}

/**
 * Set custom user properties (e.g. subscription_tier, tenant_id).
 */
export async function fbSetUserProperties(
  properties: Record<string, string | number | boolean>
): Promise<void> {
  try {
    if (!_analytics) {
      await initFirebase();
    }
    if (_analytics) {
      setUserProperties(_analytics, properties as Record<string, string>);
    }
  } catch {
    // Swallow errors from ad blockers.
  }
}

/**
 * Returns whether Firebase Analytics has been successfully initialised.
 */
export function isFirebaseReady(): boolean {
  return _analytics !== null;
}
