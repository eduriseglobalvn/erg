import React from 'react';
import { Metadata } from 'next';
import AICourseList from '@/components/features/courses/ai-course-list';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';
import { createPageMetadata } from '@/utils/seo/page-metadata';

export const metadata: Metadata = createPageMetadata({
    title: "Khóa học AI và Lập trình cho học sinh lớp 1-12",
    description: "Chương trình đào tạo Trí tuệ nhân tạo (AI) và Lập trình chuẩn quốc tế cho học sinh từ lớp 1-12 tại ERG. Xem các khóa học và đăng ký tư vấn lộ trình phù hợp.",
    path: "/khoa-hoc",
    image: "https://media.erg.edu.vn/banner/ai-banner-1.jpg",
    imageAlt: "Khóa học Trí tuệ nhân tạo AI và Lập trình tại ERG",
});

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