import React from 'react';
import { Metadata } from 'next';
import CloudComputingContent from '@/components/dientoandammay/CloudComputingContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { COURSES } from '@/constants/courses';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { createPageMetadata } from '@/utils/seo/page-metadata';


export const metadata: Metadata = {
    ...createPageMetadata({
        title: "Đào tạo Điện toán đám mây (Cloud) AWS, Azure | ERG",
        description: "ERG đào tạo Điện toán đám mây (Cloud Computing) trên nền tảng AWS và Azure, mở ra cơ hội nghề nghiệp cho kỹ sư hệ thống và DevOps trong kỷ nguyên số.",
        path: "/",
        image: SEO_DATA.dientoandammay.ogImage,
        imageAlt: "Khóa học Điện toán đám mây AWS, Azure tại ERG",
    }),
    title: { absolute: "Đào tạo Điện toán đám mây (Cloud) AWS, Azure | ERG" },
};

export default async function CloudComputingPage() {
  const headerList = await headers();
  const hostname = headerList.get('host') || 'dientoandammay.erg.edu.vn';
  const courses = COURSES.dientoandammay;
  const breadcrumbItems = generateBreadcrumbItems('/', 'Trang chủ', 'Điện toán đám mây');

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

      <CloudComputingContent />
    </>
  );
}