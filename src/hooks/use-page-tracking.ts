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
    const visitIdRef = useRef<string | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        // 1. Track khi vào trang
        const trackSessionBegin = async () => {
            startTimeRef.current = Date.now();

            try {
                if (typeof window !== 'undefined') {
                    // --- PHÂN TÍCH ENTITY ---
                    let entityType = 'page';
                    let entityId = pathname === '/' ? 'home' : pathname.split('/').filter(Boolean).pop() || 'home';

                    const host = window.location.hostname;
                    
                    // Tự động skip tracking trên Admin domain hoặc hệ thống nội bộ
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

                    if (process.env.NODE_ENV === 'development') {
                        console.log(`%c[Analytics] 🚀 Khởi tạo phiên: ${entityType} | ${entityId}`, "color: #007bff; font-weight: bold;");
                    }

                    const response: any = await analyticsApi.trackSessionBegin({
                        url: window.location.href,
                        referrer: document.referrer || '',
                        entityType,
                        entityId
                    });

                    // CỐ GẮNG LẤY ID LINH HOẠT (phẳng hoặc lồng trong data)
                    const vId = response?.visitId || response?.sessionInternalId ||
                        response?.data?.visitId || response?.data?.sessionInternalId;

                    if (vId) {
                        visitIdRef.current = vId;
                        sessionStorage.setItem('erg_visit_id', vId);
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`%c[Analytics] ✅ Đã nhận ID: ${vId}`, "color: #28a745; font-weight: bold;");
                        }
                    } else {
                        console.warn('[Analytics] ⚠️ Không tìm thấy ID trong response BE:', response);
                    }
                }
            } catch (e) {
                console.warn('[Analytics] Session begin failed:', e);
            }
        };

        const trackSessionFinish = () => {
            const currentId = visitIdRef.current || sessionStorage.getItem('erg_visit_id');
            if (!currentId) return;

            const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

            if (process.env.NODE_ENV === 'development') {
                console.log(`%c[Analytics] 🏁 Kết thúc phiên. ID: ${currentId} | Ở lại: ${duration}s`, "color: #dc3545; font-weight: bold;");
            }

            // ✅ Dùng sendBeacon để đảm bảo gửi được khi đóng tab/trình duyệt
            const blob = new Blob([JSON.stringify({ duration })], { type: 'application/json' });
            const sent = navigator.sendBeacon(`/api/insight/session/${currentId}/finish`, blob);

            if (process.env.NODE_ENV === 'development') {
                console.log(`%c[Analytics] sendBeacon: ${sent ? '✅' : '⚠️ không gửi được'}`, "color: #dc3545; font-weight: bold;");
            }

            // Chỉ xóa sau khi finish thành công
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
