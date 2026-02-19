import React from 'react';
import { Metadata } from 'next';
import VisionMissionContent from '@/components/marketing/VisionMissionContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = {
    title: 'Tầm nhìn và Sứ mệnh',
    description: 'Tìm hiểu về tầm nhìn trở thành tổ chức giáo dục công nghệ tiên phong và sứ mệnh nâng tầm tri thức, phổ cập kỹ năng số của ERG Global.',
};

export default async function Page() {
    const breadcrumbItems = generateBreadcrumbItems('/tam-nhin-su-menh', 'Tầm nhìn và Sứ mệnh', 'Trang chủ');
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <VisionMissionContent />
        </>
    );
}