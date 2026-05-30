"use client"

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsApi } from '@/services/analytics.api';
import { SessionStartResponse } from '@/services/analytics.api';
import { devLog, devWarn } from '@/lib/dev-logger';
import {
    buildBackendApiUrl,
    getPreferredBrowserBackendBaseUrl,
    shouldUseDirectBrowserApi,
} from '@/lib/backend-url';

/**
 * Hook để tự động tracking page visits
 * - Gọi session/begin khi user vào trang
 * - Gọi session/finish khi user rời trang
 * - Tự động skip tracking trên Admin domain
 */
export function usePageTracking() {
    const pathname = usePathname();
    const visitIdRef = useRef<string | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        // 1. Track khi vào trang
        const trackSessionBegin = async () => {
            startTimeRef.current = Date.now();

            try {
                if (typeof window !== 'undefined') {
                    let entityType = 'page';
                    let entityId = pathname === '/' ? 'home' : pathname.split('/').filter(Boolean).pop() || 'home';

                    const host = window.location.hostname;
                    
                    const skipPaths = ['/cms', '/auth'];
                    if (host.includes('cms') || skipPaths.some(p => pathname?.startsWith(p))) {
                        return;
                    }

                    if (pathname === '/' && !host.includes('www') && host.split('.').length > 2) {
                        entityId = host.split('.')[0] + '-home';
                    }

                    const pathParts = pathname.split('/').filter(Boolean);
                    if (pathParts.length > 0) {
                        const first = pathParts[0];
                        if (['tin-tuc', 'posts', 'news'].includes(first)) entityType = 'post';
                        else if (['khoa-hoc', 'courses'].includes(first)) entityType = 'course';
                        else if (['danh-muc', 'category'].includes(first)) entityType = 'category';
                    }

                    devLog(
                        `%c[Analytics] 🚀 Khởi tạo phiên: ${entityType} | ${entityId}`,
                        "color: #007bff; font-weight: bold;"
                    );

                    const response: SessionStartResponse = await analyticsApi.trackSessionBegin({
                        url: window.location.href,
                        referrer: document.referrer || '',
                        entityType,
                        entityId
                    });

                    const responseRecord = response as SessionStartResponse & {
                        sessionInternalId?: string;
                        data?: {
                            visitId?: string;
                            sessionInternalId?: string;
                        };
                    };
                    const vId = responseRecord.visitId
                        || responseRecord.sessionInternalId
                        || responseRecord.data?.visitId
                        || responseRecord.data?.sessionInternalId;

                    if (vId) {
                        visitIdRef.current = vId;
                        sessionStorage.setItem('erg_visit_id', vId);
                        devLog(`%c[Analytics] ✅ Đã nhận ID: ${vId}`, "color: #28a745; font-weight: bold;");
                    } else {
                        devWarn('[Analytics] ⚠️ Không tìm thấy ID trong response BE:', response);
                    }
                }
            } catch (e) {
                devWarn('[Analytics] Session begin failed:', e);
            }
        };

        const trackSessionFinish = () => {
            const currentId = visitIdRef.current || sessionStorage.getItem('erg_visit_id');
            if (!currentId) return;

            const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

            devLog(
                `%c[Analytics] 🏁 Kết thúc phiên. ID: ${currentId} | Ở lại: ${duration}s`,
                "color: #dc3545; font-weight: bold;"
            );

            const path = `/api/insight/session/${currentId}/finish`;
            const url = shouldUseDirectBrowserApi()
                ? buildBackendApiUrl(path, getPreferredBrowserBackendBaseUrl())
                : path;
            void fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ duration }),
                credentials: 'include',
                keepalive: true,
            }).catch((error) => devWarn('[Analytics] Session finish failed:', error));

            devLog('[Analytics] Session finish request queued');

            visitIdRef.current = null;
            sessionStorage.removeItem('erg_visit_id');
        };

        trackSessionBegin();
        window.addEventListener('beforeunload', trackSessionFinish);
        return () => {
            trackSessionFinish();
            window.removeEventListener('beforeunload', trackSessionFinish);
        };
    }, [pathname]);
}
