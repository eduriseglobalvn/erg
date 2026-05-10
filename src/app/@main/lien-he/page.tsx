import React from 'react';
import { Metadata } from 'next';
import { createPageMetadata } from '@/utils/seo/page-metadata';
import ContactContent from '@/components/contact/ContactContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = createPageMetadata({
    title: 'Liên hệ',
    description: 'Liên hệ với ERG Global để được tư vấn các khóa học Tin học Quốc tế, Tin học Quốc gia, STEM và các giải pháp đào tạo CNTT.',
    path: '/lien-he',
    imageAlt: 'Li?n h? ERG',
});

export default async function Page() {
    const breadcrumbItems = generateBreadcrumbItems('/lien-he', 'Liên hệ', 'Trang chủ');
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <ContactContent />
        </>
    );
}