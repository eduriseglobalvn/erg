import React from "react";
import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono, Oswald } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { headers, cookies } from "next/headers";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { ConsentBanner } from "@/components/ConsentBanner";
import { QueryProvider } from "@/providers/query-provider";
import { QueryDevtoolsWrapper } from "@/components/debug/query-devtools-wrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({
    subsets: ["latin", "vietnamese"],
    variable: "--font-inter",
    display: "swap",
});

const lora = Lora({
    subsets: ["latin", "vietnamese"],
    variable: "--font-lora",
    display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});

const oswald = Oswald({
    subsets: ["latin", "vietnamese"],
    variable: "--font-oswald",
    display: "swap",
});

import { SEO_DATA } from "@/constants/seo.constants";
import { SchemaScript } from "@/components/seo/schema-script";
import { MAIN_MENU_ITEMS } from "@/constants/MenuItem";
import { Toaster } from "sonner";
import { RedirectNotification } from "@/components/shared/redirect-notification";
import { OfflineIndicator } from "@/components/shared/offline-indicator";
import { SearchEngineMeta } from "@/components/seo/search-engine-meta";
import { resolveSiteContextFromHeaders } from "@/lib/site-context";
import { SlotDefault } from "./slot-default";

function isSlotDefault(slot: React.ReactNode) {
    return React.isValidElement(slot) && slot.type === SlotDefault;
}

