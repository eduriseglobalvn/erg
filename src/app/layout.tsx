import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { headers } from "next/headers";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

// Lấy BASE_URL từ env, fallback an toàn cho SEO
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://erg.edu.vn";

import { SEO_DATA, BRAND_SUFFIX } from "@/constants/seo.constants";

// Helper to get subdomain logic (shared with RootLayout)
function getSubdomain(hostname: string, rootDomain: string) {
    if (!hostname || hostname === rootDomain) return "";
    return hostname.replace(`.${rootDomain}`, "").split(":")[0];
}

export async function generateMetadata(): Promise<Metadata> {
    const headerList = await headers();
    const hostname = (headerList.get("host") || "").split(":")[0];
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'erg.edu.local';
    const subdomain = getSubdomain(hostname, rootDomain);

    // Xác định bộ dữ liệu SEO dựa trên subdomain
    // Phải ép kiểu subdomain về keyof typeof SEO_DATA hoặc fallback về main
    const seoKey = (subdomain && subdomain in SEO_DATA) ? (subdomain as keyof typeof SEO_DATA) : 'main';
    const currentSeo = SEO_DATA[seoKey];

    const title = currentSeo.title;
    const description = currentSeo.description;
    const keywords = currentSeo.keywords;
    const ogImage = currentSeo.ogImage;

    // Exclude admin from SEO
    const robots = subdomain === 'admin' ? { index: false, follow: false } : undefined;

    return {
        icons: {
            icon: [{ url: '/erg.png', sizes: '16x32', type: 'image/png' }],
            apple: [{ url: '/erg.png' }],
        },
        metadataBase: new URL(BASE_URL),
        robots,
        title: {
            default: title,
            template: `%s | Edurise Global`,
        },
        description,
        keywords: keywords.join(", "),
        openGraph: {
            type: 'website',
            locale: 'vi_VN',
            url: BASE_URL,
            siteName: 'Edurise Global',
            title: subdomain ? `${title} | Edurise Global` : title,
            description,
            images: [
                {
                    url: ogImage,
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
            title: subdomain ? `${title} | Edurise Global` : title,
            description,
            images: [ogImage],
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
    admin: React.ReactNode;
}) {
    // 1. Lấy Hostname thực tế từ Request
    const headerList = await headers();
    let hostname = headerList.get("host") || "";

    // 2. Lấy Root Domain (Quan trọng để tách subdomain)
    // Local: erg.edu.local | Prod: erg.edu.vn
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'erg.edu.local';

    // Làm sạch hostname (bỏ port :3000 nếu có)
    hostname = hostname.split(":")[0];

    // 3. Tách subdomain
    let subdomain = "";
    if (hostname.endsWith(`.${rootDomain}`)) {
        subdomain = hostname.replace(`.${rootDomain}`, "");
    }

    // 4. Quyết định hiển thị Slot nào dựa trên subdomain tĩnh
    let content;
    switch (subdomain) {
        case 'ai': content = props.ai; break;
        case 'tinhocquocte': content = props.tinhocquocte; break;
        case 'tinhocquocgia': content = props.tinhocquocgia; break;
        case 'tinhocthieunhi': content = props.tinhocthieunhi; break;
        case 'congdanso': content = props.congdanso; break;
        case 'dientoandammay': content = props.dientoandammay; break;
        case 'tuyendung': content = props.tuyendung; break;
        case 'admin': content = props.admin; break;
        case '':
        case 'www':
            content = props.main; break;
        default:
            content = props.main; // Fallback về trang chủ nếu subdomain lạ
    }

    // --- SCHEMA DATA (JSON-LD) ---
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "EducationOrganization",
        "name": "EDURISE GLOBAL",
        "url": BASE_URL,
        "logo": `${BASE_URL}/erg.png`,
        "sameAs": [
            "https://www.facebook.com/eduriseglobal",
            "https://www.youtube.com/@eduriseglobal"
        ],
        "description": "Hệ thống đào tạo tin học quốc tế chuẩn MOS, IC3 và AI."
    };

    const navSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
            { "@type": "SiteNavigationElement", "position": 1, "name": SEO_DATA.main.navName, "url": BASE_URL },
            { "@type": "SiteNavigationElement", "position": 2, "name": SEO_DATA.tinhocquocte.navName, "url": BASE_URL.replace('://', '://tinhocquocte.') },
            { "@type": "SiteNavigationElement", "position": 3, "name": SEO_DATA.ai.navName, "url": BASE_URL.replace('://', '://ai.') },
            { "@type": "SiteNavigationElement", "position": 4, "name": SEO_DATA.tinhocquocgia.navName, "url": BASE_URL.replace('://', '://tinhocquocgia.') },
            { "@type": "SiteNavigationElement", "position": 5, "name": SEO_DATA.tinhocthieunhi.navName, "url": BASE_URL.replace('://', '://tinhocthieunhi.') },
            { "@type": "SiteNavigationElement", "position": 6, "name": SEO_DATA.congdanso.navName, "url": BASE_URL.replace('://', '://congdanso.') },
            { "@type": "SiteNavigationElement", "position": 7, "name": SEO_DATA.dientoandammay.navName, "url": BASE_URL.replace('://', '://dientoandammay.') },
            { "@type": "SiteNavigationElement", "position": 8, "name": SEO_DATA.tuyendung.navName, "url": BASE_URL.replace('://', '://tuyendung.') },
            { "@type": "SiteNavigationElement", "position": 9, "name": "Liên hệ Tư vấn", "url": `${BASE_URL}/lien-he` }
        ]
    };

    return (
        <html lang="vi" suppressHydrationWarning>
            <head>
                <GoogleAnalytics gaId="G-PF00V6RJDD" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(navSchema) }}
                />
            </head>
            <body
                className={`${inter.className} bg-gray-50 text-slate-800 antialiased flex flex-col min-h-screen overflow-x-hidden`}
                suppressHydrationWarning={true}
            >
                <AnalyticsTracker />

                {/* Render Slot tương ứng */}
                <QueryProvider>
                    {content}
                </QueryProvider>

                {/* props.children là bắt buộc trong cấu trúc Next.js nhưng sẽ rỗng ở đây */}
                {/* {props.children} */}
            </body>
        </html>
    );
}