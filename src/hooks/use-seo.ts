"use client"

/**
 * SEO Hooks — co-located per hook for lazy loading support.
 * Existing imports from '@/hooks/use-seo' continue to work unchanged.
 *
 * Source files:
 *   seo/use-seo-health.ts        → useSeoHealth
 *   seo/use-seo-analysis.ts      → useSeoAnalysis
 *   seo/use-seo-schema.ts        → useSeoSchema, useSaveSeoSchema
 *   seo/use-seo-trends.ts        → useSeoTrends
 *   seo/use-seo-gsc.ts           → useGscData, useSyncGsc, useGscAuthUrl, useGscCallback
 *   seo/use-seo-redirects.ts     → useSeoRedirects, useCreateSeoRedirect, useUpdateSeoRedirect, useDeleteSeoRedirect
 *   seo/use-seo-keywords.ts      → useSeoKeywords, useCreateSeoKeyword, useDeleteSeoKeyword, useApplySeoAutolinks
 *   seo/use-seo-404-logs.ts       → useSeo404Logs
 *   seo/use-seo-mutations.ts     → all mutation hooks
 */

import { useQuery } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';

// ---------------------------------------------------------------------------
// Query keys (kept inline so they remain backward-compatible)
// ---------------------------------------------------------------------------
export const seoKeys = {
    all: ['seo'] as const,
    health: () => [...seoKeys.all, 'health'] as const,
    analysis: (postId: string) => [...seoKeys.all, 'analysis', postId] as const,
    schema: (postId: string) => [...seoKeys.all, 'schema', postId] as const,
    trends: (postId: string, days: number) => [...seoKeys.all, 'trends', postId, days] as const,
    gsc: (postId: string, days: number) => [...seoKeys.all, 'gsc', postId, days] as const,
    topPosts: (limit: number, days: number) => [...seoKeys.all, 'top-posts', limit, days] as const,
    keywords: () => [...seoKeys.all, 'keywords'] as const,
    performance: (period: string) => [...seoKeys.all, 'performance', period] as const,
    queries: (limit: number) => [...seoKeys.all, 'queries', limit] as const,
    redirects: () => [...seoKeys.all, 'redirects'] as const,
    logs404: () => [...seoKeys.all, '404-logs'] as const,
};

// ---------------------------------------------------------------------------
// Hooks that remain inline (not extracted — cross-cutting queries)
// ---------------------------------------------------------------------------

/** Hook to get site-wide SEO performance */
export function useSeoPerformance(period: string = 'month') {
    return useQuery({
        queryKey: seoKeys.performance(period),
        queryFn: () => seoApi.getPerformance(period),
    });
}

/** Hook to get top queries performance */
export function useSeoQueryPerformance(limit: number = 15) {
    return useQuery({
        queryKey: seoKeys.queries(limit),
        queryFn: () => seoApi.getQueryPerformance(limit),
    });
}

// ---------------------------------------------------------------------------
// Re-exports from co-located files (lazy-loadable)
// ---------------------------------------------------------------------------
export { useSeoHealth } from './seo/use-seo-health';
export { useSeoAnalysis } from './seo/use-seo-analysis';
export { useSeoSchema, useSaveSeoSchema } from './seo/use-seo-schema';
export { useSeoTrends } from './seo/use-seo-trends';
export { useGscData, useSyncGsc, useGscAuthUrl, useGscCallback } from './seo/use-seo-gsc';
export { useSeoRedirects, useCreateSeoRedirect, useUpdateSeoRedirect, useDeleteSeoRedirect } from './seo/use-seo-redirects';
export { useSeoKeywords, useCreateSeoKeyword, useDeleteSeoKeyword, useApplySeoAutolinks } from './seo/use-seo-keywords';
export { useSeo404Logs } from './seo/use-seo-404-logs';
// Mutations without a dedicated file
export { useAnalyzeSeoDraft, useUpdateSeoRobots, useCheckSeoDuplicate } from './seo/use-seo-mutations';
