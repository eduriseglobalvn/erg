'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Users, Globe, ShieldCheck } from 'lucide-react';
import RoadmapSection from '@/components/tinhocquocte/RoadmapSection';
import { CourseCard } from '@/components/cards/course-card';
import { COURSES } from '@/constants/courses';

const CertificateCarousel = () => {
    const images = [
        { src: "/util/mos.jpg", label: "Chứng chỉ MOS - Microsoft" },
        { src: "/util/ic3.jpg", label: "Chứng chỉ IC3 - Certiport" },
        { src: "/util/spark.jpg", label: "Chứng chỉ IC3 Spark" },
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
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-400 p-8">
                    <Award size={60} className="mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-xs uppercase tracking-widest">{images[current].label}</p>
                </div>
            </div>

            <div className="absolute inset-0 w-full h-full transition-opacity duration-500">
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
                        className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'w-6 bg-[var(--erg-red)]' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default function InternationalItContent() {
    const courses = COURSES.tinhocquocte;

    return (
        <main className="min-h-screen">
            {/* 1. HERO SECTION */}
            <section className="relative bg-[var(--erg-blue)] text-white py-20 lg:py-28 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-5"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-[var(--erg-red)] opacity-10"></div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2 space-y-6">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-sm font-semibold backdrop-blur-sm text-[var(--erg-red)] bg-white">
                            #1 Đào tạo tin học chuẩn quốc tế
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            LEARN TODAY, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                                LEAD TOMORROW
                            </span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                            Trang bị kiến thức và kỹ năng sử dụng công nghệ theo tiêu chuẩn toàn cầu IC3 & MOS. Mở rộng cánh cửa tương lai cho thế hệ trẻ Việt Nam.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/lo-trinh" className="px-8 py-3.5 bg-[var(--erg-red)] hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20 flex items-center gap-2">
                                Xem Lộ Trình <ArrowRight size={18} />
                            </Link>
                            <Link href="/khoa-hoc" className="px-8 py-3.5 bg-white text-[var(--erg-blue)] hover:bg-blue-50 font-bold rounded-lg transition-all">
                                Khám Phá Khóa Học
                            </Link>
                        </div>
                    </div>

                    <div className="md:w-1/2 flex justify-center w-full">
                        <CertificateCarousel />
                    </div>
                </div>
            </section>

            {/* 2. WHY CHOOSE US */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Globe className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: "Chuẩn Quốc Tế",
                                desc: "Giáo trình và chứng chỉ được công nhận toàn cầu bởi Microsoft & Certiport."
                            },
                            {
                                icon: <Users className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: "Đội Ngũ Tâm Huyết",
                                desc: "Giáo viên giàu kinh nghiệm, phương pháp giảng dạy hiện đại, tận tâm, sát sao từng học viên."
                            },
                            {
                                icon: <ShieldCheck className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: "Cam Kết Chất Lượng",
                                desc: "Lộ trình học tập rõ ràng, cam kết hỗ trợ học viên đạt kết quả cao nhất trong các kỳ thi."
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

            {/* 4. FEATURED COURSES */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-[var(--erg-blue)]">Các Chương Trình Đào Tạo</h2>
                            <p className="text-gray-600 mt-2">Được thiết kế phù hợp cho từng độ tuổi và nhu cầu</p>
                        </div>
                        <Link href="/khoa-hoc" className="flex items-center gap-2 text-[var(--erg-red)] font-bold hover:gap-3 transition-all">
                            Xem tất cả <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                {...course}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. CTA SECTION */}
            <section className="py-20 bg-[var(--erg-blue)] text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng cho kỷ nguyên số?</h2>
                    <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">Đăng ký tư vấn ngay hôm nay để nhận lộ trình học tập chi tiết phù hợp nhất với năng lực của bạn.</p>
                    <Link
                        href="/lien-he"
                        className="inline-block px-12 py-4 bg-[var(--erg-red)] text-white font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-red-900/30"
                        data-analytics="click_register_consultation"
                        data-analytics-metadata='{"section": "footer", "subdomain": "tinhocquocte"}'
                    >
                        Đăng Ký Tư Vấn Ngay
                    </Link>
                </div>
            </section>
        </main>
    );
}
