"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, MousePointer2 } from 'lucide-react';
import { ELEARNING_DATA } from '@/constants/elearning.constants';

export default function ElearningHomePage() {
    const openModal = (categoryId: string) => {
        window.dispatchEvent(new CustomEvent('open-elearning-modal', { detail: categoryId }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* 1. Hero Section */}
            <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <Image
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="E-learning Background"
                    fill
                    priority
                    className="object-cover"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Hero Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-32 container mx-auto px-4 text-center text-white">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">
                            Học Mọi Lúc, Mọi Nơi
                        </h1>
                        <p className="text-lg md:text-2xl font-medium text-gray-200 max-w-2xl mx-auto opacity-90">
                            Truy cập trên điện thoại, máy tính bảng, laptop. Khám phá tri thức không giới hạn.
                        </p>
                    </motion.div>
                </div>

                {/* Indicator dots (decorative like screenshot) */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                    <div className="w-8 h-2 rounded-full bg-blue-500" />
                    <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                </div>
            </section>

            {/* 2. Main Action Section */}
            <section className="flex-1 container mx-auto px-4 -mt-16 md:-mt-24 relative z-10 pb-20">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[40px] shadow-2xl p-10 md:p-20 text-center border border-gray-100"
                >
                    <div className="mb-10">
                        <h2 className="text-4xl md:text-6xl font-black text-blue-600 mb-6 uppercase tracking-tight">
                            Học tập IC3 GS6 Trực Tuyến
                        </h2>
                        <p className="text-lg md:text-2xl text-gray-500 font-medium">
                            Nền tảng ôn tập và kiểm tra toàn diện cho học sinh <span className="text-gray-900 font-bold">Tiểu học (Spark)</span> và <span className="text-gray-900 font-bold">THCS (GS6)</span>.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                        {ELEARNING_DATA.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => openModal(category.id)}
                                className={`
                                    relative group overflow-hidden w-full md:w-auto px-10 py-6 rounded-2xl font-black text-xl md:text-2xl transition-all transform hover:-translate-y-2 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3
                                    ${category.id === 'primary'
                                        ? 'bg-[#00ADC4] text-white shadow-[#00ADC4]/30'
                                        : 'bg-[#4352FF] text-white shadow-[#4352FF]/30'}
                                `}
                            >
                                <span>Bắt đầu ({category.id === 'primary' ? 'Tiểu Học' : 'THCS'})</span>
                                <MousePointer2 size={24} className="animate-bounce" />

                                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            </button>
                        ))}
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                                <GraduationCap size={32} />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Lộ trình học tập</h4>
                            <p className="text-gray-500 text-sm">Hướng dẫn chi tiết từ căn bản đến nâng cao theo chuẩn quốc tế.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-green-50/50 border border-green-100">
                            <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                    <Star size={32} />
                                </motion.div>
                            </div>
                            <h4 className="text-xl font-bold mb-3">Kiểm tra kiến thức</h4>
                            <p className="text-gray-500 text-sm">Hệ thống bài tập trắc nghiệm mô phỏng kỳ thi thực tế.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-purple-50/50 border border-purple-100">
                            <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                                <ArrowRight size={32} />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Kết quả ngay lập tức</h4>
                            <p className="text-gray-500 text-sm">Biết ngay điểm số và đáp án sau khi hoàn thành bài thi.</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer Brand (Minimal for Landing) */}
            <footer className="py-10 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
                © {new Date().getFullYear()} EduRise Global E-learning. Tất cả bản quyền được bảo hộ.
            </footer>

            <style jsx global>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

function Star(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}