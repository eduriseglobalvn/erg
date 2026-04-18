"use client"

/**
 * Mutation hooks without a dedicated file — kept in one barrel for cleanliness.
 * Hooks that have their own file are exported from '@/hooks/use-seo' directly.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';

/**
 * Mutation to analyze draft content (AI/Real-time)
 */
export function useAnalyzeSeoDraft() {
    return useMutation({
        mutationFn: seoApi.analyzeDraft,
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
            queryClient.invalidateQueries({ queryKey: ['seo', 'analysis', postId] });
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
