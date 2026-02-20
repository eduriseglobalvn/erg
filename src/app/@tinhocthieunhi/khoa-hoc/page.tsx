import React from 'react';
import { Metadata } from 'next';
import KidsCoursesContent from '@/components/tinhocthieunhi/KidsCoursesContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = {
    title: 'Khóa học Lập trình Thiếu nhi | ERG Global',
    description: 'Chương trình lập trình Scratch và Python cho học sinh từ Tiểu học đến THCS. Phát triển tư duy sáng tạo và logic qua dự án thực tế.',
};

export default async function Page() {
    const breadcrumbItems = generateBreadcrumbItems('/khoa-hoc', 'Chương trình đào tạo', 'Tin học Thiếu nhi');
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocthieunhi.erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <KidsCoursesContent />
        </>
    );
}