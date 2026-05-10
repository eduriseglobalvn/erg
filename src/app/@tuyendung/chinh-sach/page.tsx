import React from 'react';
import { Metadata } from 'next';
import { createPageMetadata } from '@/utils/seo/page-metadata';
import HRPolicyContent from '@/components/tuyendung/HRPolicyContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = createPageMetadata({
    title: 'Chính sách & Phúc lợi | Tuyển dụng Edurise Global',
    description: 'Tìm hiểu về chế độ lương thưởng, bảo hiểm, đào tạo và lộ trình thăng tiến cho giáo viên và nhân viên tại Edurise Global.',
    path: '/chinh-sach',
    imageAlt: 'Ch?nh s?ch v? ph?c l?i ERG',
});

export default async function Page() {
    const breadcrumbItems = generateBreadcrumbItems('/chinh-sach', 'Chính sách', 'Tuyển dụng');
    const headerList = await headers();
    const host = headerList.get('host') || 'tuyendung.erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <HRPolicyContent />
        </>
    );
}