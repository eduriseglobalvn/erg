import React, { Suspense } from 'react';
import { Metadata } from 'next';
import SearchContent from '@/components/news/SearchContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { NewsGridSkeleton } from '@/components/shared/news-card-skeleton';
import { SEO_DATA } from '@/constants/seo.constants';

export const metadata: Metadata = {
    title: `Tìm kiếm | ${SEO_DATA.congdanso.title}`,
    description: `Tìm kiếm bài viết về công dân số tại ${SEO_DATA.congdanso.title}.`,
    robots: { index: false, follow: true }
};

export default async function Page() {
    const headerList = await headers();
    const host = headerList.get('host') || 'congdanso.erg.edu.vn';

    return (
        <>
            <SchemaScript type="WebSite" data={{ name: "Công dân số Search", url: `https://${host}` }} domain={host} />
            <Suspense fallback={<div className="min-h-screen pt-40 p-10"><NewsGridSkeleton count={6} /></div>}>
                <SearchContent />
            </Suspense>
        </>
    );
}
