import React from 'react';
import { Metadata } from 'next';
import InternationalItContent from '@/components/tinhocquocte/InternationalItContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { COURSES } from '@/constants/courses';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { createPageMetadata } from '@/utils/seo/page-metadata';

export const revalidate = 300;


export const metadata: Metadata = {
    ...createPageMetadata({
        title: "Luyện thi chứng chỉ tin học quốc tế MOS, IC3 | ERG",
        description: "ERG tổ chức luyện thi và thi chứng chỉ tin học văn phòng quốc tế MOS, IC3 GS6, IC3 Spark theo chuẩn Certiport, với lộ trình rõ ràng cho học sinh và người đi làm.",
        path: "/",
        image: SEO_DATA.tinhocquocte.ogImage,
        imageAlt: "Luyện thi chứng chỉ tin học quốc tế MOS, IC3 tại ERG",
    }),
    title: { absolute: "Luyện thi chứng chỉ tin học quốc tế MOS, IC3 | ERG" },
};

export default async function InternationalItPage() {
  const headerList = await headers();
  const hostname = headerList.get('host') || 'tinhocquocte.erg.edu.vn';
  const courses = COURSES.tinhocquocte;
  const breadcrumbItems = generateBreadcrumbItems('/', 'Trang chủ', 'Tin học Quốc tế');

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
        data={{
          items: breadcrumbItems
        }}
        domain={hostname}
      />

      <InternationalItContent />
    </>
  );
}