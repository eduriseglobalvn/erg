import React from 'react';
import { Metadata } from 'next';
import AICourseContent from '@/components/ai/AICourseContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';
import { COURSES } from '@/constants/courses';

export const metadata: Metadata = {
    title: 'Chương trình học cùng AI | Chuẩn NXB Giáo dục Việt Nam | ERG',
    description: 'Chương trình đào tạo Trí tuệ nhân tạo (AI) cho học sinh từ lớp 1 đến lớp 12 theo chuẩn sách giáo khoa của NXB Giáo dục Việt Nam.',
};

export default async function Page() {
    const courseData = COURSES.ai.find(c => c.id === 'hoc-cung-ai');
    const breadcrumbItems = generateBreadcrumbItems('/khoa-hoc/hoc-cung-ai', 'Học cùng AI', 'Khóa học');
    const headerList = await headers();
    const host = headerList.get('host') || 'ai.erg.edu.vn';

    return (
        <>
            {courseData && <SchemaScript type="Course" data={courseData} domain={host} />}
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <AICourseContent />
        </>
    );
}