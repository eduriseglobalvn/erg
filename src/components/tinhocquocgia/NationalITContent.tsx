'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Award, BookOpen, GraduationCap, FileText } from 'lucide-react';
import RoadmapSection from '@/components/tinhocquocgia/RoadmapSection';
import { CourseCard } from '@/components/cards/course-card';

const NationalCertificateCarousel = () => {
    const images = [
        { src: "/util/cnttcb.jpg", label: "Chứng chỉ CNTT Cơ Bản" },
        { src: "/util/cnttnc.jpg", label: "Chứng chỉ CNTT Nâng Cao" },
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden border-4 border-white/20 bg-white group">
            <div className="absolute inset-0 bg-[#fdfbf7] flex items-center justify-center border-[10px] border-[#8B0000]/10">
                <div className="text-center text-gray-500 p-8">
                    <div className="mb-4 flex justify-center">
                        <Award size={64} className="text-[#DAA520]" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-[#8B0000] uppercase mb-2">Chứng chỉ Quốc gia</h3>
                    <p className="font-semibold text-gray-700">{images[current].label}</p>
                    <p className="text-xs mt-4 text-gray-400 italic">(Phôi bằng do Bộ GD&ĐT quy định)</p>
                </div>
            </div>

            <div className="absolute inset-0 w-full h-full bg-white transition-opacity duration-500">
                <img
                    src={images[current].src}
                    alt={images[current].label}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = '0';
                    }}
                />
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'w-6 bg-[var(--erg-red)]' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default function NationalITContent() {
    return (
        <main className="min-h-screen">
            {/* 1. HERO SECTION */}
            <section className="relative bg-[var(--erg-blue)] text-white py-20 lg:py-28 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('/pattern-grid.png')] opacity-5"></div>
                <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-yellow-500 opacity-10 blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2 space-y-6">
                        <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/20 border border-yellow-400/30 text-sm font-semibold backdrop-blur-sm text-yellow-300">
                            ★ Chuẩn kỹ năng sử dụng CNTT theo Thông tư 03
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            CHUẨN HÓA KỸ NĂNG <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                                CÔNG NGHỆ THÔNG TIN
                            </span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                            Đào tạo và cấp chứng chỉ Ứng dụng CNTT Cơ bản & Nâng cao. Điều kiện tiên quyết để tốt nghiệp Đại học và thi tuyển công chức, viên chức.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/lo-trinh" className="px-8 py-3.5 bg-[var(--erg-red)] hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20 flex items-center gap-2">
                                Xem Lộ Trình <ArrowRight size={18} />
                            </Link>
                            <Link href="/khoa-hoc" className="px-8 py-3.5 bg-white text-[var(--erg-blue)] hover:bg-blue-50 font-bold rounded-lg transition-all">
                                Khám Phá Khóa học
                            </Link>
                        </div>
                    </div>

                    <div className="md:w-1/2 flex justify-center w-full">
                        <NationalCertificateCarousel />
                    </div>
                </div>
            </section>

            {/* 2. WHY CHOOSE US */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Award className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: "Chứng Chỉ Quốc Gia",
                                desc: "Phôi bằng chuẩn của Bộ Giáo dục & Đào tạo, có giá trị vô thời hạn trên toàn quốc."
                            },
                            {
                                icon: <BookOpen className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: "Giáo Trình Thực Tế",
                                desc: "Bám sát các mô đun (IU) quy định: Word, Excel, PowerPoint, Xử lý văn bản hành chính."
                            },
                            {
                                icon: <GraduationCap className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: "Hỗ Trợ Tận Tình",
                                desc: "Ôn tập sát đề thi, hỗ trợ học viên từ khi đăng ký đến khi nhận chứng chỉ."
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white group">
                                <div className="mb-4 bg-red-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[var(--erg-blue)] mb-2">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <RoadmapSection />

            {/* 4. MAIN COURSES */}
            <section id="khoa-hoc" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-[var(--erg-blue)]">Chương Trình Đào Tạo</h2>
                            <p className="text-gray-600 mt-2">Đáp ứng đầy đủ chuẩn đầu ra Tin học cho sinh viên và người đi làm</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <CourseCard
                            id="thcb"
                            code="Mã lớp: THCB"
                            displayTitle="CƠ BẢN"
                            subtitle="Basic IT Skills"
                            title="Kỹ năng sử dụng CNTT Cơ Bản"
                            description="Dành cho người mới bắt đầu, trang bị kiến thức nền tảng về máy tính và tin học văn phòng."
                            icon={<FileText size={80} color="white" />}
                            points={[
                                "Windows: Quản lý tập tin, thư mục (Explorer).",
                                "MS Word (IU03): Soạn thảo, định dạng văn bản, bảng biểu.",
                                "MS Excel (IU04): Hàm chuỗi, ngày tháng, tính toán cơ bản.",
                                "MS PowerPoint (IU05): Thiết kế slide, hiệu ứng trình chiếu."
                            ]}
                            href="/cntt-co-ban"
                            headerGradient="from-blue-600 to-blue-400"
                            btnColor="border-blue-600 text-blue-600 hover:bg-blue-600"
                            modules="Nội dung (Mô đun IU01 - IU06):"
                        />

                        <CourseCard
                            id="thnc"
                            code="Mã lớp: THNC"
                            displayTitle="NÂNG CAO"
                            subtitle="Advanced IT Skills"
                            title="Kỹ năng sử dụng CNTT Nâng Cao"
                            description="Chuyên sâu về văn phòng, xử lý dữ liệu phức tạp. Yêu cầu đã có kiến thức cơ bản."
                            icon={<Award size={80} color="white" />}
                            points={[
                                "Word Nâng cao (IU07): Trộn thư (Mail Merge), Mục lục tự động, Section break.",
                                "Excel Nâng cao (IU08): PivotTable, VLOOKUP nâng cao, Công thức mảng, Bảo mật.",
                                "PPT Nâng cao (IU09): Slide Master, Trigger, Chèn đa phương tiện."
                            ]}
                            href="/cntt-nang-cao"
                            headerGradient="from-purple-600 to-indigo-500"
                            btnColor="border-purple-600 text-purple-600 hover:bg-purple-600"
                            modules="Nội dung (Mô đun IU07 - IU09):"
                        />

                        <CourseCard
                            id="luyen-thi"
                            code="Cấp tốc"
                            displayTitle="LUYỆN THI"
                            subtitle="Exam Preparation"
                            title="Ôn Thi & Cấp Chứng Chỉ"
                            description="Dành cho đối tượng đã có kiến thức, cần hệ thống hóa để thi lấy bằng nhanh chóng."
                            icon={<CheckCircle2 size={80} color="white" />}
                            points={[
                                "Làm quen với phần mềm thi trắc nghiệm & thực hành.",
                                "Giải đề thi mẫu các năm gần nhất.",
                                "Tỷ lệ đậu cao. Hỗ trợ đăng ký thi ngay tại trung tâm."
                            ]}
                            href="/luyen-thi"
                            headerGradient="from-orange-500 to-red-400"
                            btnColor="border-orange-500 text-orange-600 hover:bg-orange-500"
                            modules="Quyền lợi:"
                        />
                    </div>
                </div>
            </section>

            <section className="py-20 bg-[var(--erg-blue)] text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Bạn chưa biết nên bắt đầu từ đâu?</h2>
                    <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                        Đừng lo lắng! Hãy để lại thông tin, chúng tôi sẽ tư vấn lộ trình học và thi chứng chỉ phù hợp nhất với nhu cầu công việc của bạn.
                    </p>
                    <Link href="/lien-he" className="inline-block px-12 py-4 bg-[var(--erg-red)] text-white font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-red-900/30">
                        Nhận Tư Vấn Miễn Phí
                    </Link>
                </div>
            </section>
        </main>
    );
}
