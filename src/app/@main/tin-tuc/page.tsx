import React from 'react';
import { Metadata } from 'next';
import NewsContent from '@/components/news/NewsContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const revalidate = 1800; // Re-validate every 30 minutes

export const metadata: Metadata = {
    title: 'Tin tức & Sự kiện',
    description: 'Cập nhật tin tức giáo dục, thông tin khóa học và các sự kiện mới nhất từ ERG Global.',
};

export default async function Page() {
    const breadcrumbItems = generateBreadcrumbItems('/tin-tuc', 'Tin tức & Sự kiện', 'Trang chủ');
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <NewsContent />
        </>
    );
}