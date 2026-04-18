"use client"

import { useQuery } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';

/**
 * Hook to get SEO score trends
 */
export function useSeoTrends(postId: string, days: number = 30) {
    return useQuery({
        queryKey: ['seo', 'trends', postId, days],
        queryFn: () => seoApi.getTrends(postId, days),
        enabled: !!postId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
