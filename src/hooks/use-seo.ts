"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';
import { SeoSchema } from '@/types/seo';

/**
 * SEO Query Keys
 */
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

/**
 * Hook to get site-wide SEO performance
 */
export function useSeoPerformance(period: string = 'month') {
    return useQuery({
        queryKey: seoKeys.performance(period),
        queryFn: () => seoApi.getPerformance(period),
    });
}

/**
 * Hook to get top queries performance
 */
export function useSeoQueryPerformance(limit: number = 15) {
    return useQuery({
        queryKey: seoKeys.queries(limit),
        queryFn: () => seoApi.getQueryPerformance(limit),
    });
}

/**
 * Mutation to analyze draft content (AI/Real-time)
 */
export function useAnalyzeSeoDraft() {
    return useMutation({
        mutationFn: seoApi.analyzeDraft,
    });
}

/**
 * Hook to get overall SEO health
 */
export function useSeoHealth() {
    return useQuery({
        queryKey: seoKeys.health(),
        queryFn: () => seoApi.getHealth(),
        staleTime: 5 * 60 * 1000, // 5 mins
    });
}

/**
 * Hook to get SEO analysis for a specific post
 */
export function useSeoAnalysis(postId: string) {
    return useQuery({
        queryKey: seoKeys.analysis(postId),
        queryFn: () => seoApi.analyzePost(postId),
        enabled: !!postId,
        staleTime: 1 * 60 * 1000, // 1 min
    });
}

/**
 * Hook to get SEO schema for a post
 */
export function useSeoSchema(postId: string) {
    return useQuery({
        queryKey: seoKeys.schema(postId),
        queryFn: () => seoApi.getSchema(postId),
        enabled: !!postId,
    });
}

/**
 * Hook to get SEO score trends
 */
export function useSeoTrends(postId: string, days: number = 30) {
    return useQuery({
        queryKey: seoKeys.trends(postId, days),
        queryFn: () => seoApi.getTrends(postId, days),
        enabled: !!postId,
    });
}

/**
 * Hook to get GSC data
 */
export function useGscData(postId: string, days: number = 30) {
    return useQuery({
        queryKey: seoKeys.gsc(postId, days),
        queryFn: () => seoApi.getGSCData(postId, days),
        enabled: !!postId,
    });
}

/**
 * Mutation to sync GSC data
 */
export function useSyncGsc() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (days: number) => seoApi.syncGSC(days),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seoKeys.all });
        },
    });
}

/**
 * Hook to get list of auto-linking keywords
 */
export function useSeoKeywords() {
    return useQuery({
        queryKey: seoKeys.keywords(),
        queryFn: () => seoApi.getKeywords(),
    });
}

/**
 * Mutation to create a new SEO keyword
 */
export function useCreateSeoKeyword() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: seoApi.createKeyword,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seoKeys.keywords() });
        },
    });
}

/**
 * Mutation to delete an SEO keyword
 */
export function useDeleteSeoKeyword() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: seoApi.deleteKeyword,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seoKeys.keywords() });
        },
    });
}

/**
 * Mutation to apply autolinks to a post
 */
export function useApplySeoAutolinks() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) => seoApi.applyAutolinks(postId),
        onSuccess: (_, postId) => {
            queryClient.invalidateQueries({ queryKey: seoKeys.analysis(postId) });
        },
    });
}

/**
 * Mutation to save custom schema
 */
export function useSaveSeoSchema() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, schema }: { postId: string, schema: { type: string, data: any } }) =>
            seoApi.saveSchema(postId, schema),
        onSuccess: (_, { postId }) => {
            queryClient.invalidateQueries({ queryKey: seoKeys.schema(postId) });
        },
    });
}

// --- NEW HOOKS FROM PHASES 3-6 ---

/**
 * Hook to get GSC Auth URL
 */
export function useGscAuthUrl() {
    return useQuery({
        queryKey: [...seoKeys.all, 'auth-url'],
        queryFn: () => seoApi.getGscAuthUrl(),
        enabled: false, // Gọi bằng refetch() khi user click
    });
}

/**
 * Mutation to handle GSC callback
 */
export function useGscCallback() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (code: string) => seoApi.callbackGsc(code),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seoKeys.all });
        },
    });
}

/**
 * Hook to get Redirects
 */
export function useSeoRedirects() {
    return useQuery({
        queryKey: seoKeys.redirects(),
        queryFn: () => seoApi.getRedirects(),
    });
}

/**
 * Mutation to create redirect
 */
export function useCreateSeoRedirect() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: seoApi.createRedirect,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seoKeys.redirects() });
        },
    });
}

/**
 * Mutation to update redirect
 */
export function useUpdateSeoRedirect() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => seoApi.updateRedirect(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seoKeys.redirects() });
        },
    });
}

/**
 * Mutation to delete redirect
 */
export function useDeleteSeoRedirect() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: seoApi.deleteRedirect,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seoKeys.redirects() });
        },
    });
}

/**
 * Hook to get 404 logs
 */
export function useSeo404Logs() {
    return useQuery({
        queryKey: seoKeys.logs404(),
        queryFn: () => seoApi.get404Logs(),
    });
}

/**
 * Mutation to update robots settings
 */
export function useUpdateSeoRobots() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, robots }: { postId: string, robots: any }) =>
            seoApi.updateRobots(postId, robots),
        onSuccess: (_, { postId }) => {
            queryClient.invalidateQueries({ queryKey: seoKeys.analysis(postId) });
        },
    });
}

/**
 * Mutation to check duplicate content
 */
export function useCheckSeoDuplicate() {
    return useMutation({
        mutationFn: ({ content, currentPostId }: { content: string, currentPostId?: string }) =>
            seoApi.checkDuplicate(content, currentPostId),
    });
}
