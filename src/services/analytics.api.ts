import { httpClient } from "./http-client";
import { devLog, devWarn } from "@/lib/dev-logger";

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
    sessionInternalId?: string;
    timestamp: string;
    data?: {
        visitId?: string;
        sessionInternalId?: string;
    };
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
    trackSessionBegin: async (data: {
        url: string;
        referrer: string;
        entityType?: string;
        entityId?: string;
    }): Promise<SessionStartResponse> => {
        devLog('[Analytics] Starting session:', data);

        try {
            return await httpClient<SessionStartResponse>('/api/insight/session/begin', {
                method: 'POST',
                body: JSON.stringify(data),
                requireAuth: false
            });
        } catch (error: unknown) {
            devWarn('[Analytics] Session begin error:', error);
            throw new Error(
                `Analytics API error: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    },

    /**
     * PUT /api/insight/session/:id/finish
     * → Next.js forward to: {BACKEND}/api/insight/session/:id/finish
     */
    trackSessionFinish: (visitId: string, duration: number) => {
        const url = `/api/insight/session/${visitId}/finish`;

        devLog('[Analytics] Finishing session (PUT):', { visitId, duration });

        if (typeof window !== 'undefined') {
            httpClient(url, {
                method: 'PUT',
                body: JSON.stringify({ duration }),
                keepalive: true,
                requireAuth: false
            }).catch((error) => devWarn('[Analytics] Session finish failed:', error));
        }
    },

    /**
     * POST /api/insight/behavior
     * → Next.js forward to: {BACKEND}/api/insight/behavior
     */
    trackBehavior: async (data: {
        sessionInternalId: string;
        eventType: string;
        metadata?: Record<string, unknown>;
    }) => {
        devLog('[Analytics] Tracking behavior:', data);

        try {
            await httpClient('/api/insight/behavior', {
                method: 'POST',
                body: JSON.stringify(data),
                requireAuth: false
            });
        } catch (error) {
            devWarn('[Analytics] Behavior tracking failed:', error);
        }
    }
};
