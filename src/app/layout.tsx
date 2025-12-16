// src/app/layout.tsx
import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import JsonLd from "@/components/JsonLd"; // Giả sử đã tồn tại
import { GoogleAnalytics } from "@next/third-parties/google";

// Cấu hình Metadata và Viewport (Giữ nguyên)
// ... (Metadata và Viewport code của bạn)
const inter = Inter({ subsets: ["latin", "vietnamese"] });
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://erg.edu.vn";

// Cấu hình viewport (BỎ QUA nếu bạn đã dùng file viewport.ts)
export const viewport: Viewport = { /* ... */ };

// Cấu hình Metadata (BỎ QUA nếu bạn đã dùng file metadata.ts)
export const metadata: Metadata = {
    icons: {
        icon: [
            { url: '/erg.png', sizes: '16x32', type: 'image/png'},
        ],
        apple: [
            { url: '/icon.png' },
        ],
    },
    metadataBase: new URL(BASE_URL),
    title: {
        default: "Trung tâm tin học Giáo dục phát triển toàn cầu",
        template: "%s | Trung tâm tin học Giáo dục phát triển toàn cầu",
    },
    // ... các cấu hình SEO khác
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
        <head>
            {/* THÀNH PHẦN CHUNG CHO TẤT CẢ DOMAIN */}
            {/*<JsonLd />*/}
            <GoogleAnalytics gaId="G-PF00V6RJDD" />
        </head>
        <body
            className={`${inter.className} bg-gray-50 text-slate-800 antialiased flex flex-col min-h-screen overflow-x-hidden`}
            suppressHydrationWarning={true}
        >
        {/* {children} ở đây sẽ là layout của (main)/ hoặc tinhocquocte/ hoặc tuyendung/ */}
        {children}
        </body>
        </html>
    );
}