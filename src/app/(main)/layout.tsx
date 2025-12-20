// src/app/(main)/layout.tsx
import React from 'react';
import Header from "@/components/Header"; // Giả sử component Header đã được tạo
import Footer from "@/components/Footer"; // Giả sử component Footer đã được tạo
// import AdsPopup from "@/components/AdsPopup";
import FloatingContact from "@/components/FloatingContact";

export default function MainLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {/* CÁC COMPONENT DÙNG CHUNG CHO TẤT CẢ TRANG CỦA MAIN DOMAIN */}
            <Header />
            {/*<AdsPopup />*/}

            {/* Nội dung trang (page.tsx) được bọc trong <(main)> */}
            <main className="flex-grow pt-[65px] lg:pt-[88px] w-full max-w-[100vw] overflow-hidden">
                {children}
            </main>

            <FloatingContact />
            <Footer />
        </>
    );
}