"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';

/**
 * Hook to get list of auto-linking keywords
 */
export function useSeoKeywords() {
    return useQuery({
        queryKey: ['seo', 'keywords'],
        queryFn: () => seoApi.getKeywords(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
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
            queryClient.invalidateQueries({ queryKey: ['seo', 'keywords'] });
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
            queryClient.invalidateQueries({ queryKey: ['seo', 'keywords'] });
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
            queryClient.invalidateQueries({ queryKey: ['seo', 'analysis', postId] });
        },
    });
}
