import React from 'react';
import { Metadata } from 'next';
import IC3GS6CourseContent from '@/components/tinhocquocte/IC3GS6CourseContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';
import { pagesApi } from '@/services/pages.api';
import { COURSES } from '@/constants/courses';
import { REAL_IMAGES } from '@/mocks/imageGalerry';

export async function generateMetadata(): Promise<Metadata> {
    const pageData = await pagesApi.getPage('ic3-gs6');

    return {
        title: pageData?.metaTitle || "IC3 Digital Literacy Global Standard 6 | ERG",
        description: pageData?.metaDescription || "Đào tạo chứng chỉ IC3 GS6 chuẩn quốc tế về kỹ năng sử dụng máy tính và internet.",
        openGraph: {
            title: pageData?.metaTitle,
            description: pageData?.metaDescription,
            images: pageData?.thumbnail ? [pageData.thumbnail] : [],
        }
    };
}

export default async function Page() {
    const pageData = await pagesApi.getPage('ic3-gs6');
    const courseData = COURSES.tinhocquocte.find(c => c.id === 'ic3-gs6');
    const breadcrumbItems = generateBreadcrumbItems('/khoa-hoc/ic3-gs6', 'IC3 GS6', 'Khóa học');
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocquocte.erg.edu.vn';

    const galleryImages = pageData?.gallery && pageData.gallery.length > 0
        ? pageData.gallery.map((url: string) => ({ src: url, alt: "IC3 Class" }))
        : REAL_IMAGES;

    return (
        <>
            {courseData && <SchemaScript type="Course" data={courseData} domain={host} />}
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            {courseData?.faqs && (
                <SchemaScript
                    type="FAQPage"
                    data={{ questions: courseData.faqs }}
                    domain={host}
                />
            )}
            <IC3GS6CourseContent pageData={pageData} galleryImages={galleryImages} />
        </>
    );
}