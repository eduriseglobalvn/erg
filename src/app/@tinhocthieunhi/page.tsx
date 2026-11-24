import React from 'react';
import { Metadata } from 'next';
import KidsCodingContent from '@/components/tinhocthieunhi/KidsCodingContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { COURSES } from '@/constants/courses';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { createPageMetadata } from '@/utils/seo/page-metadata';


export const metadata: Metadata = {
    ...createPageMetadata({
        title: "Tin học thiếu nhi: lập trình Scratch, Python cho bé | ERG",
        description: "Khóa học tin học thiếu nhi tại ERG: lập trình Scratch, Python và Robotics theo phương pháp STEAM, giúp trẻ phát triển tư duy logic và đam mê công nghệ từ sớm.",
        path: "/",
        image: SEO_DATA.tinhocthieunhi.ogImage,
        imageAlt: "Lớp lập trình Scratch, Python cho trẻ em tại ERG",
    }),
    title: { absolute: "Tin học thiếu nhi: lập trình Scratch, Python cho bé | ERG" },
};

export default async function KidsCodingPage() {
  const headerList = await headers();
  const hostname = headerList.get('host') || 'tinhocthieunhi.erg.edu.vn';
  const courses = COURSES.tinhocthieunhi;
  const breadcrumbItems = generateBreadcrumbItems('/', 'Trang chủ', 'Tin học thiếu nhi');

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

      <KidsCodingContent />
    </>
  );
}