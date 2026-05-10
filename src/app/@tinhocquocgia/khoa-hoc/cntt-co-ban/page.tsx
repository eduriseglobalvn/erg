import React from 'react';
import { Metadata } from 'next';
import { createPageMetadata } from '@/utils/seo/page-metadata';
import BasicITCourseContent from '@/components/tinhocquocgia/BasicITCourseContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';
import { COURSES } from '@/constants/courses';

export const metadata: Metadata = createPageMetadata({
    title: 'Khóa học CNTT Cơ bản | Chuẩn Thông tư 03 | ERG',
    description: 'Đào tạo kỹ năng sử dụng CNTT cơ bản: Windows, Word, Excel, PowerPoint. Chuẩn kỹ năng theo Thông tư 03/2014/TT-BTTTT.',
    path: '/khoa-hoc/cntt-co-ban',
    image: '/util/cnttcb.jpg',
    imageAlt: 'Kh?a h?c CNTT c? b?n t?i ERG',
});

export default async function Page() {
    const courseData = COURSES.tinhocquocgia.find(c => c.id === 'thcb');
    const breadcrumbItems = generateBreadcrumbItems('/khoa-hoc/cntt-co-ban', 'CNTT Cơ bản', 'Khóa học');
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocquocgia.erg.edu.vn';

    return (
        <>
            {courseData && <SchemaScript type="Course" data={courseData} domain={host} />}
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <BasicITCourseContent />
        </>
    );
}