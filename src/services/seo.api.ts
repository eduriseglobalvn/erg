import { httpClient } from './http-client';
import {
    SeoHealth,
    SeoAnalysis,
    SeoKeyword,
    GscData,
    SeoSchema,
    SeoTrendData,
    SeoRedirect,
    Seo404Log,
    SeoRobots,
    SeoDuplicateResult,
    SeoAuthUrl,
    SeoPerformance,
    SeoQueryPerformance,
    SeoAnalysisDraftResult
} from '@/types/seo';

/**
 * SEO API Service
 */
export const seoApi = {
    // --- PHASE 0: CORE ANALYSIS ---

    /**
     * Get overall SEO health metrics
     */
    getHealth: () => httpClient<SeoHealth>('/seo/health'),

    /**
     * Analyze SEO for a specific post
     */
    analyzePost: (postId: string) => httpClient<SeoAnalysis>(`/seo/analyze/${postId}`),

    /**
     * Analyze content in real-time (Draft)
     */
    analyzeDraft: (data: { title: string, content: string, focusKeyword?: string }) =>
        httpClient<SeoAnalysisDraftResult>('/seo/analyze-draft', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    /**
     * Get site-wide SEO performance (GSC)
     */
    getPerformance: (period: string = 'month') =>
        httpClient<SeoPerformance>(`/seo/performance?period=${period}`),

    /**
     * Get top keyword queries performance
     */
    getQueryPerformance: (limit: number = 15) =>
        httpClient<SeoQueryPerformance[]>(`/seo/performance/queries?limit=${limit}`),

    /**
     * Get SEO score trends for a post
     */
    getTrends: (postId: string, days: number = 30) =>
        httpClient<SeoTrendData[]>(`/seo/trends/${postId}?days=${days}`),

    /**
     * Get Google Search Console data for a post
     */
    getGSCData: (postId: string, days: number = 30) =>
        httpClient<GscData>(`/seo/gsc/${postId}?days=${days}`),

    /**
     * Get top performing posts by SEO/Traffic
     */
    getTopPosts: (limit: number = 50, days: number = 30) =>
        httpClient<any[]>(`/seo/top-posts?limit=${limit}&days=${days}`),

    /**
     * Sync data from Google Search Console
     */
    syncGSC: (days: number = 7) =>
        httpClient('/seo/gsc/sync', {
            method: 'POST',
            body: JSON.stringify({ days })
        }),

    // --- PHASE 1: AUTO-LINKING ---

    /**
     * Keyword Management (CRUD)
     */
    getKeywords: () => httpClient<SeoKeyword[]>('/seo/keywords'),

    createKeyword: (data: Omit<SeoKeyword, 'id'>) =>
        httpClient<SeoKeyword>('/seo/keywords', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    deleteKeyword: (id: string) =>
        httpClient(`/seo/keywords/${id}`, { method: 'DELETE' }),

    /**
     * Apply rules
     */
    applyAutolinks: (postId: string) =>
        httpClient(`/seo/apply-autolinks/${postId}`, { method: 'PUT' }),

    applyAutolinksBulk: (postIds?: string[]) =>
        httpClient('/seo/apply-autolinks/bulk', {
            method: 'PUT',
            body: JSON.stringify({ postIds })
        }),

    // --- PHASE 2: CUSTOM SCHEMA ---

    /**
     * Save custom schema for a post (FAQ, Video, Course, etc.)
     */
    saveSchema: (postId: string, schema: { type: string, data: any }) =>
        httpClient(`/seo/schema/${postId}`, {
            method: 'POST',
            body: JSON.stringify(schema)
        }),

    getSchema: (postId: string) => httpClient<SeoSchema>(`/seo/schema/${postId}`),

    // --- PHASE 3: GSC OAUTH ---

    /**
     * Get Google Auth URL
     */
    getGscAuthUrl: () => httpClient<SeoAuthUrl>('/seo/gsc/auth/url'),

    /**
     * Handle OAuth callback
     */
    callbackGsc: (code: string) =>
        httpClient('/seo/gsc/auth/callback', {
            method: 'POST',
            body: JSON.stringify({ code })
        }),

    // --- PHASE 4: TECHNICAL SEO ---

    /**
     * Redirects Management
     */
    getRedirects: () => httpClient<SeoRedirect[]>('/seo/redirects'),

    createRedirect: (data: Omit<SeoRedirect, 'id'>) =>
        httpClient<SeoRedirect>('/seo/redirects', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    updateRedirect: (id: string, data: Partial<SeoRedirect>) =>
        httpClient<SeoRedirect>(`/seo/redirects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    deleteRedirect: (id: string) =>
        httpClient(`/seo/redirects/${id}`, { method: 'DELETE' }),

    /**
     * 404 Monitoring
     */
    get404Logs: () => httpClient<Seo404Log[]>('/seo/404-logs'),

    /**
     * Robots Settings
     */
    updateRobots: (postId: string, robots: SeoRobots) =>
        httpClient(`/seo/posts/${postId}/robots`, {
            method: 'POST',
            body: JSON.stringify(robots)
        }),

    // --- PHASE 5: CONTENT QUALITY ---

    /**
     * Duplicate Content Check
     */
    checkDuplicate: (content: string, currentPostId?: string) =>
        httpClient<SeoDuplicateResult>('/seo/check-duplicate', {
            method: 'POST',
            body: JSON.stringify({ content, currentPostId })
        }),

    // --- PHASE 12 & 13: ADVANCED & AUTOMATION ---

    /**
     * Global SEO Configuration
     */
    getConfig: (key: string) => httpClient<any>(`/seo/config/${key}`),

    updateConfig: (key: string, data: any) =>
        httpClient(`/seo/config/${key}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    /**
     * Log 404 Error (Client-side trigger)
     */
    log404: (data: { url: string, referrer?: string, userAgent?: string }) =>
        httpClient('/seo/404', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
};
