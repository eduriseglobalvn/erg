import React from 'react';
import { Metadata } from 'next';
import { createPageMetadata } from '@/utils/seo/page-metadata';
import CoreValuesContent from '@/components/marketing/CoreValuesContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = createPageMetadata({
    title: 'Giá trị cốt lõi',
    description: 'Khám phá 5 trụ cột giá trị cốt lõi định hình văn hóa doanh nghiệp và chất lượng đào tạo tại Edurise Global: Trách nhiệm, Chất lượng, Hợp tác, Khách hàng, Sáng tạo.',
    path: '/gia-tri-cot-loi',
    imageAlt: 'Gi? tr? c?t l?i ERG',
});

export default async function Page() {
    const breadcrumbItems = generateBreadcrumbItems('/gia-tri-cot-loi', 'Giá trị cốt lõi', 'Trang chủ');
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <CoreValuesContent />
        </>
    );
}