"use client"

import { usePageTracking } from "@/hooks/use-page-tracking"

export function AnalyticsTracker() {
    usePageTracking();
    return null; // Component này không render UI, chỉ chạy logic tracking
}
