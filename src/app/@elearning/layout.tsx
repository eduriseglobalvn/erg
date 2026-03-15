// src/app/@elearning/layout.tsx
import React from 'react';
import Header from "@/components/Header"; // Component header hiện tại
import Footer from "@/components/Footer"; // Component footer hiện tại
import FloatingContact from "@/components/FloatingContact";
import { ELEARNING_MENU_ITEMS } from "@/constants/MenuItem";
import { ElearningModalManager } from "@/components/elearning/elearning-modal-manager";

export default function ElearningLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {/* Các component dùng chung cho tất cả trang của elearning domain */}
            <Header menuData={ELEARNING_MENU_ITEMS} />

            {/* Nội dung trang (page.tsx) được bọc trong <main> */}
            <main className="flex-grow pt-[70px] lg:pt-[100px] w-full max-w-[100vw] overflow-hidden min-h-screen bg-white">
                {children}
            </main>

            <FloatingContact />
            <Footer />
            <ElearningModalManager />
        </>
    );
}