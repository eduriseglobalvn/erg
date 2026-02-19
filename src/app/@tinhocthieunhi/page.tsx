import React from 'react';
import { Metadata } from 'next';
import KidsCodingContent from '@/components/tinhocthieunhi/KidsCodingContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { COURSES } from '@/constants/courses';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';


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