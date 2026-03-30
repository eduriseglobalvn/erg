import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { draftMode, headers } from 'next/headers';
import { NewsDetailView } from '@/components/news/NewsDetailView';
import { generateFullMetadata } from '@/utils/seo/seo-metadata';

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

// 1. Generate Metadata for SEO
export async function generateMetadata({ params, searchParams }: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ previewId?: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const { previewId } = await searchParams;

    // Get dynamic host
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';

    const isDraft = (await draftMode()).isEnabled;
    const { data: post, status } = await getPost(slug, isDraft ? previewId : null);

    // [HANDLE 410] Bài viết đã xóa
    if (status === 410) {
        return {
            title: 'Bài viết đã bị xóa | Edurise Global',
            description: 'Nội dung bạn tìm kiếm không còn tồn tại hoặc đã bị xóa khỏi hệ thống.',
            robots: { index: false, follow: false }, 
        };
    }

    if (!post) {
        return {
            title: 'Bài viết không tồn tại',
        };
    }

    const seoTitle = post.metaTitle || post.title;
    const seoDesc = post.metaDescription || post.excerpt || post.title;

    return generateFullMetadata({
        title: isDraft ? `[PREVIEW] ${seoTitle}` : seoTitle,
        description: seoDesc,
        keywords: post.keywords?.split(',') || [],
        path: `/tin-tuc/${post.slug}`,
        host,
        type: 'article',
        images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
        author: post.author?.fullName ? [post.author.fullName] : undefined,
        publishedTime: post.publishedAt || post.createdAt,
        modifiedTime: post.updatedAt,
        robots: isDraft ? { index: false, follow: false } : { index: true, follow: true }
    });
}

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

    // Get dynamic host
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';

    // Parallel Fetching
    const [{ data: post, status }, recentPosts] = await Promise.all([
        getPost(slug, isDraft ? previewId : null),
        getRecentPosts()
    ]);

    if (!post && status !== 410) {
        redirect('/tin-tuc?reason=not-found');
    }

    // Fetch stats for schema and UI
    const reviewStats = post ? await getReviewStats(post.id) : null;

    if (!post) return null;

    return (
        <NewsDetailView
            post={post}
            status={status}
            recentPosts={recentPosts}
            isDraft={isDraft}
            reviewStats={reviewStats}
            host={host}
        />
    );
}
