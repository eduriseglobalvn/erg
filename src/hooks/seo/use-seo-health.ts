"use client"

import { useQuery } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';

/**
 * Hook to get overall SEO health
 */
export function useSeoHealth() {
    return useQuery({
        queryKey: ['seo', 'health'],
        queryFn: () => seoApi.getHealth(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
