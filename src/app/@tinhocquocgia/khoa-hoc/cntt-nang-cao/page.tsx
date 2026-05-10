import React from 'react';
import { Metadata } from 'next';
import { createPageMetadata } from '@/utils/seo/page-metadata';
import AdvancedITCourseContent from '@/components/tinhocquocgia/AdvancedITCourseContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';
import { COURSES } from '@/constants/courses';

export const metadata: Metadata = createPageMetadata({
    title: 'Khóa học CNTT Nâng cao | Chuẩn Thông tư 03 | ERG',
    description: 'Đào tạo kỹ năng sử dụng CNTT nâng cao: Word, Excel, PowerPoint chuyên sâu. Chuẩn kỹ năng theo Thông tư 03/2014/TT-BTTTT.',
    path: '/khoa-hoc/cntt-nang-cao',
    image: '/util/cnttnc.jpg',
    imageAlt: 'Kh?a h?c CNTT n?ng cao t?i ERG',
});

export default async function Page() {
    const courseData = COURSES.tinhocquocgia.find(c => c.id === 'thnc');
    const breadcrumbItems = generateBreadcrumbItems('/khoa-hoc/cntt-nang-cao', 'CNTT Nâng cao', 'Khóa học');
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocquocgia.erg.edu.vn';

    return (
        <>
            {courseData && <SchemaScript type="Course" data={courseData} domain={host} />}
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <AdvancedITCourseContent />
        </>
    );
}