"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';

/**
 * Hook to get SEO schema for a post
 */
export function useSeoSchema(postId: string) {
    return useQuery({
        queryKey: ['seo', 'schema', postId],
        queryFn: () => seoApi.getSchema(postId),
        enabled: !!postId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
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
            queryClient.invalidateQueries({ queryKey: ['seo', 'schema', postId] });
        },
    });
}
