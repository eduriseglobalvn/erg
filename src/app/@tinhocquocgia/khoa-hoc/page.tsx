import React from 'react';
import { Metadata } from 'next';
import { COURSES } from '@/constants/courses';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';
import CoursesPageContent from '@/components/tinhocquocgia/CoursesPageContent';

export async function generateMetadata(): Promise<Metadata> {
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocquocgia.erg.edu.vn';

    return {
        title: 'Chương trình Đào tạo Tin học Quốc gia | ERG',
        description: 'Danh sách các khóa học tin học chuẩn quốc gia Thông tư 03: CNTT Cơ bản, CNTT Nâng cao, Luyện thi cấp tốc.',
        alternates: {
            canonical: `https://${host}/khoa-hoc`,
        },
        openGraph: {
            title: 'Chương trình Đào tạo Tin học Quốc gia | ERG',
            description: 'Danh sách các khóa học tin học chuẩn quốc gia Thông tư 03: CNTT Cơ bản, CNTT Nâng cao, Luyện thi cấp tốc.',
            type: 'website',
        },
    };
}

export default async function CoursesPage() {
    const headerList = await headers();
    const hostname = headerList.get('host') || 'tinhocquocgia.erg.edu.vn';
    const courses = COURSES.tinhocquocgia;

    const breadcrumbItems = generateBreadcrumbItems('/khoa-hoc', 'Chương trình đào tạo', 'Trang chủ');

    return (
        <>
            {/* Course Schemas */}
            {courses.map((course) => (
                <SchemaScript
                    key={course.id}
                    type="Course"
                    data={course}
                    domain={hostname}
                />
            ))}

            {/* Breadcrumb Schema */}
            <SchemaScript
                type="BreadcrumbList"
                data={{ items: breadcrumbItems }}
                domain={hostname}
            />

            <CoursesPageContent courses={courses} />
        </>
    );
}