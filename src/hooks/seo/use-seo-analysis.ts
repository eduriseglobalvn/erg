"use client"

import { useQuery } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';

/**
 * Hook to get SEO analysis for a specific post
 */
export function useSeoAnalysis(postId: string) {
    return useQuery({
        queryKey: ['seo', 'analysis', postId],
        queryFn: () => seoApi.analyzePost(postId),
        enabled: !!postId,
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

