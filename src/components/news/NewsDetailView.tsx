import React from 'react';
import Link from 'next/link';
import { Calendar, FolderOpen, Share2, Star, User } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { PostContentRenderer } from '@/components/shared/post-content-renderer';
import { RecentPostsSidebar } from '@/components/marketing/recent-posts-sidebar';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { DraftBanner } from '@/components/shared/draft-banner';
import { Reviews } from '@/components/shared/reviews';
import { SchemaScript } from '@/components/seo/schema-script';
import { AiSearchSummaryBox } from '@/components/seo/ai-search-summary';
import { PostDetailResponse } from '@/services/posts.api';
import { ReviewStats } from '@/services/reviews.api';
import { TRAINING_CONTACT_URL } from '@/constants/training-fields';

interface RecentPostItem {
    id: string;
    slug: string;
    title: string;
    createdAt: string;
}

interface NewsDetailViewProps {
    post: PostDetailResponse['data'];
    status?: number;
    recentPosts: RecentPostItem[];
    isDraft?: boolean;
    reviewStats?: ReviewStats | null;
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
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                    <FolderOpen size={40} className="text-gray-400" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
                    Bài viết đã bị xóa
                </h1>
                <p className="mb-8 max-w-md text-gray-500">
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
        } catch {
            return dateString;
        }
    };

    const postContent = post.contentHtml || post.content || '';
    const isVisualArticle = postContent.includes('data-erg-block') || postContent.includes('data-editor-node');

    return (
        <article className={`min-h-screen bg-white pb-24 ${isVisualArticle ? 'erg-visual-post-detail' : ''}`}>
            <SchemaScript type="NewsArticle" data={postWithRating} domain={host} />
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />

            {isDraft && <DraftBanner />}

            <div className="border-b bg-gray-50">
                <div className="container mx-auto max-w-7xl px-4 py-3 md:px-8">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            </div>

            <main className={`container mx-auto px-4 pt-8 md:px-8 ${isVisualArticle ? 'max-w-[1680px]' : 'max-w-7xl'}`}>
                <div className={isVisualArticle ? 'grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_280px] 2xl:grid-cols-[minmax(0,1fr)_300px]' : 'grid grid-cols-1 gap-10 lg:grid-cols-12'}>
                    <div className={isVisualArticle ? 'min-w-0' : 'lg:col-span-8'}>
                        <div className="mb-3 flex flex-wrap items-center gap-4 text-sm font-medium text-gray-400">
                            {post.category && (
                                <div className="flex items-center gap-1.5 rounded bg-blue-50 px-3 py-1 text-blue-600">
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
                                <div className="flex items-center gap-1.5 rounded bg-amber-50 px-3 py-1 text-amber-500">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={12}
                                                className={s <= Math.round(reviewStats.average) ? 'fill-amber-500' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-bold">{reviewStats.average.toFixed(1)}</span>
                                    <span className="mt-0.5 text-xs text-gray-400">({reviewStats.count} đánh giá)</span>
                                </div>
                            )}
                        </div>

                        {post.updatedAt && post.updatedAt !== post.createdAt && (
                            <div className="mb-6 text-[11px] italic text-gray-400">
                                * Cập nhật lần cuối: {formatDate(post.updatedAt)}
                            </div>
                        )}

                        <h1 className={isVisualArticle ? 'mb-7 text-3xl font-black leading-tight text-gray-950 md:text-4xl lg:text-[2.75rem]' : 'mb-8 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl lg:text-5xl'}>
                            {post.title}
                        </h1>

                        <div className={isVisualArticle ? 'post-content-container visual-post-content-container' : 'post-content-container'}>
                            {!isVisualArticle && <AiSearchSummaryBox post={post} />}
                            <PostContentRenderer content={postContent} />
                        </div>

                        <div className="mt-20 border-t border-gray-100 pt-10">
                            <Reviews targetId={post.id} targetType="post" />
                        </div>
                    </div>

                    <aside className={isVisualArticle ? 'space-y-5 xl:sticky xl:top-24 xl:self-start' : 'space-y-8 lg:col-span-4'}>
                        <RecentPostsSidebar initialData={recentPosts} compact={isVisualArticle} />

                        <div className={`${isVisualArticle ? 'rounded-lg' : 'rounded-xl'} overflow-hidden border border-gray-100 bg-white shadow-sm`}>
                            <div className={`flex items-center gap-2 bg-[#cc0022] font-bold text-white ${isVisualArticle ? 'px-4 py-2.5 text-sm' : 'px-5 py-3'}`}>
                                <Share2 size={isVisualArticle ? 15 : 18} />
                                Tin tức nổi bật
                            </div>
                            <div className={isVisualArticle ? 'p-1.5' : 'space-y-1 p-2'}>
                                <p className={`${isVisualArticle ? 'p-3 text-xs' : 'p-4 text-sm'} text-center italic text-gray-400`}>
                                    Đang cập nhật các tin tức hot nhất...
                                </p>
                            </div>
                        </div>

                        <div className={`${isVisualArticle ? 'rounded-lg p-4' : 'rounded-xl p-6'} group relative overflow-hidden bg-[#00008b] text-white shadow-lg`}>
                            <div className="relative z-10">
                                <h4 className={`${isVisualArticle ? 'mb-2 text-base' : 'mb-2 text-lg'} font-bold`}>
                                    Cần hỗ trợ tư vấn?
                                </h4>
                                <p className={`${isVisualArticle ? 'mb-3 text-xs leading-5' : 'mb-4 text-sm'} text-blue-100`}>
                                    Liên hệ ngay với chuyên gia ERG để được hỗ trợ tốt nhất.
                                </p>
                                <Button asChild className={`${isVisualArticle ? 'h-9 text-sm' : ''} w-full bg-white font-bold text-[#00008b] hover:bg-gray-100`}>
                                    <Link href={TRAINING_CONTACT_URL} target="_blank" rel="noopener noreferrer">
                                        0766.144.888
                                    </Link>
                                </Button>
                            </div>
                            <div className="absolute -bottom-4 -right-4 rotate-12 opacity-10 transition-transform group-hover:scale-110">
                                <FolderOpen size={120} />
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </article>
    );
};
