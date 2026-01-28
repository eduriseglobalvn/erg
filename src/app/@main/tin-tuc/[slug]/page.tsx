
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ChevronRight, User, FolderOpen, Share2 } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { PostContentRenderer } from '@/components/shared/post-content-renderer';
import { RecentPostsSidebar } from '@/components/marketing/recent-posts-sidebar';
import { Breadcrumb } from '@/components/shared/breadcrumb';

// Import Interface
import { PostDetailResponse } from '@/services/posts.api';

// Fetch function for Server Component
async function getPost(slug: string): Promise<PostDetailResponse['data'] | null> {
    try {
        const apiUrl = process.env.BACKEND_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/posts/slug/${slug}`, {
            next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
        });

        if (!res.ok) {
            console.error('Failed to fetch post:', res.status, res.statusText);
            return null;
        }

        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

async function getRecentPosts(): Promise<any[]> {
    try {
        const apiUrl = process.env.BACKEND_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/posts?limit=5&sortBy=createdAt&order=DESC&status=published`, {
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
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

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
        title: seoTitle,
        description: seoDesc,
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

// 2. Main Page Component
export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Parallel Fetching
    const [post, recentPosts] = await Promise.all([
        getPost(slug),
        getRecentPosts()
    ]);

    if (!post) {
        notFound();
    }

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': post.schemaType || 'Article',
        headline: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        image: post.thumbnailUrl ? [post.thumbnailUrl] : [],
        datePublished: post.publishedAt || post.createdAt,
        dateModified: post.updatedAt,
        author: [{
            '@type': 'Person',
            name: post.author?.fullName || 'Edurise Global',
            url: post.author?.socialLinks?.linkedin || undefined
        }],
        publisher: {
            '@type': 'Organization',
            name: 'Edurise Global',
            logo: {
                '@type': 'ImageObject',
                url: `${DOMAIN}/logo.png`
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': post.canonicalUrl || `${DOMAIN}/tin-tuc/${post.slug}`
        }
    };

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
            {/* Inject JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb Section */}
            <div className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 py-3 md:px-8 max-w-7xl">
                    <Breadcrumb
                        items={[
                            { label: 'Tin Tức', href: '/tin-tuc' },
                            { label: post.title }
                        ]}
                    />
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

                        {/* Excerpt */}
                        {post.excerpt && (
                            <div className="text-lg text-gray-600 mb-10 leading-relaxed italic border-l-4 border-l-[#cc0022] pl-6 py-1 bg-gray-50 uppercase tracking-tight font-medium">
                                {post.excerpt}
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="post-content-container">
                            <PostContentRenderer content={post.content} />
                        </div>

                        {/* Comments Placeholder */}
                        <div className="mt-20 pt-10 border-t border-gray-100">
                            <div className="bg-[#0088cc] text-white px-6 py-2 rounded-t-lg font-bold inline-block">
                                Ý kiến khách hàng
                            </div>
                            <div className="bg-gray-50 border border-t-0 rounded-b-lg p-10 text-center">
                                <p className="text-gray-400 italic">Chưa có bình luận nào cho bài viết này. Hãy là người đầu tiên để lại ý kiến của bạn!</p>
                                <Button className="mt-4 bg-[#00008b] hover:bg-blue-800">Viết bình luận</Button>
                            </div>
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
