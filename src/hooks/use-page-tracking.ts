"use client"

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsApi } from '@/services/analytics.api';
import { SessionStartResponse } from '@/services/analytics.api';
import { devLog, devWarn } from '@/lib/dev-logger';

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
                    
                    const skipPaths = ['/admin', '/auth'];
                    if (host.includes('admin') || skipPaths.some(p => pathname?.startsWith(p))) {
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

            const blob = new Blob([JSON.stringify({ duration })], { type: 'application/json' });
            const sent = navigator.sendBeacon(`/api/insight/session/${currentId}/finish`, blob);

            devLog(
                `%c[Analytics] sendBeacon: ${sent ? '✅' : '⚠️ không gửi được'}`,
                "color: #dc3545; font-weight: bold;"
            );

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
