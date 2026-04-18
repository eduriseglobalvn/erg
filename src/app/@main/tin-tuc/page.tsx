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
        ? (data as { items?: NewsListItem[]; meta?: NewsListPayload['meta'] })
        : undefined;
    const items = Array.isArray(payload?.items)
        ? payload.items
        : (Array.isArray(data) ? data : []);
    const meta = Array.isArray(data) ? undefined : payload?.meta;

    return {
        items,
        meta: {
            page: Number(meta?.page) || 1,
            total: Number(meta?.total) || items.length,
            totalPages: Number(meta?.totalPages) || 1,
        },
    };
}

async function getInitialPosts(): Promise<NewsListPayload> {
    try {
        const apiUrl = getPreferredBackendBaseUrl();
        const response = await fetch(
            `${apiUrl}/api/posts?page=1&limit=9&status=published`,
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
    const [headerList, initialPostsData, initialRssNews] = await Promise.all([
        headers(),
        getInitialPosts(),
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
                initialTab="RSS"
                initialPostsData={initialPostsData}
                initialRssNews={initialRssNews}
            />
        </>
    );
}
