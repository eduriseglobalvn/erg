import React from 'react';
import { Metadata } from 'next';
import TrainingFieldsContent from '@/components/marketing/TrainingFieldsContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = {
    title: 'Lĩnh vực đào tạo',
    description: 'Khám phá các lĩnh vực đào tạo đa dạng tại ERG Global: Tin học Quốc tế, Quốc gia, Thiếu nhi, Công dân số, Điện toán đám mây và AI.',
};

export default async function Page() {
    const breadcrumbItems = generateBreadcrumbItems('/linh-vuc-dao-tao', 'Lĩnh vực đào tạo', 'Trang chủ');
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <TrainingFieldsContent />
        </>
    );
}