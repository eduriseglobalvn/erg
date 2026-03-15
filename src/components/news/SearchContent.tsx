'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/services/posts.api';
import { NewsCard } from '@/components/shared/news-card';
import { NewsGridSkeleton } from '@/components/shared/news-card-skeleton';
import { Search, Loader2 } from 'lucide-react';

const DEFAULT_IMAGE = 'https://media.erg.edu.vn/posts/default-thumbnail.webp';

export default function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page when query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    const { data: searchResults, isLoading, isFetching } = useQuery({
        queryKey: ['search', query, currentPage],
        queryFn: () => postsApi.getAll({
            page: currentPage,
            limit: 12,
            search: query,
            status: 'published'
        }).then(res => res.data),
        enabled: query.length > 0
    });

    const formatDate = (dateString: string) => {
        try {
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(new Date(dateString));
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-white pb-20 pt-[70px] lg:pt-[135px]">
            {/* Search Header */}
            <div className="bg-slate-50 border-b py-12 md:py-20 text-center">
                <div className="container mx-auto px-4">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-6">
                        <Search size={32} className="text-slate-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                        {query ? `Kết quả tìm kiếm cho: "${query}"` : 'Tìm kiếm bài viết'}
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Tìm kiếm trong hàng ngàn bài viết, tài liệu và tin tức giáo dục tại ERG Global.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
                {!query ? (
                    <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-slate-50/50">
                        <p className="text-slate-400 text-lg">Vui lòng nhập từ khóa để tìm kiếm bài viết.</p>
                    </div>
                ) : isLoading ? (
                    <NewsGridSkeleton count={6} />
                ) : searchResults?.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {(Array.isArray(searchResults) ? searchResults : []).map((item: any) => (
                            <NewsCard
                                key={item.id}
                                title={item.title}
                                excerpt={item.excerpt || item.content?.substring(0, 150) || "..."}
                                date={formatDate(item.createdAt)}
                                thumbnail={item.thumbnailUrl || DEFAULT_IMAGE}
                                slug={item.slug}
                                categoryName={item.category?.name || "Chưa phân loại"}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-slate-50/50">
                        <p className="text-slate-400 text-lg mb-2">Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp cho "{query}".</p>
                        <p className="text-slate-500 text-sm">Hãy thử với một từ khóa khác hoặc kiểm tra lại chính tả.</p>
                    </div>
                )}

                {isFetching && !isLoading && (
                    <div className="fixed bottom-10 right-10 bg-white shadow-xl rounded-full p-3 border animate-spin">
                        <Loader2 size={24} className="text-blue-600" />
                    </div>
                )}
            </div>
        </div>
    );
}
