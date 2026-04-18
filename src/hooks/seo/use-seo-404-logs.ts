"use client"

import { useQuery } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';

/**
 * Hook to get 404 logs
 */
export function useSeo404Logs() {
    return useQuery({
        queryKey: ['seo', '404-logs'],
        queryFn: () => seoApi.get404Logs(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
