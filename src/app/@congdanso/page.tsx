import React from 'react';
import { Metadata } from 'next';
import DigitalCitizenshipContent from '@/components/congdanso/DigitalCitizenshipContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { COURSES } from '@/constants/courses';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { createPageMetadata } from '@/utils/seo/page-metadata';


export const metadata: Metadata = {
    ...createPageMetadata({
        title: "Kỹ năng Công dân số: An toàn thông tin cho học sinh | ERG",
        description: "Chương trình Công dân số của ERG trang bị năng lực số toàn diện: an toàn thông tin, bảo mật dữ liệu cá nhân và kỹ năng sử dụng Internet văn minh, hiệu quả.",
        path: "/",
        image: SEO_DATA.congdanso.ogImage,
        imageAlt: "Chương trình Kỹ năng Công dân số tại ERG",
    }),
    title: { absolute: "Kỹ năng Công dân số: An toàn thông tin cho học sinh | ERG" },
};

export default async function DigitalCitizenshipPage() {
  const headerList = await headers();
  const hostname = headerList.get('host') || 'congdanso.erg.edu.vn';
  const courses = COURSES.congdanso;
  const breadcrumbItems = generateBreadcrumbItems('/', 'Trang chủ', 'Công dân số');

  return (
    <>
      {/* WebSite Schema for Search Box */}
      <SchemaScript type="WebSite" data={{ name: SEO_DATA.congdanso.title }} domain={hostname} />

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

      <DigitalCitizenshipContent />
    </>
  );
}