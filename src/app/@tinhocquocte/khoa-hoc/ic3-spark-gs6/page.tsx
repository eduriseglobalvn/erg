import React from 'react';
import { Metadata } from 'next';
import IC3SparkCourseContent from '@/components/tinhocquocte/IC3SparkCourseContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';
import { pagesApi } from '@/services/pages.api';
import { COURSES } from '@/constants/courses';
import { REAL_IMAGES } from '@/mocks/imageGalerry';
import { generateFullMetadata } from '@/utils/seo/seo-metadata';
import { SEO_DATA } from '@/constants/seo.constants';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const pageData = await pagesApi.getPage('ic3-spark-gs6');
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocquocte.erg.edu.vn';

    const fallbackOgImage = SEO_DATA.tinhocquocte.ogImage;

    return generateFullMetadata({
        title: pageData?.metaTitle || "IC3 Spark Global Standard 6 | Tin học Tiểu học ERG",
        description: pageData?.metaDescription || "Chứng chỉ tin học quốc tế IC3 Spark dành cho học sinh tiểu học. Xây dựng nền tảng công nghệ an toàn.",
        images: pageData?.thumbnail ? [pageData.thumbnail] : [fallbackOgImage],
        path: '/khoa-hoc/ic3-spark-gs6',
        host,
    });
}

export default async function Page() {
    const pageData = await pagesApi.getPage('ic3-spark-gs6');
    const courseData = COURSES.tinhocquocte.find(c => c.id === 'ic3-gs6-spark');
    const breadcrumbItems = generateBreadcrumbItems('/khoa-hoc/ic3-spark-gs6', 'IC3 Spark', 'Khóa học');
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocquocte.erg.edu.vn';

    const galleryImages = pageData?.gallery && pageData.gallery.length > 0
        ? pageData.gallery.map((url: string) => ({ src: url, alt: "IC3 Spark Class" }))
        : REAL_IMAGES;

    return (
        <>
            {courseData && <SchemaScript type="Course" data={courseData} domain={host} />}
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <IC3SparkCourseContent pageData={pageData} galleryImages={galleryImages} />
        </>
    );
}
