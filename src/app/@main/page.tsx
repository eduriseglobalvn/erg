import React from 'react';
import { Metadata } from 'next';
import MainContent from '@/components/marketing/MainContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { resolveSiteContextFromHeaders } from '@/lib/site-context';

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
