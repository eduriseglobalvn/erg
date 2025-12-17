// src/components/ComingSoon.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Construction, ArrowLeft, Home } from 'lucide-react';

// Định nghĩa màu để dùng trực tiếp (nếu Tailwind config chưa nhận biến CSS)
const ERG_BLUE = '#00008b';
const ERG_RED = '#cc0022';

interface ComingSoonProps {
    title?: string; // Cho phép tùy chỉnh tiêu đề từng trang nếu muốn
    description?: string;
}

export default function ComingSoon({
                                       title = "Trang đang phát triển",
                                       description = "Chúng tôi đang nỗ lực hoàn thiện nội dung này để mang đến trải nghiệm tốt nhất cho bạn. Vui lòng quay lại sau!"
                                   }: ComingSoonProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center relative overflow-hidden">

            {/* --- BACKGROUND DECORATION --- */}
            {/* Vòng tròn mờ trang trí */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full bg-red-50 opacity-50 blur-3xl pointer-events-none"></div>

            {/* --- MAIN CONTENT --- */}
            <div className="relative z-10 max-w-lg bg-white p-10 rounded-3xl shadow-xl border border-gray-100 animate-fade-in-up">

                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-8 bg-blue-50 rounded-full flex items-center justify-center relative">
                    <Construction size={48} color={ERG_BLUE} />
                    {/* Chấm đỏ trang trí nhỏ */}
                    <div className="absolute top-0 right-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center border-2 border-white">
                        <div className="w-2 h-2 bg-[var(--erg-red)] rounded-full" style={{ backgroundColor: ERG_RED }}></div>
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: ERG_BLUE }}>
                    {title}
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    {description}
                </p>

                {/* Buttons Action */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all hover:shadow-lg hover:-translate-y-1"
                        style={{ backgroundColor: ERG_BLUE }}
                    >
                        <Home size={18} />
                        Về trang chủ
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        <ArrowLeft size={18} />
                        Quay lại
                    </button>
                </div>
            </div>

            {/* Footer nhỏ */}
            <div className="absolute bottom-8 text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} ERG Global. All rights reserved.
            </div>
        </div>
    );
}