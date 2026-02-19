import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Lora, JetBrains_Mono, Oswald } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { headers } from "next/headers";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { QueryProvider } from "@/providers/query-provider";

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

// Lấy BASE_URL từ env, fallback an toàn cho SEO
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://erg.edu.vn";

import { SEO_DATA, BRAND_SUFFIX } from "@/constants/seo.constants";
import { SchemaScript } from "@/components/seo/schema-script";
import { MAIN_MENU_ITEMS } from "@/constants/MenuItem";
import { Toaster } from "sonner";
import { RedirectNotification } from "@/components/shared/redirect-notification";

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

    // Dynamic Metadata Base
    const baseUrl = subdomain && subdomain !== 'www'
        ? `https://${subdomain}.erg.edu.vn`
        : BASE_URL;

    return {
        icons: {
            icon: [{ url: 'https://media.erg.edu.vn/logo/erg.png', sizes: '16x32', type: 'image/png' }],
            apple: [{ url: 'https://media.erg.edu.vn/logo/erg.png' }],
        },
        metadataBase: new URL(baseUrl),
        robots,
        title: {
            default: title,
            // Nếu title con chưa có suffix, Next.js sẽ tự thêm. 
            // Nhưng thiết kế mới: Page con sẽ tự define title tuyệt đối (absolute) để tránh lặp.
            template: `%s | ${subdomain ? 'ERG' : 'Trung Tâm Ngoại Ngữ Tin Học ERG'}`,
        },
        description,
        keywords: keywords.join(", "),
        openGraph: {
            type: 'website',
            locale: 'vi_VN',
            url: baseUrl,
            siteName: 'Edurise Global',
            title: subdomain ? title : `${title} | Edurise Global`,
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
    let currentMenu = MAIN_MENU_ITEMS;

    // Import thêm các menu constants
    const {
        THQT_MENU_ITEMS, THQG_MENU_ITEMS, THTN_MENU_ITEMS,
        CDS_MENU_ITEMS, DTDM_MENU_ITEMS, AI_MENU_ITEMS, TUYEN_DUNG_MENU_ITEMS
    } = await import("@/constants/MenuItem");

    switch (subdomain) {
        case 'ai':
            content = props.ai;
            currentMenu = AI_MENU_ITEMS;
            break;
        case 'tinhocquocte':
            content = props.tinhocquocte;
            currentMenu = THQT_MENU_ITEMS;
            break;
        case 'tinhocquocgia':
            content = props.tinhocquocgia;
            currentMenu = THQG_MENU_ITEMS;
            break;
        case 'tinhocthieunhi':
            content = props.tinhocthieunhi;
            currentMenu = THTN_MENU_ITEMS;
            break;
        case 'congdanso':
            content = props.congdanso;
            currentMenu = CDS_MENU_ITEMS;
            break;
        case 'dientoandammay':
            content = props.dientoandammay;
            currentMenu = DTDM_MENU_ITEMS;
            break;
        case 'tuyendung':
            content = props.tuyendung;
            currentMenu = TUYEN_DUNG_MENU_ITEMS;
            break;
        case 'admin': content = props.admin; break;
        case '':
        case 'www':
            content = props.main;
            currentMenu = MAIN_MENU_ITEMS;
            break;
        default:
            content = props.main; // Fallback về trang chủ nếu subdomain lạ
    }

    // --- SCHEMA DATA (JSON-LD) ---
    // Sử dụng SchemaScript component mới để quản lý tập trung
    // Chỉ render các Schema cơ bản cấp Site tại đây. Các Schema chi tiết (Article, Course) sẽ nằm ở page.tsx

    return (
        <html lang="vi" suppressHydrationWarning className={`${inter.variable} ${lora.variable} ${jetBrainsMono.variable} ${oswald.variable}`}>
            <head>
                <GoogleAnalytics gaId="G-PF00V6RJDD" />
            </head>
            <body
                className={`${inter.className} bg-gray-50 text-slate-800 antialiased flex flex-col min-h-screen overflow-x-hidden`}
                suppressHydrationWarning={true}
            >
                <AnalyticsTracker />
                <Toaster position="top-center" richColors />
                <React.Suspense fallback={null}>
                    <RedirectNotification />
                </React.Suspense>

                {/* Global Schemas */}
                <SchemaScript type="Organization" data={{}} domain={hostname} />
                <SchemaScript type="WebSite" data={{ name: SEO_DATA[subdomain as keyof typeof SEO_DATA]?.title || "Edurise Global" }} domain={hostname} />

                {/* Sitelinks Navigation Schema */}
                <SchemaScript type="SiteNavigationElement" data={currentMenu} domain={hostname} />

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