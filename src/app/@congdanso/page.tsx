import React from 'react';
import { Metadata } from 'next';
import DigitalCitizenshipContent from '@/components/congdanso/DigitalCitizenshipContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { COURSES } from '@/constants/courses';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';


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