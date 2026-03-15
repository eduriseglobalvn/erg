// src/app/@elearning/layout.tsx
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ELEARNING_MENU_ITEMS } from "@/constants/MenuItem";
import { ElearningModalManager } from "@/components/elearning/elearning-modal-manager";

export default function ElearningLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {/* Header không có top bar, không có FloatingContact */}
            <Header menuData={ELEARNING_MENU_ITEMS} hideTopBar />

            <main className="flex-grow pt-[70px] lg:pt-[80px] w-full max-w-[100vw] overflow-hidden min-h-screen bg-white">
                {children}
            </main>

            <Footer />
            <ElearningModalManager />
        </>
    );
}
