'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/services/posts.api';
import { Skeleton } from '@/components/admin/ui/skeleton';
import { Calendar } from 'lucide-react';

interface RecentPostItem {
    id: string;
    slug: string;
    title: string;
    createdAt: string;
}

interface RecentPostsData {
    items: RecentPostItem[];
}

export function RecentPostsSidebar({ initialData }: { initialData?: RecentPostItem[] }) {
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

    return (
        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="bg-[#0088cc] text-white px-5 py-3 font-bold flex items-center gap-2">
                <Calendar size={18} />
                Bài viết gần đây
            </div>
            <div className="p-2 divide-y divide-gray-50">
                {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="p-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3 mt-2" /></div>)
                ) : posts.length === 0 ? (
                    <p className="p-6 text-center text-gray-400 italic text-sm">Chưa có bài viết nào.</p>
                ) : (
                    posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/tin-tuc/${post.slug}`}
                            className="p-4 block group hover:bg-gray-50 transition-colors"
                        >
                            <h5 className="text-sm font-bold text-gray-700 group-hover:text-[#00008b] line-clamp-2 leading-snug mb-1">
                                {post.title}
                            </h5>
                            <span className="text-[11px] text-gray-400 font-medium">
                                {new Intl.DateTimeFormat('vi-VN').format(new Date(post.createdAt))}
                            </span>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
