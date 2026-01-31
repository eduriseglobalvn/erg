'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/services/posts.api';
import { NewsCard } from '@/components/shared/news-card';
import { NewsGridSkeleton } from '@/components/shared/news-card-skeleton';

// --- CONFIG ---
const DEFAULT_IMAGE = 'https://media.erg.edu.vn/posts/default-thumbnail.webp';
const ITEMS_PER_PAGE = 9;

export default function NewsPage() {
    const [currentPage, setCurrentPage] = useState(1);

    // --- DATA FETCHING ---
    const { data: postsData, isLoading, isError } = useQuery({
        queryKey: ['news', currentPage],
        queryFn: () => postsApi.getAll({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            status: 'published'
        }).then(res => res.data),
    });



    // --- UTILS ---
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

    const paginate = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    // Note: Temporary fallback to 1 as meta seems missing in the raw array response
    const totalPages = (postsData as any)?.meta?.totalPages || 1;

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            {/* Dark Blue Banner */}
            <div className="bg-[#00008b] py-20 text-center text-white relative flex flex-col items-center justify-center">
                <div className="container mx-auto px-4 z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Tin Tức & Sự Kiện</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg opacity-90">
                        Thông tin cập nhật mới nhất từ ERG và ngành giáo dục
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
                {/* --- HEADER --- */}
                <div className="flex justify-start gap-12 border-b border-gray-200 mb-12">
                    <div className="pb-4 text-xl font-bold text-[#cc0022] relative">
                        Tất cả tin tức
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#cc0022] rounded-t-full shadow-[0_-2px_6px_rgba(204,0,34,0.3)]" />
                    </div>
                </div>

                {/* --- LOADING & CONTENT --- */}
                {isLoading ? (
                    <NewsGridSkeleton count={6} />
                ) : isError ? (
                    <div className="text-center py-20 text-red-500 font-medium border rounded-xl bg-red-50">
                        Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
                    </div>
                ) : (
                    <>
                        {/* News Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
                            {(Array.isArray(postsData) ? postsData : []).map((item: any) => (
                                <NewsCard
                                    key={item.id}
                                    title={item.title}
                                    excerpt={item.excerpt || "Đang cập nhật nội dung ngắn cho bài viết này..."}
                                    date={formatDate(item.createdAt)}
                                    thumbnail={item.thumbnailUrl || DEFAULT_IMAGE}
                                    slug={item.slug}
                                    categoryName={item.category?.name || "Chưa phân loại"}
                                />
                            ))}
                        </div>

                        {/* --- PAGINATION (Shadcn-like Style) --- */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`w-11 h-11 flex items-center justify-center rounded-lg border transition-all
                                        ${currentPage === 1
                                            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 shadow-sm active:scale-95'
                                        }`}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {getPageNumbers().map((page, idx) => (
                                    <React.Fragment key={idx}>
                                        {page === '...' ? (
                                            <span className="w-11 h-11 flex items-center justify-center text-gray-400 font-medium">...</span>
                                        ) : (
                                            <button
                                                onClick={() => paginate(page as number)}
                                                className={`w-11 h-11 flex items-center justify-center rounded-lg font-bold text-sm transition-all border
                                                    ${currentPage === page
                                                        ? 'bg-[#00008b] text-white border-[#00008b] shadow-indigo-200 shadow-lg'
                                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )}
                                    </React.Fragment>
                                ))}

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`w-11 h-11 flex items-center justify-center rounded-lg border transition-all
                                        ${currentPage === totalPages
                                            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 shadow-sm active:scale-95'
                                        }`}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        {postsData?.items?.length === 0 && (
                            <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-2xl">
                                <p className="text-gray-500 text-lg font-medium">Chưa có bài viết nào.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}