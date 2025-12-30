'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, BrainCircuit, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function CoursesPage() {
    // Dữ liệu chỉ có 1 khóa học duy nhất: Học cùng AI
    const courses = [
        {
            id: 'ai-learning',
            title: 'Học cùng AI',
            subTitle: 'DÀNH CHO HỌC SINH TỪ LỚP 1 - 12',
            description: 'Chương trình giáo dục Trí tuệ nhân tạo (AI) chính quy, giảng dạy dựa trên bộ sách giáo khoa chuẩn của Nhà xuất bản Giáo dục Việt Nam. Giúp học sinh làm chủ công nghệ và phát triển tư duy máy tính toàn diện.',
            icon: <Bot className="w-12 h-12 text-indigo-600" />,
            levels: [
                'Bộ sách giáo khoa chuẩn (NXB GDVN)',
                'Lộ trình dài hạn & Xuyên suốt (Lớp 1-12)',
                'Kết hợp Lý thuyết & Thực hành Robot/Lập trình'
            ],
            link: '/khoa-hoc/hoc-cung-ai',
            // Style theo tông màu Indigo (AI) + Vàng
            colorClass: 'border-indigo-200 shadow-indigo-100/50 hover:border-indigo-400',
            btnClass: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200',
            bgIcon: 'bg-indigo-50',
            badgeColor: 'bg-yellow-100 text-yellow-700 border border-yellow-200'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* HEADER */}
            {/* Đổi màu nền sang Indigo đậm để hợp chủ đề AI */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 py-24 text-center text-white relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                <div className="relative z-10 px-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-sm font-semibold mb-4 backdrop-blur-sm">
                        <Sparkles size={14} className="text-yellow-300" /> Giáo dục Công nghệ Tương lai
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-wide">
                        CHƯƠNG TRÌNH ĐÀO TẠO
                    </h1>
                    <p className="text-indigo-100 max-w-3xl mx-auto text-lg font-light leading-relaxed">
                        Chúng tôi tập trung vào chương trình cốt lõi duy nhất, mang đến lộ trình học tập bài bản và chất lượng nhất cho thế hệ công dân số.
                    </p>
                </div>
            </div>

            {/* Course List Container */}
            <div className="container mx-auto px-4 -mt-20 relative z-10">
                {/* Sử dụng max-w-3xl và mx-auto để căn giữa thẻ duy nhất */}
                <div className="max-w-3xl mx-auto">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className={`bg-white rounded-3xl shadow-xl border-2 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group ${course.colorClass}`}
                        >
                            {/* Icon / Image Area */}
                            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:block">
                                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${course.bgIcon}`}>
                                    {course.icon}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                                    <h2 className="text-3xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                                        {course.title}
                                    </h2>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${course.badgeColor}`}>
                                        {course.subTitle}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-6 text-base leading-relaxed font-medium">
                                    {course.description}
                                </p>

                                {/* List Levels / Features */}
                                <div className="space-y-3 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-2">
                                        <BrainCircuit size={16} className="text-indigo-500" /> Điểm nổi bật:
                                    </h4>
                                    {course.levels.map((lvl, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{lvl}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Button CTA */}
                                <Link
                                    href={course.link}
                                    className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-bold transition-all shadow-lg hover:-translate-y-1 ${course.btnClass}`}
                                >
                                    XEM CHI TIẾT CHƯƠNG TRÌNH <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Note */}
            <div className="container mx-auto px-4 mt-16 text-center">
                <p className="text-gray-500 text-sm italic">
                    * Chương trình được xây dựng dựa trên khung chương trình giáo dục phổ thông mới.
                </p>
            </div>
        </div>
    );
}