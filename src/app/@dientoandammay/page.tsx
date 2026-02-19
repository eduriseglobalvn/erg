import React from 'react';
import { Metadata } from 'next';
import CloudComputingContent from '@/components/dientoandammay/CloudComputingContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { COURSES } from '@/constants/courses';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';


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