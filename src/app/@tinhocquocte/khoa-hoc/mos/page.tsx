import React from 'react';
import { Metadata } from 'next';
import MOSCourseContent from '@/components/tinhocquocte/MOSCourseContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';
import { pagesApi } from '@/services/pages.api';
import { COURSES } from '@/constants/courses';
import { REAL_IMAGES } from '@/mocks/imageGalerry';
import { generateFullMetadata } from '@/utils/seo/seo-metadata';
import { SEO_DATA } from '@/constants/seo.constants';

export async function generateMetadata(): Promise<Metadata> {
    const pageData = await pagesApi.getPage('mos');
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocquocte.erg.edu.vn';

    const fallbackOgImage = SEO_DATA.tinhocquocte.ogImage;

    return generateFullMetadata({
        title: pageData?.metaTitle || "Microsoft Office Specialist (MOS)",
        description: pageData?.metaDescription || "Chứng chỉ tin học văn phòng quốc tế MOS.",
        images: pageData?.thumbnail ? [pageData.thumbnail] : [fallbackOgImage],
        path: '/khoa-hoc/mos',
        host,
    });
}

export default async function Page() {
    const pageData = await pagesApi.getPage('mos');
    const courseData = COURSES.tinhocquocte.find(c => c.id === 'mos');
    const breadcrumbItems = generateBreadcrumbItems('/khoa-hoc/mos', 'MOS', 'Khóa học');
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocquocte.erg.edu.vn';

    const galleryImages = pageData?.gallery && pageData.gallery.length > 0
        ? pageData.gallery.map((url: string) => ({ src: url, alt: "MOS Class" }))
        : REAL_IMAGES;

    return (
        <>
            {courseData && <SchemaScript type="Course" data={courseData} domain={host} />}
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <MOSCourseContent pageData={pageData} galleryImages={galleryImages} />
        </>
    );
}