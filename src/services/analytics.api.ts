import { httpClient } from "./http-client";

// ========== Type Definitions ==========

export interface VisitorStat {
    date: string;
    desktop: number;
    mobile: number;
}

export interface VisitorStatsResponse {
    statusCode: number;
    message: string;
    data: VisitorStat[];
}

export interface DashboardOverview {
    totalUsers?: number;
    totalPosts?: number;
    totalVisits?: number;
    totalPageViews?: number;
    [key: string]: any;
}

export interface SessionStartResponse {
    sessionId?: string;
    visitId?: string;
    timestamp: string;
}

export interface PostSummaryResponse {
    statusCode: number;
    data: {
        monthlyStats: {
            month: string;
            posts: number;
            views: number;
        }[];
        categoryDistribution: {
            category: string;
            count: number;
        }[];
        overview: {
            totalPosts: number;
            publishedPosts: number;
            draftPosts: number;
        };
    };
}

// ========== Analytics API ==========

/**
 * QUAN TRỌNG: Tất cả requests đều gọi qua /api/* 
 * Next.js sẽ tự động forward sang Backend qua rewrites
 * → Request trở thành SAME-ORIGIN → Bypass AdBlock 100%!
 */
export const analyticsApi = {
    // ========== ADMIN DASHBOARD APIs ==========

    /**
     * GET /api/insight/overview - Dashboard tổng quan
     * → Next.js forward to: {BACKEND}/api/insight/overview
     */
    getOverview: (from?: string, to?: string) => {
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);

        const queryString = params.toString();
        return httpClient<DashboardOverview>(
            `/api/insight/overview${queryString ? `?${queryString}` : ''}`
        );
    },

    /**
     * GET /api/insight/stats - Traffic chart data
     * → Next.js forward to: {BACKEND}/api/insight/stats
     */
    getStats: (range: string = "7d") => {
        return httpClient<VisitorStatsResponse>(`/api/insight/stats?range=${range}`);
    },

    /**
     * GET /api/insight/posts/summary - Post analytics summary
     */
    getPostSummary: (range: string = "90d") => {
        return httpClient<PostSummaryResponse>(`/api/insight/posts/summary?range=${range}`);
    },

    // ========== USER TRACKING APIs (Public - Bypass AdBlock) ==========

    /**
     * POST /api/insight/session/begin
     * → Next.js forward to: {BACKEND}/api/insight/session/begin
     */
    trackSessionBegin: async (data: { url: string; referrer: string }): Promise<SessionStartResponse> => {
        console.log('[Analytics] Starting session:', data);

        const response = await fetch('/api/insight/session/begin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('[Analytics] Session begin error:', errorData);
            throw new Error(`Analytics API error: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * PUT /api/insight/session/:id/finish
     * → Next.js forward to: {BACKEND}/api/insight/session/:id/finish
     */
    trackSessionFinish: (sessionId: string, duration: number) => {
        const url = `/api/insight/session/${sessionId}/finish`;
        const blob = new Blob([JSON.stringify({ duration })], { type: 'application/json' });

        console.log('[Analytics] Finishing session:', { sessionId, duration });

        // Sử dụng sendBeacon để đảm bảo request được gửi ngay cả khi user đóng tab
        if (navigator.sendBeacon) {
            navigator.sendBeacon(url, blob);
        } else {
            // Fallback cho browser không hỗ trợ sendBeacon
            fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ duration }),
                keepalive: true
            }).catch(console.error);
        }
    },

    /**
     * POST /api/insight/behavior
     * → Next.js forward to: {BACKEND}/api/insight/behavior
     */
    trackBehavior: async (data: {
        sessionId?: string;
        eventType: string;
        eventData?: Record<string, any>;
    }) => {
        console.log('[Analytics] Tracking behavior:', data);

        try {
            const response = await fetch('/api/insight/behavior', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                console.error('[Analytics] Behavior tracking error:', await response.text());
            }
        } catch (error) {
            console.error('[Analytics] Behavior tracking failed:', error);
        }
    }
};
