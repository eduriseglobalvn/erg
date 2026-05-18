'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { Skeleton } from '@/components/admin/ui/skeleton';
import { postsApi } from '@/services/posts.api';

interface RecentPostItem {
    id: string;
    slug: string;
    title: string;
    createdAt: string;
}

interface RecentPostsData {
    items: RecentPostItem[];
}

interface RecentPostsSidebarProps {
    initialData?: RecentPostItem[];
    compact?: boolean;
}

export function RecentPostsSidebar({ initialData, compact = false }: RecentPostsSidebarProps) {
    const { data: recentPostsResponse, isLoading } = useQuery({
        queryKey: ['recent-posts'],
        queryFn: () =>
            postsApi
                .getAll({ limit: 5, sortBy: 'createdAt', order: 'DESC', status: 'published' })
                .then((res) => res.data as RecentPostsData | RecentPostItem[]),
        initialData: initialData ? { items: initialData } : undefined,
    });

    const posts: RecentPostItem[] = Array.isArray(recentPostsResponse)
        ? recentPostsResponse
        : Array.isArray(recentPostsResponse?.items)
            ? recentPostsResponse.items
            : [];

    const mergedPosts = useMemo(() => {
        const seededPosts = initialData || [];
        return [...seededPosts, ...posts].filter(
            (post, index, allPosts) => allPosts.findIndex((item) => item.slug === post.slug) === index
        );
    }, [initialData, posts]);

    return (
        <div className={`${compact ? 'rounded-lg' : 'rounded-xl'} overflow-hidden border border-gray-100 bg-white shadow-sm`}>
            <div className={`flex items-center gap-2 bg-[#0088cc] font-bold text-white ${compact ? 'px-4 py-2.5 text-sm' : 'px-5 py-3'}`}>
                <Calendar size={compact ? 15 : 18} />
                Bài viết gần đây
            </div>
            <div className={`${compact ? 'p-1.5' : 'p-2'} divide-y divide-gray-50`}>
                {isLoading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className={compact ? 'p-3' : 'p-4'}>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="mt-2 h-4 w-2/3" />
                        </div>
                    ))
                ) : mergedPosts.length === 0 ? (
                    <p className={`${compact ? 'p-4 text-xs' : 'p-6 text-sm'} text-center italic text-gray-400`}>
                        Chưa có bài viết nào.
                    </p>
                ) : (
                    mergedPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/tin-tuc/${post.slug}`}
                            className={`${compact ? 'p-3' : 'p-4'} block rounded-md transition-colors hover:bg-gray-50 group`}
                        >
                            <h5 className={`${compact ? 'text-xs leading-snug' : 'text-sm leading-snug'} mb-1 line-clamp-2 font-bold text-gray-700 group-hover:text-[#00008b]`}>
                                {post.title}
                            </h5>
                            <span className={`${compact ? 'text-[10px]' : 'text-[11px]'} font-medium text-gray-400`}>
                                {new Intl.DateTimeFormat('vi-VN').format(new Date(post.createdAt))}
                            </span>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
