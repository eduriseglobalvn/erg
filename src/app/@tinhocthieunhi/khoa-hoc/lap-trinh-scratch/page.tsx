import React from 'react';
import { Metadata } from 'next';
import ScratchCourseContent from '@/components/tinhocthieunhi/ScratchCourseContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';
import { COURSES } from '@/constants/courses';

export const metadata: Metadata = {
    title: 'Khóa học Lập trình Scratch cho thiếu nhi | ERG Global',
    description: 'Chương trình lập trình Scratch dành cho học sinh từ Lớp 4. Học tư duy kéo thả, sáng tạo Game và Phim hoạt hình 2D.',
};

export default async function Page() {
    const courseData = COURSES.tinhocthieunhi.find(c => c.id === 'scratch');
    const breadcrumbItems = generateBreadcrumbItems('/khoa-hoc/lap-trinh-scratch', 'Lập trình Scratch', 'Khóa học');
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocthieunhi.erg.edu.vn';

    return (
        <>
            {courseData && <SchemaScript type="Course" data={courseData} domain={host} />}
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <ScratchCourseContent />
        </>
    );
}