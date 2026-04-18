"use client"

import { useEffect, useRef } from "react";
import { usePageTracking } from "@/hooks/use-page-tracking"
import { useAnalytics } from "@/hooks/use-analytics"
import { useFirebaseAnalytics } from "@/hooks/use-firebase-analytics"
import { devLog, devWarn } from "@/lib/dev-logger";

export function AnalyticsTracker() {
    usePageTracking();
    const { trackEvent: ergTrackEvent } = useAnalytics();
    const { trackClick, trackScrollDepth } = useFirebaseAnalytics();

    const maxScrollTracked = useRef<number>(0);

    // ── Scroll depth tracking (Firebase + erg-go dual-write) ──────────────────
    useEffect(() => {
        const handleScroll = () => {
            if (typeof window === "undefined") return;

            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) return;

            const scrolled = (window.scrollY / scrollHeight) * 100;
            const depth = Math.floor(scrolled / 25) * 25; // 0, 25, 50, 75, 100

            if (depth > maxScrollTracked.current && depth > 0 && depth <= 100) {
                maxScrollTracked.current = depth;
                trackScrollDepth(depth as 25 | 50 | 75 | 100);
                ergTrackEvent(`scroll_depth_${depth}`, { depth });
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [trackScrollDepth, ergTrackEvent]);

    // ── Click tracking (Firebase + erg-go dual-write) ─────────────────────────
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const trackableElement = target.closest("[data-analytics]") as HTMLElement | null;

            if (!trackableElement) return;

            const eventName = trackableElement.getAttribute("data-analytics");
            const rawMetadata = trackableElement.getAttribute("data-analytics-metadata");

            let metadata: Record<string, unknown> = {};
            if (rawMetadata) {
                try {
                    metadata = JSON.parse(rawMetadata);
                } catch {
                    devWarn("[Analytics] Failed to parse metadata:", rawMetadata);
                }
            }

            if (eventName) {
                const baseMetadata = {
                    ...metadata,
                    element: trackableElement.tagName.toLowerCase(),
                    text: trackableElement.innerText?.substring(0, 50),
                };

                // Firebase
                trackClick(eventName, baseMetadata);
                // erg-go (existing)
                ergTrackEvent(eventName, baseMetadata);

                devLog(
                    `%c[Analytics] 🎯 Click: ${eventName}`,
                    "color: #ff8c00; font-style: italic;"
                );
            }
        };

        document.addEventListener("click", handleGlobalClick);
        return () => document.removeEventListener("click", handleGlobalClick);
    }, [trackClick, ergTrackEvent]);

    return null;
}
