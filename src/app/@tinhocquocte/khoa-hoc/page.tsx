import React from 'react';
import { Metadata } from 'next';
import InternationalCoursesContent from '@/components/tinhocquocte/InternationalCoursesContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = {
    title: 'Hệ thống đào tạo Tin học Quốc tế | ERG Global',
    description: 'Chương trình đào tạo tin học chuẩn quốc tế IC3 Spark, IC3 GS6 và MOS cho mọi lứa tuổi từ Tiểu học đến Đại học.',
};

export default async function Page() {
    const breadcrumbItems = generateBreadcrumbItems('/khoa-hoc', 'Chương trình đào tạo', 'Trang chủ');
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocquocte.erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <InternationalCoursesContent />
        </>
    );
}