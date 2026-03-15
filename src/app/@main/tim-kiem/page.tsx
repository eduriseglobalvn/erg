import React, { Suspense } from 'react';
import { Metadata } from 'next';
import SearchContent from '@/components/news/SearchContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { NewsGridSkeleton } from '@/components/shared/news-card-skeleton';

export const metadata: Metadata = {
    title: 'Tìm kiếm | Edurise Global',
    description: 'Tìm kiếm tin tức và tài liệu giáo dục tại Edurise Global.',
    robots: { index: false, follow: true } // Không index trang search kết quả
};

export default async function Page() {
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';

    return (
        <>
            <SchemaScript type="WebSite" data={{ name: "Edurise Global Search", url: `https://${host}` }} domain={host} />
            <Suspense fallback={<div className="min-h-screen pt-40 p-10"><NewsGridSkeleton count={6} /></div>}>
                <SearchContent />
            </Suspense>
        </>
    );
}
