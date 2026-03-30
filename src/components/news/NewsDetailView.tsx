import React from 'react';
import Link from 'next/link';
import { Calendar, User, FolderOpen, Share2, Star } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { PostContentRenderer } from '@/components/shared/post-content-renderer';
import { RecentPostsSidebar } from '@/components/marketing/recent-posts-sidebar';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { DraftBanner } from '@/components/shared/draft-banner';
import { Reviews } from '@/components/shared/reviews';
import { SchemaScript } from '@/components/seo/schema-script';
import { AiSearchSummaryBox } from '@/components/seo/ai-search-summary';
import { PostDetailResponse } from '@/services/posts.api';

interface NewsDetailViewProps {
    post: PostDetailResponse['data'];
    status?: number;
    recentPosts: any[];
    isDraft?: boolean;
    reviewStats?: any;
    host: string;
}

export const NewsDetailView: React.FC<NewsDetailViewProps> = ({
    post,
    status,
    recentPosts,
    isDraft,
    reviewStats,
    host
}) => {
    if (status === 410) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <FolderOpen size={40} className="text-gray-400" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    Bài viết đã bị xóa
                </h1>
                <p className="text-gray-500 max-w-md mb-8">
                    Nội dung bạn đang tìm kiếm đã bị xóa vĩnh viễn khỏi hệ thống của chúng tôi.
                    Vui lòng quay lại trang chủ hoặc tìm kiếm bài viết khác.
                </p>
                <Button asChild className="bg-[#00008b] hover:bg-blue-800">
                    <Link href="/tin-tuc">Xem tin tức khác</Link>
                </Button>
            </div>
        );
    }

    if (!post) return null;

    const postWithRating = { ...post, rating: reviewStats };
    const breadcrumbItems = [
        { label: 'Trang chủ', href: '/' },
        { label: post.category?.name || 'Tin tức', href: `/tin-tuc/danh-muc/${post.category?.slug || ''}` },
        { label: post.title, href: `/tin-tuc/${post.slug}` }
    ];

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        try {
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(new Date(dateString));
        } catch (e) {
            return dateString;
        }
    };

    return (
        <article className="min-h-screen bg-white pb-24">
            {/* SEO Schemas */}
            <SchemaScript type="NewsArticle" data={postWithRating} domain={host} />
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />

            {isDraft && <DraftBanner />}

            <div className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 py-3 md:px-8 max-w-7xl">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            </div>

            <main className="container mx-auto px-4 md:px-8 pt-10 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8">
                        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-400 font-medium">
                            {post.category && (
                                <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded">
                                    <FolderOpen size={14} />
                                    {post.category.name}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                Đăng ngày: {formatDate(post.createdAt)}
                            </div>
                            {post.author && (
                                <div className="flex items-center gap-1.5">
                                    <User size={14} />
                                    {post.author.fullName}
                                </div>
                            )}

                            {reviewStats && reviewStats.count > 0 && (
                                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={12} className={s <= Math.round(reviewStats.average) ? "fill-amber-500" : "text-gray-300"} />
                                        ))}
                                    </div>
                                    <span className="font-bold">{reviewStats.average.toFixed(1)}</span>
                                    <span className="text-gray-400 text-xs mt-0.5">({reviewStats.count} đánh giá)</span>
                                </div>
                            )}
                        </div>

                        {post.updatedAt && post.updatedAt !== post.createdAt && (
                            <div className="text-[11px] text-gray-400 mb-6 italic">
                                * Cập nhật lần cuối: {formatDate(post.updatedAt)}
                            </div>
                        )}

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                            {post.title}
                        </h1>

                        <div className="post-content-container">
                            <AiSearchSummaryBox post={post} />
                            <PostContentRenderer content={post.content} />
                        </div>

                        <div className="mt-20 pt-10 border-t border-gray-100">
                            <Reviews targetId={post.id} targetType="post" />
                        </div>
                    </div>

                    <aside className="lg:col-span-4 space-y-8">
                        <RecentPostsSidebar initialData={recentPosts} />

                        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="bg-[#cc0022] text-white px-5 py-3 font-bold flex items-center gap-2">
                                <Share2 size={18} />
                                Tin tức nổi bật
                            </div>
                            <div className="p-2 space-y-1">
                                <p className="text-sm p-4 text-center text-gray-400 italic">Đang cập nhật các tin tức hot nhất...</p>
                            </div>
                        </div>

                        <div className="bg-[#00008b] text-white p-6 rounded-xl shadow-lg relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold mb-2">Cần hỗ trợ tư vấn?</h4>
                                <p className="text-blue-100 text-sm mb-4">Liên hệ ngay với chuyên gia ERG để được hỗ trợ tốt nhất.</p>
                                <Button className="w-full bg-white text-[#00008b] hover:bg-gray-100 font-bold">
                                    0766.144.888
                                </Button>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform">
                                <FolderOpen size={120} />
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </article>
    );
};
