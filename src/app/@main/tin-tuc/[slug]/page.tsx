import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { Calendar, User, FolderOpen, Share2, Star } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { PostContentRenderer } from '@/components/shared/post-content-renderer';
import { RecentPostsSidebar } from '@/components/marketing/recent-posts-sidebar';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { draftMode } from 'next/headers';
import { DraftBanner } from '@/components/shared/draft-banner';
import { Reviews } from '@/components/shared/reviews';
import { SchemaScript } from '@/components/seo/schema-script';
import { AiSearchSummaryBox } from '@/components/seo/ai-search-summary';

import { reviewsApi } from '@/services/reviews.api';

// Import Interface
import { PostDetailResponse } from '@/services/posts.api';

interface PostFetchResult {
    data: PostDetailResponse['data'] | null;
    status: number;
}

// Fetch review stats for SSR
async function getReviewStats(targetId: string) {
    try {
        const apiUrl = process.env.BACKEND_URL || 'http://localhost:3003';
        const res = await fetch(`${apiUrl}/api/reviews?targetId=${targetId}&limit=1`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) return null;
        const json = await res.json();
        return json.stats || null;
    } catch (error) {
        return null;
    }
}

// Fetch function for Server Component
async function getPost(slug: string, previewId?: string | null): Promise<PostFetchResult> {
    try {
        const apiUrl = process.env.BACKEND_URL || 'http://localhost:3003';

        // [CASE] Nếu đang ở chế độ xem trước (Draft Mode)
        if (previewId) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Preview] Fetching preview data for ID: ${previewId}`);
            }
            const res = await fetch(`${apiUrl}/api/posts/preview/${previewId}?t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }
            });
            if (res.ok) {
                const json = await res.json();
                return { data: json.data, status: 200 };
            }
            return { data: null, status: res.status };
        }

        // [CASE] Luồng lấy dữ liệu từ DB (Production)
        const res = await fetch(`${apiUrl}/api/posts/slug/${slug}`, {
            next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
        });

        if (!res.ok) {
            console.error('Failed to fetch post:', res.status, res.statusText);
            return { data: null, status: res.status };
        }

        const json = await res.json();
        return { data: json.data, status: 200 };
    } catch (error) {
        console.error('Error fetching post:', error);
        return { data: null, status: 500 };
    }
}

async function getRecentPosts(): Promise<any[]> {
    try {
        const apiUrl = process.env.BACKEND_URL || 'http://localhost:3003';
        const res = await fetch(`${apiUrl}/api/posts?limit=5&sortBy=createdAt&order=DESC&status=published`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) return [];
        const json = await res.json();
        const data = json.data;
        return Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
    } catch (error) {
        return [];
    }
}

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://erg.edu.vn';

// 1. Generate Metadata for SEO
export async function generateMetadata({ params, searchParams }: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ previewId?: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const { previewId } = await searchParams;

    const isDraft = (await draftMode()).isEnabled;
    const { data: post, status } = await getPost(slug, isDraft ? previewId : null);

    // [HANDLE 410] Bài viết đã xóa
    if (status === 410) {
        return {
            title: 'Bài viết đã bị xóa | Edurise Global',
            description: 'Nội dung bạn tìm kiếm không còn tồn tại hoặc đã bị xóa khỏi hệ thống.',
            robots: { index: false, follow: false }, // QUAN TRỌNG: Noindex
        };
    }

    if (!post) {
        return {
            title: 'Bài viết không tồn tại',
        };
    }

    const seoTitle = post.metaTitle || post.title;
    const seoDesc = post.metaDescription || post.excerpt || post.title;
    const shareImage = post.thumbnailUrl ? [
        {
            url: post.thumbnailUrl,
            width: 1200,
            height: 630,
            alt: post.title,
        }
    ] : [];

    return {
        title: isDraft ? `[PREVIEW] ${seoTitle}` : seoTitle,
        description: seoDesc,
        robots: isDraft ? { index: false, follow: false } : undefined,
        alternates: {
            canonical: post.canonicalUrl || `${DOMAIN}/tin-tuc/${post.slug}`,
        },
        openGraph: {
            title: seoTitle,
            description: seoDesc,
            type: 'article',
            url: `${DOMAIN}/tin-tuc/${post.slug}`,
            images: shareImage,
            publishedTime: post.publishedAt || post.createdAt,
            modifiedTime: post.updatedAt,
            authors: post.author?.fullName ? [post.author.fullName] : undefined,
            siteName: 'Edurise Global',
        },
        twitter: {
            card: 'summary_large_image',
            title: seoTitle,
            description: seoDesc,
            images: shareImage,
        },
        keywords: post.keywords?.split(',') || [],
    };
}

// [NEW] ISR Revalidation: 10 phút cập nhật 1 lần

export default async function PostDetailPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ previewId?: string }>
}) {
    const { slug } = await params;
    const { previewId } = await searchParams;
    const isDraft = (await draftMode()).isEnabled;

    // Parallel Fetching
    const [{ data: post, status }, recentPosts] = await Promise.all([
        getPost(slug, isDraft ? previewId : null),
        getRecentPosts()
    ]);

    if (!post) {
        // [SEO] Redirect 302 về trang danh sách có kèm thông báo
        redirect('/tin-tuc?reason=not-found');
    }

    // [SSR] Fetch stats for schema and UI
    const reviewStats = await getReviewStats(post.id);
    const postWithRating = { ...post, rating: reviewStats };

    // [HANDLE 410] Giao diện bài viết đã xóa
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

    if (!post) {
        // [SEO] Redirect 302 về trang danh sách có kèm thông báo
        redirect('/tin-tuc?reason=not-found');
    }

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
            <SchemaScript type="NewsArticle" data={postWithRating} domain="erg.edu.vn" />
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain="erg.edu.vn" />

            {/* Render Slot tương ứng */}
            {/* Thanh thông báo bản nháp */}
            {isDraft && <DraftBanner />}

            <div className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 py-3 md:px-8 max-w-7xl">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            </div>

            <main className="container mx-auto px-4 md:px-8 pt-10 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT CONTENT AREA */}
                    <div className="lg:col-span-8">
                        {/* Meta Info */}
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

                            {/* [NEW] Rating Summary */}
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

                        {/* Last Updated */}
                        {post.updatedAt && post.updatedAt !== post.createdAt && (
                            <div className="text-[11px] text-gray-400 mb-6 italic">
                                * Cập nhật lần cuối: {formatDate(post.updatedAt)}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                            {post.title}
                        </h1>



                        {/* Main Content */}
                        <div className="post-content-container">
                            <AiSearchSummaryBox post={post} />
                            <PostContentRenderer content={post.content} />
                        </div>


                        {/* Reviews System */}
                        <div className="mt-20 pt-10 border-t border-gray-100">
                            <Reviews targetId={post.id} targetType="post" />
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Recent Posts Section */}
                        <RecentPostsSidebar initialData={recentPosts} />

                        {/* Hot Posts Section (Optional/Static for now) */}
                        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="bg-[#cc0022] text-white px-5 py-3 font-bold flex items-center gap-2">
                                <Share2 size={18} />
                                Tin tức nổi bật
                            </div>
                            <div className="p-2 space-y-1">
                                <p className="text-sm p-4 text-center text-gray-400 italic">Đang cập nhật các tin tức hot nhất...</p>
                            </div>
                        </div>

                        {/* Quick Actions / Contact */}
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
}
