import React from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import NewsContent from '@/components/news/NewsContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { generateFullMetadata } from '@/utils/seo/seo-metadata';
import { parseRssItemsFromXml, RSS_SOURCE_URL } from '@/lib/rss';
import { resolveSiteContextFromHeaders } from '@/lib/site-context';

export const revalidate = 300;

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
    } catch {
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
    const [headerList, initialRssNews] = await Promise.all([
        headers(),
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
                initialRssNews={initialRssNews}
            />
        </>
    );
}
