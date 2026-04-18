"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';

/**
 * Hook to get Redirects
 */
export function useSeoRedirects() {
    return useQuery({
        queryKey: ['seo', 'redirects'],
        queryFn: () => seoApi.getRedirects(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
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
            queryClient.invalidateQueries({ queryKey: ['seo', 'redirects'] });
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
            queryClient.invalidateQueries({ queryKey: ['seo', 'redirects'] });
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
            queryClient.invalidateQueries({ queryKey: ['seo', 'redirects'] });
        },
    });
}
