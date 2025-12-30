'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Monitor, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CoursesPage() {
    const courses = [
        {
            id: 'ic3-spark',
            title: 'IC3 Spark GS6',
            subTitle: 'KHỐI TIỂU HỌC',
            description: 'Bước khởi đầu vững chắc. Giúp trẻ hiểu rõ trách nhiệm và đạo đức trong môi trường số.',
            icon: <BookOpen className="w-10 h-10 text-[var(--erg-blue)]" />,
            levels: ['Level 1: Máy tính cơ bản', 'Level 2: Các ứng dụng chính', 'Level 3: Cuộc sống trực tuyến'],
            link: '/khoa-hoc/ic3-gs6-spark',
            borderClass: 'border-blue-200'
        },
        {
            id: 'ic3-gs6',
            title: 'IC3 GS6',
            subTitle: 'KHỐI THCS',
            description: 'Tiêu chuẩn toàn cầu về năng lực số. Trang bị tư duy công nghệ và kỹ năng làm việc chuyên nghiệp.',
            icon: <Monitor className="w-10 h-10 text-[#008080]" />, // Màu Teal đặc trưng IC3
            levels: ['Level 1: Nhập môn', 'Level 2: Thực hành', 'Level 3: Nâng cao'],
            link: '/khoa-hoc/ic3-gs6',
            borderClass: 'border-teal-200'
        },
        {
            id: 'mos',
            title: 'MOS Certification',
            subTitle: 'KHỐI THPT & ĐẠI HỌC',
            description: 'Chứng chỉ tin học văn phòng Microsoft. Điểm cộng tuyệt đối cho hồ sơ du học và xin việc.',
            icon: <Award className="w-10 h-10 text-[#c43e1c]" />, // Màu Cam đất đặc trưng MOS
            levels: ['MOS Specialist', 'MOS Expert', 'MOS Master'],
            link: '/khoa-hoc/mos',
            borderClass: 'border-orange-200'
        }
    ];

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* HEADER: Dùng biến màu global */}
            <div className="bg-[var(--erg-blue)] py-16 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                <h1 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-wide">Hệ Thống Đào Tạo</h1>
                <p className="text-blue-100 max-w-2xl mx-auto text-lg">
                    Lộ trình chuẩn quốc tế từ Tiểu học đến Đại học cùng ERG Global
                </p>
            </div>

            {/* Course List */}
            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div key={course.id} className={`bg-white rounded-xl shadow-xl border-t-4 p-8 flex flex-col h-full hover:shadow-2xl transition-all duration-300 group ${course.borderClass}`}>
                            <div className="mb-6 bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                {course.icon}
                            </div>

                            <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded bg-gray-100 text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                  {course.subTitle}
                </span>
                                <h2 className="text-2xl font-bold text-[var(--erg-blue)] mb-3">{course.title}</h2>
                                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{course.description}</p>

                                <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-lg">
                                    {course.levels.map((lvl, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                            <CheckCircle2 size={16} className="text-[var(--erg-red)]" />
                                            {lvl}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link
                                href={course.link}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[var(--erg-red)] text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
                            >
                                XEM CHI TIẾT <ArrowRight size={18} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}