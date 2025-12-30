'use client';

import React from 'react';
import { BookOpen, CheckCircle2, FileText, Award, Star } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
    // Dữ liệu nội dung bám sát tài liệu IU01 - IU09
    const courses = [
        {
            id: 'thcb',
            code: 'MÃ LỚP: THCB',
            displayTitle: "CƠ BẢN", // Đã sửa từ CB thành CƠ BẢN
            title: "Kỹ năng sử dụng CNTT Cơ bản",
            description: "Dành cho người mới bắt đầu, trang bị kiến thức nền tảng về máy tính và tin học văn phòng.",
            headerGradient: "from-blue-600 to-blue-400",
            modules: "Nội dung (Mô đun IU01 - IU06):",
            points: [
                "Windows: Quản lý tập tin, thư mục (Explorer).",
                "MS Word (IU03): Soạn thảo, định dạng văn bản, bảng biểu.",
                "MS Excel (IU04): Hàm chuỗi, ngày tháng, tính toán cơ bản.",
                "MS PowerPoint (IU05): Thiết kế slide, hiệu ứng trình chiếu."
            ],
            btnColor: "border-blue-600 text-blue-600 hover:bg-blue-600",
            icon: <FileText size={80} className="text-white opacity-20" />
        },
        {
            id: 'thnc',
            code: 'MÃ LỚP: THNC',
            displayTitle: "NÂNG CAO", // Đã sửa từ NC thành NÂNG CAO
            title: "Kỹ năng sử dụng CNTT Nâng cao",
            description: "Chuyên sâu về văn phòng, xử lý dữ liệu phức tạp. Yêu cầu đã có kiến thức cơ bản.",
            headerGradient: "from-purple-600 to-indigo-500",
            modules: "Nội dung (Mô đun IU07 - IU09):",
            points: [
                "Word Nâng cao (IU07): Trộn thư (Mail Merge), Mục lục tự động.",
                "Excel Nâng cao (IU08): PivotTable, VLOOKUP nâng cao, Công thức mảng.",
                "PPT Nâng cao (IU09): Slide Master, Trigger, Chèn đa phương tiện.",
                "Kỹ năng kiểm tra và bảo mật bảng tính nâng cao."
            ],
            btnColor: "border-purple-600 text-purple-600 hover:bg-purple-600",
            icon: <Star size={80} className="text-white opacity-20" />
        },
        {
            id: 'luyenthi',
            code: 'CẤP TỐC',
            displayTitle: "LUYỆN THI",
            title: "Ôn Thi & Cấp Chứng Chỉ",
            description: "Dành cho đối tượng đã có kiến thức, cần hệ thống hóa để thi lấy bằng nhanh chóng.",
            headerGradient: "from-orange-500 to-red-400",
            modules: "Quyền lợi học viên:",
            points: [
                "Làm quen với phần mềm thi trắc nghiệm & thực hành.",
                "Giải bộ đề thi sát hạch chuẩn quốc gia các năm gần nhất.",
                "Mẹo làm bài đạt điểm tối đa và quản lý thời gian thi.",
                "Tỷ lệ đậu cao. Hỗ trợ đăng ký thi ngay tại trung tâm."
            ],
            btnColor: "border-orange-500 text-orange-600 hover:bg-orange-500",
            icon: <Award size={80} className="text-white opacity-20" />
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* 1. HERO SECTION */}
            <section className="bg-[var(--erg-blue)] text-white py-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                     style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 uppercase tracking-tight leading-tight">
                        Chương Trình <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">Đào Tạo</span>
                    </h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg md:text-xl font-light">
                        Đáp ứng đầy đủ chuẩn đầu ra Tin học cho sinh viên và người đi làm theo quy định của Bộ GD&ĐT.
                    </p>
                </div>
            </section>

            {/* 2. COURSE LISTING */}
            <section className="py-20 relative"
                     style={{
                         backgroundColor: '#ffffff',
                         backgroundImage: `
                        linear-gradient(to right, rgba(229, 231, 235, 0.4) 1.5px, transparent 1.5px),
                        linear-gradient(to bottom, rgba(229, 231, 235, 0.4) 1.5px, transparent 1.5px)
                    `,
                         backgroundSize: '80px 80px'
                     }}
            >
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {courses.map((course) => (
                            <div key={course.id} className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                                {/* Header Card hiển thị tên đầy đủ */}
                                <div className={`h-48 bg-gradient-to-br ${course.headerGradient} flex items-center justify-center relative overflow-hidden flex-shrink-0`}>
                                    <div className="text-center text-white p-4 relative z-10">
                                        <span className="block text-3xl font-bold uppercase mb-1">{course.displayTitle}</span>
                                        <span className="text-xs opacity-90 italic">{course.id === 'thcb' ? 'Basic IT Skills' : course.id === 'thnc' ? 'Advanced IT Skills' : 'Exam Preparation'}</span>
                                    </div>
                                    <div className="absolute bottom-0 right-0 p-4">
                                        {course.icon}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-gray-100">
                                            {course.code}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[var(--erg-blue)] transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                        {course.description}
                                    </p>

                                    <div className="space-y-3 mb-8 border-t border-gray-100 pt-4 flex-1">
                                        <h4 className="font-bold text-gray-700 text-xs uppercase mb-3 italic">{course.modules}</h4>
                                        <ul className="space-y-2">
                                            {course.points.map((point, i) => (
                                                <li key={i} className="flex items-start gap-2 text-[13px] text-gray-600 font-medium leading-snug">
                                                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Link
                                        href={`/khoa-hoc/${course.id}`}
                                        className={`block w-full py-3 text-center rounded-lg border-2 font-bold transition-all mt-auto uppercase text-sm tracking-wide ${course.btnColor} hover:text-white shadow-sm active:scale-95`}
                                    >
                                        Chi Tiết & Đăng Ký
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. FOOTER CTA */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-[var(--erg-blue)] mb-6">
                        Bạn Đã Sẵn Sàng?
                    </h2>
                    <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto font-medium">
                        Đừng để lỡ "thời điểm vàng". Đăng ký ngay để nhận lộ trình chi tiết cho con em mình.
                    </p>
                    <Link href="/lien-he" className="inline-block px-12 py-5 bg-[var(--erg-red)] text-white font-bold text-xl rounded-xl hover:bg-red-700 transition-all shadow-xl hover:shadow-red-200 transform hover:-translate-y-1 uppercase tracking-wider">
                        Đăng Ký Tư Vấn Ngay
                    </Link>
                </div>
            </section>
        </div>
    );
}