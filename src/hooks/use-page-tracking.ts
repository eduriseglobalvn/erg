"use client"

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsApi } from '@/services/analytics.api';

/**
 * Hook để tự động tracking page visits
 * - Gọi session/begin khi user vào trang
 * - Gọi session/finish khi user rời trang
 * - Tự động skip tracking trên Admin domain
 */
export function usePageTracking() {
    const pathname = usePathname();
    const sessionIdRef = useRef<string | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        // 1. Track Session Begin
        const trackSessionBegin = async () => {
            startTimeRef.current = Date.now();

            try {
                // Chỉ track nếu đang ở browser client
                if (typeof window !== 'undefined') {
                    // SKIP Tracking on Admin Domain
                    if (window.location.hostname.startsWith('admin')) {
                        console.log('[Tracker] Skipping admin page');
                        return;
                    }

                    const url = window.location.href;
                    const referrer = document.referrer || '';

                    console.log('[Tracker] Starting session:', { url, referrer });

                    const response = await analyticsApi.trackSessionBegin({
                        url,
                        referrer,
                    });

                    // Lưu sessionId hoặc visitId để dùng khi finish
                    // Backend có thể trả về sessionId hoặc visitId
                    const id = response?.sessionId || response?.visitId;
                    if (id) {
                        sessionIdRef.current = id;
                        console.log('[Tracker] Session started:', sessionIdRef.current);
                    }
                }
            } catch (e) {
                console.warn('[Tracker] Session begin failed:', e);
            }
        };

        // 2. Track Session Finish
        const trackSessionFinish = () => {
            if (!sessionIdRef.current) return;

            const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
            console.log('[Tracker] Finishing session:', { sessionId: sessionIdRef.current, duration });

            analyticsApi.trackSessionFinish(sessionIdRef.current, duration);
        };

        // Start tracking
        trackSessionBegin();

        // Listen for page unload
        window.addEventListener('beforeunload', trackSessionFinish);

        // Cleanup
        return () => {
            trackSessionFinish();
            window.removeEventListener('beforeunload', trackSessionFinish);
        };
    }, [pathname]);
}
