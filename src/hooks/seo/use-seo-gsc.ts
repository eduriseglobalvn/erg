"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';

/**
 * Hook to get GSC data
 */
export function useGscData(postId: string, days: number = 30) {
    return useQuery({
        queryKey: ['seo', 'gsc', postId, days],
        queryFn: () => seoApi.getGSCData(postId, days),
        enabled: !!postId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
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
            queryClient.invalidateQueries({ queryKey: ['seo'] });
        },
    });
}

/**
 * Hook to get GSC Auth URL
 */
export function useGscAuthUrl() {
    return useQuery({
        queryKey: ['seo', 'auth-url'],
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
            queryClient.invalidateQueries({ queryKey: ['seo'] });
        },
    });
}
