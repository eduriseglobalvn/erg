import React from 'react';
import { Metadata } from 'next';
import PythonCourseContent from '@/components/tinhocthieunhi/PythonCourseContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';
import { COURSES } from '@/constants/courses';

export const metadata: Metadata = {
    title: 'Khóa học Lập trình Python thiếu nhi | ERG Global',
    description: 'Chương trình lập trình Python dành cho học sinh từ lớp 6 trở lên. Rèn luyện tư duy logic, tiếp cận ngôn ngữ lập trình thực tế số 1 thế giới.',
};

export default async function Page() {
    const courseData = COURSES.tinhocthieunhi.find(c => c.id === 'python-kids');
    const breadcrumbItems = generateBreadcrumbItems('/khoa-hoc/lap-trinh-python-thieu-nhi', 'Lập trình Python', 'Khóa học');
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocthieunhi.erg.edu.vn';

    return (
        <>
            {courseData && <SchemaScript type="Course" data={courseData} domain={host} />}
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <PythonCourseContent />
        </>
    );
}