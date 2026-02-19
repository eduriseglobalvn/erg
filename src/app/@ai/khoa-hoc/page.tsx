import React from 'react';
import { Metadata } from 'next';
import AICourseList from '@/components/features/courses/ai-course-list';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = {
    title: "Khóa học AI & Lập trình | Trí tuệ Nhân tạo ERG",
    description: "Chương trình đào tạo Trí tuệ nhân tạo (AI) và Lập trình chuẩn quốc tế cho học sinh từ lớp 1-12.",
    openGraph: {
        title: "Khóa học AI & Lập trình | Trí tuệ Nhân tạo ERG",
        description: "Chương trình đào tạo Trí tuệ nhân tạo (AI) và Lập trình chuẩn quốc tế cho học sinh từ lớp 1-12.",
        images: ['https://media.erg.edu.vn/banner/ai-banner-1.jpg']
    }
};

export default async function CoursesPage() {
    const breadcrumbItems = generateBreadcrumbItems('/khoa-hoc', 'Chương trình đào tạo', 'AI');
    const headerList = await headers();
    const host = headerList.get('host') || 'ai.erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <AICourseList />
        </>
    );
}