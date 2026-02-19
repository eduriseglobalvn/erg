import React from 'react';
import { Metadata } from 'next';
import MainContent from '@/components/marketing/MainContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';


export default async function Home() {
    const currentSeo = SEO_DATA.main;
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';

    return (
        <>
            {/* Schema SEO */}
            <SchemaScript type="Organization" data={{}} domain={host} />
            <SchemaScript type="WebSite" data={{ name: currentSeo.title }} domain={host} />

            {/* Main Content */}
            <MainContent />
        </>
    );
}