export async function generateMetadata(): Promise<Metadata> {
    const headerList = await headers();
    const siteContext = resolveSiteContextFromHeaders(headerList);
    const seoKey = (siteContext.siteKey in SEO_DATA
        ? siteContext.siteKey
        : 'main') as keyof typeof SEO_DATA;

    const currentSeo = SEO_DATA[seoKey];

    const robots = siteContext.isAdmin ? { index: false, follow: false } : undefined;

    return {
        icons: {
            shortcut: 'https://media.erg.edu.vn/logo/erg.png',
            icon: [
                { url: 'https://media.erg.edu.vn/logo/erg.png', sizes: '16x16', type: 'image/png' },
                { url: 'https://media.erg.edu.vn/logo/erg.png', sizes: '32x32', type: 'image/png' },
                { url: 'https://media.erg.edu.vn/logo/erg.png', sizes: '96x96', type: 'image/png' },
            ],
            apple: [{ url: 'https://media.erg.edu.vn/logo/erg.png', sizes: '180x180', type: 'image/png' }],
        },
        metadataBase: new URL(siteContext.baseUrl),
        robots,
        title: {
            default: currentSeo.title,
            template: `%s | ${siteContext.isRoot ? 'Trung Tâm Ngoai Ngu Tin Hoc ERG' : 'ERG'}`,
        },
        description: currentSeo.description,
        keywords: currentSeo.keywords.join(", "),
        openGraph: {
            type: 'website',
            locale: 'vi_VN',
            url: siteContext.baseUrl,
            siteName: 'Edurise Global',
            title: siteContext.isRoot
                ? `${currentSeo.title} | Edurise Global`
                : currentSeo.title,
            description: currentSeo.description,
            images: [
                {
                    url: currentSeo.ogImage,
                    width: 1200,
                    height: 630,
                    alt: 'Edurise Global - Kiến tạo tương lai số',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            site: '@eduriseglobal',
            creator: '@eduriseglobal',
            title: siteContext.isRoot
                ? currentSeo.title
                : `${currentSeo.title} | Edurise Global`,
            description: currentSeo.description,
            images: [currentSeo.ogImage],
        },
    };
}

export default async function RootLayout(props: {
    children: React.ReactNode;
    main: React.ReactNode;
    ai: React.ReactNode;
    tinhocquocte: React.ReactNode;
    tinhocquocgia: React.ReactNode;
    tinhocthieunhi: React.ReactNode;
    congdanso: React.ReactNode;
    dientoandammay: React.ReactNode;
    tuyendung: React.ReactNode;
    elearning: React.ReactNode;
    admin: React.ReactNode;
    noibo: React.ReactNode;
}) {
    const [headerList, cookieStore] = await Promise.all([
        headers(),
        cookies(),
    ]);
    const siteContext = resolveSiteContextFromHeaders(headerList);
    const seoKey = (siteContext.siteKey in SEO_DATA
        ? siteContext.siteKey
        : 'main') as keyof typeof SEO_DATA;
    const slotOrChildren = (slot: React.ReactNode) => (slot == null || isSlotDefault(slot) ? props.children : slot);

    let content;
    let currentMenu = MAIN_MENU_ITEMS;

    const {
        THQT_MENU_ITEMS, THQG_MENU_ITEMS, THTN_MENU_ITEMS,
        CDS_MENU_ITEMS, DTDM_MENU_ITEMS, AI_MENU_ITEMS, TUYEN_DUNG_MENU_ITEMS, ELEARNING_MENU_ITEMS
    } = await import("@/constants/MenuItem");

    switch (siteContext.siteKey) {
        case 'ai':
            content = slotOrChildren(props.ai);
            currentMenu = AI_MENU_ITEMS;
            break;
        case 'tinhocquocte':
            content = slotOrChildren(props.tinhocquocte);
            currentMenu = THQT_MENU_ITEMS;
            break;
        case 'tinhocquocgia':
            content = slotOrChildren(props.tinhocquocgia);
            currentMenu = THQG_MENU_ITEMS;
            break;
        case 'tinhocthieunhi':
            content = slotOrChildren(props.tinhocthieunhi);
            currentMenu = THTN_MENU_ITEMS;
            break;
        case 'congdanso':
            content = slotOrChildren(props.congdanso);
            currentMenu = CDS_MENU_ITEMS;
            break;
        case 'dientoandammay':
            content = slotOrChildren(props.dientoandammay);
            currentMenu = DTDM_MENU_ITEMS;
            break;
        case 'tuyendung':
            content = slotOrChildren(props.tuyendung);
            currentMenu = TUYEN_DUNG_MENU_ITEMS;
            break;
        case 'elearning':
        case 'elerning':
            content = slotOrChildren(props.elearning);
            currentMenu = ELEARNING_MENU_ITEMS;
            break;
        case 'noibo':
            content = slotOrChildren(props.noibo);
            break;
        case 'admin':
            content = slotOrChildren(props.admin);
            break;
        case '':
        case 'www':
            content = slotOrChildren(props.main);
            currentMenu = MAIN_MENU_ITEMS;
            break;
        default:
            content = slotOrChildren(props.main);
    }

    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'vi';
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${lora.variable} ${jetBrainsMono.variable} ${oswald.variable}`}>
            <head>
                <GoogleAnalytics gaId="G-PF00V6RJDD" />
                <SearchEngineMeta subdomain={siteContext.siteKey} />
            </head>
            <body
                className={`${inter.className} bg-gray-50 text-slate-800 antialiased flex flex-col min-h-screen overflow-x-hidden`}
                suppressHydrationWarning={true}
            >
                <QueryProvider>
                    <QueryDevtoolsWrapper />
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <AnalyticsTracker />
                        <ConsentBanner />
                        <Toaster position="top-center" richColors />
                        <React.Suspense fallback={null}>
                            <RedirectNotification />
                        </React.Suspense>
                        <OfflineIndicator />

                        <SchemaScript type="Organization" data={{}} domain={siteContext.hostname} />
                        <SchemaScript
                            type="WebSite"
                            data={{ name: SEO_DATA[seoKey]?.title || "Edurise Global" }}
                            domain={siteContext.hostname}
                        />
                        <SchemaScript
                            type="SiteNavigationElement"
                            data={currentMenu}
                            domain={siteContext.hostname}
                        />

                        <NextTopLoader color="#00008b" showSpinner={false} />

                        {content}

                        <SpeedInsights />
                        <Analytics />
                    </NextIntlClientProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
