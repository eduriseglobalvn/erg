import React from 'react';
import { Metadata } from 'next';
import MainContent from '@/components/marketing/MainContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { resolveSiteContextFromHeaders } from '@/lib/site-context';
import { createPageMetadata } from '@/utils/seo/page-metadata';

export const metadata: Metadata = {
    ...createPageMetadata({
        title: "Trung Tâm Ngoại Ngữ - Tin Học ERG | Luyện thi MOS, IC3, IELTS",
        description: "Trung Tâm Ngoại Ngữ - Tin Học ERG đào tạo và tổ chức thi chứng chỉ quốc tế MOS, IC3, IELTS, cùng các khóa học lập trình và kỹ năng số chuẩn quốc tế.",
        path: "/",
        image: SEO_DATA.main.ogImage,
        imageAlt: "Trung tâm Ngoại ngữ - Tin học ERG",
    }),
    title: { absolute: "Trung Tâm Ngoại Ngữ - Tin Học ERG | Luyện thi MOS, IC3, IELTS" },
};

export default async function Home() {
    const currentSeo = SEO_DATA.main;
    const headerList = await headers();
    const siteContext = resolveSiteContextFromHeaders(headerList);

    return (
        <>
            <SchemaScript type="Organization" data={{}} domain={siteContext.hostname} />
            <SchemaScript type="WebSite" data={{ name: currentSeo.title }} domain={siteContext.hostname} />
            <MainContent />
        </>
    );
}
