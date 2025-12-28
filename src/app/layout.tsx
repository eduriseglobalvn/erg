import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

// Lấy BASE_URL từ env, fallback an toàn cho SEO
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://erg.edu.vn";

export const metadata: Metadata = {
    icons: {
        icon: [{ url: '/erg.png', sizes: '16x32', type: 'image/png' }],
        apple: [{ url: '/icon.png' }],
    },
    metadataBase: new URL(BASE_URL),
    title: {
        default: "Trung tâm tin học Giáo dục phát triển toàn cầu",
        template: "%s | Trung tâm tin học Giáo dục phát triển toàn cầu",
    },
};

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
        case '': 
        case 'www': 
            content = props.main; break;
        default: 
            content = props.main; // Fallback về trang chủ nếu subdomain lạ
    }

    return (
        <html lang="vi">
            <head>
                <GoogleAnalytics gaId="G-PF00V6RJDD" />
            </head>
            <body
                className={`${inter.className} bg-gray-50 text-slate-800 antialiased flex flex-col min-h-screen overflow-x-hidden`}
                suppressHydrationWarning={true}
            >
                {/* Render Slot tương ứng */}
                {content}
                
                {/* props.children là bắt buộc trong cấu trúc Next.js nhưng sẽ rỗng ở đây */}
                {/* {props.children} */}
            </body>
        </html>
    );
}