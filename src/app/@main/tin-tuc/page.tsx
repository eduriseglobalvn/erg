import React from 'react';
import { Metadata } from 'next';
import NewsContent from '@/components/news/NewsContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';
import { generateFullMetadata } from '@/utils/seo/seo-metadata';
import { parseRssItemsFromXml, RSS_SOURCE_URL } from '@/lib/rss';
import { getPreferredBackendBaseUrl } from '@/lib/backend-url';
import { resolveSiteContextFromHeaders } from '@/lib/site-context';

export const revalidate = 300;

interface NewsListItem {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    createdAt: string;
    publishedAt?: string;
    thumbnailUrl?: string;
    category?: {
        name?: string;
    };
}

interface NewsListPayload {
    items: NewsListItem[];
    meta: {
        page: number;
        total: number;
        totalPages: number;
    };
}

function normalizeNewsListPayload(data: unknown): NewsListPayload {
    const payload = (typeof data === 'object' && data !== null)
        ? (data as {
            items?: NewsListItem[];
            data?: NewsListItem[];
            meta?: NewsListPayload['meta'];
            page?: number;
            total?: number;
            totalPages?: number;
        })
        : undefined;
    const items = Array.isArray(payload?.items)
        ? payload.items
        : (Array.isArray(payload?.data) ? payload.data : (Array.isArray(data) ? data : []));
    const meta = Array.isArray(data) ? undefined : (payload?.meta || payload);

    return {
        items,
        meta: {
            page: Number(meta?.page) || 1,
            total: Number(meta?.total) || items.length,
            totalPages: Number(meta?.totalPages) || 1,
        },
    };
}

async function getInitialPosts(limit = 9): Promise<NewsListPayload> {
    try {
        const apiUrl = getPreferredBackendBaseUrl();
        const response = await fetch(
            `${apiUrl}/api/posts?page=1&limit=${limit}&status=published&sortBy=createdAt&order=DESC`,
            { next: { revalidate } }
        );

        if (!response.ok) {
            return normalizeNewsListPayload([]);
        }

        const payload = await response.json();
        return normalizeNewsListPayload(payload.data);
    } catch (error) {
        return normalizeNewsListPayload([]);
    }
}

async function getInitialRssNews() {
    try {
        const response = await fetch(RSS_SOURCE_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            },
            next: { revalidate },
        });

        if (!response.ok) {
            return [];
        }

        const xml = await response.text();
        return parseRssItemsFromXml(xml);
    } catch (error) {
        return [];
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const headerList = await headers();
    const siteContext = resolveSiteContextFromHeaders(headerList);

    return generateFullMetadata({
        title: 'Tin tức & Sự kiện | ERG',
        description: 'Cập nhật tin tức giáo dục, thông tin khóa học và các sự kiện mới nhất từ ERG Global.',
        keywords: ['tin tức giáo dục', 'sự kiện', 'ERG news'],
        path: '/tin-tuc',
        host: siteContext.host,
    });
}

export default async function Page() {
    const breadcrumbItems = generateBreadcrumbItems('/tin-tuc', 'Tin tức & Sự kiện', 'Trang chủ');
    const [headerList, initialPostsData, initialAllPostsData, initialRssNews] = await Promise.all([
        headers(),
        getInitialPosts(9),
        getInitialPosts(50),
        getInitialRssNews(),
    ]);
    const siteContext = resolveSiteContextFromHeaders(headerList);

    return (
        <>
            <SchemaScript
                type="BreadcrumbList"
                data={{ items: breadcrumbItems }}
                domain={siteContext.hostname}
            />
            <NewsContent
                initialTab="ALL"
                initialPostsData={initialPostsData}
                initialAllPostsData={initialAllPostsData}
                initialRssNews={initialRssNews}
            />
        </>
    );
}
