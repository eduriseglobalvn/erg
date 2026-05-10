import React from 'react';
import { Metadata } from 'next';
import { createPageMetadata } from '@/utils/seo/page-metadata';
import ErgStoryContent from '@/components/marketing/ErgStoryContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = createPageMetadata({
    title: 'Câu chuyện của ERG',
    description: 'Khám phá hành trình hình thành và phát triển của ERG Global, sứ mệnh khai phóng tiềm năng tri thức thông qua giáo dục thông minh.',
    path: '/cau-chuyen-cua-erg',
    imageAlt: 'C?u chuy?n c?a ERG',
});

export default async function Page() {
    const breadcrumbItems = generateBreadcrumbItems('/cau-chuyen-cua-erg', 'Câu chuyện của ERG', 'Trang chủ');
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <ErgStoryContent />
        </>
    );
}