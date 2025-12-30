'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Code2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CoursesPage() {
    const courses = [
        {
            id: 'scratch',
            title: 'Lập trình Scratch',
            subTitle: 'Học sinh  từ Lớp 4 bắt đầu làm quen với lập trình',
            description: 'Khơi dậy tư duy sáng tạo thông qua ngôn ngữ lập trình kéo thả trực quan. Giúp bé biến ý tưởng thành Game và Phim hoạt hình.',
            icon: <Gamepad2 className="w-10 h-10 text-orange-600" />,
            levels: [
                'Tư duy máy tính & Tọa độ',
                'Sáng tạo Game 2D & Multimedia',
                'Thuyết trình dự án cuối khóa'
            ],
            link: '/khoa-hoc/lap-trinh-scratch',
            colorClass: 'border-orange-500 shadow-orange-100', // Màu viền & shadow
            btnClass: 'bg-orange-500 hover:bg-orange-600 shadow-orange-200',
            bgIcon: 'bg-orange-50'
        },
        {
            id: 'python',
            title: 'Lập trình Python thiếu nhi',
            subTitle: 'Học sinh từ lớp 6 trở lên',
            description: 'Tiếp cận ngôn ngữ lập trình thực tế số 1 thế giới. Rèn luyện tư duy logic, kỹ năng giải quyết vấn đề và xử lý dữ liệu.',
            icon: <Code2 className="w-10 h-10 text-blue-600" />,
            levels: [
                'Cú pháp & Biến cơ bản',
                'Cấu trúc điều khiển & Vòng lặp',
                'Lập trình Game & Ứng dụng nhỏ'
            ],
            link: '/khoa-hoc/lap-trinh-python-thieu-nhi',
            colorClass: 'border-blue-500 shadow-blue-100',
            btnClass: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
            bgIcon: 'bg-blue-50'
        }
        // Đã xóa khóa học "Tin học & Chứng chỉ Quốc tế" ở đây
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* HEADER */}
            <div className="bg-[var(--erg-blue)] py-20 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                <div className="relative z-10 px-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-wide">
                        CHƯƠNG TRÌNH ĐÀO TẠO
                    </h1>
                    <p className="text-blue-100 max-w-3xl mx-auto text-lg font-light">
                        Hai hướng tiếp cận công nghệ hoàn toàn độc lập. Tùy thuộc vào sở thích của bé (thích vẽ/sáng tạo hay thích toán/logic), ba mẹ hãy chọn lộ trình phù hợp nhất.
                    </p>
                </div>
            </div>

            {/* Course List */}
            <div className="container mx-auto px-4 -mt-16 relative z-10">
                {/* Thay đổi grid-cols-3 thành grid-cols-2 để hiển thị 2 cột */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            // Thay đổi border-t-4 thành border-2 để có viền bao quanh đẹp hơn cho bố cục 2 cột
                            className={`bg-white rounded-2xl shadow-xl border-2 p-8 flex flex-col h-full hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group ${course.colorClass}`}
                        >
                            {/* Icon Header */}
                            <div className={`mb-6 w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${course.bgIcon}`}>
                                {course.icon}
                            </div>

                            <div className="flex-1">
                                <span className="inline-block px-3 py-1 rounded bg-gray-100 text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                                  {course.subTitle}
                                </span>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[var(--erg-blue)] transition-colors">
                                    {course.title}
                                </h2>
                                <p className="text-gray-600 mb-6 text-sm leading-relaxed font-medium">
                                    {course.description}
                                </p>

                                {/* List Levels */}
                                <div className="space-y-3 mb-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
                                    {course.levels.map((lvl, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                            <CheckCircle2 size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                            <span>{lvl}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Button CTA */}
                            <Link
                                href={course.link}
                                className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-bold transition-all shadow-lg ${course.btnClass}`}
                            >
                                XEM CHI TIẾT <ArrowRight size={18} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Note */}
            <div className="container mx-auto px-4 mt-12 text-center">
                <p className="text-gray-500 text-sm">
                    * Các khóa học được thiết kế phù hợp với khung năng lực số của Bộ Giáo dục & Đào tạo.
                </p>
            </div>
        </div>
    );
}