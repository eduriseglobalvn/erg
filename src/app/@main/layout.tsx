// src/app/(main)/layout.tsx
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ErgAnnouncementTicker from "@/components/ErgAnnouncementTicker";
// import AdsPopup from "@/components/AdsPopup";
import FloatingContact from "@/components/FloatingContact";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <ErgAnnouncementTicker />
            <main className="flex-grow pt-[114px] lg:pt-[179px] w-full max-w-[100vw] overflow-hidden">
                {children}
            </main>
            {/*<AdsPopup />*/}

            <FloatingContact />
            <Footer />
        </>
    );
}
