'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Brain, Globe, Shield, Activity } from 'lucide-react';
import RoadmapSection from "@/components/congdanso/RoadmapSection";
import { CourseCard } from '@/components/cards/course-card';
import { COURSES } from '@/constants/courses';

const CitizenshipCarousel = () => {
    const images = [
        { src: "", label: "An Toàn Trực Tuyến" },
        { src: "", label: "Kỹ Năng Số Thiết Yếu" },
        { src: "", label: "Đạo Đức & Trách Nhiệm" },
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
            <div className="absolute inset-0 bg-blue-50 flex items-center justify-center border-[10px] border-white/50">
                <div className="text-center text-blue-300 p-8">
                    <Globe size={64} className="mx-auto mb-4 opacity-80 text-blue-500" />
                    <h3 className="text-xl font-bold text-blue-600 uppercase mb-2">Công Dân Số</h3>
                    <p className="font-semibold text-gray-500">{images[current].label}</p>
                </div>
            </div>
            <div className="absolute inset-0 w-full h-full transition-opacity duration-500">
                <Image
                    src={images[current].src}
                    alt={images[current].label}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                />
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {images.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrent(idx)} className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'w-6 bg-[var(--erg-red)]' : 'bg-gray-300'}`} />
                ))}
            </div>
        </div>
    );
};

export default function DigitalCitizenshipContent() {
    return (
        <main className="min-h-screen bg-white">
            <section className="relative bg-[var(--erg-blue)] text-white py-20 lg:py-28 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('/pattern-grid.png')] opacity-5"></div>
                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2 space-y-6">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-sm font-semibold backdrop-blur-sm text-yellow-300">
                            ★ Giáo dục toàn diện thế hệ Alpha
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            KỸ NĂNG <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                                CÔNG DÂN SỐ
                            </span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                            Trang bị "vắc-xin số" cho học sinh: Tư duy sử dụng internet an toàn, hiệu quả và có trách nhiệm trong kỷ nguyên kết nối toàn cầu.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="#khoa-hoc" className="px-8 py-3.5 bg-[var(--erg-red)] hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg flex items-center gap-2">
                                Xem Khóa Học <ArrowRight size={18} />
                            </Link>
                            <Link href="/tu-van" className="px-8 py-3.5 bg-white text-[var(--erg-blue)] hover:bg-blue-50 font-bold rounded-lg transition-all">
                                Tư Vấn Miễn Phí
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center w-full">
                        <CitizenshipCarousel />
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Brain className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: "Hiểu Biết (Knowledge)",
                                desc: "Hiểu biết về bản thân, tài chính và định hướng nghề nghiệp trong thế giới số."
                            },
                            {
                                icon: <Shield className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: "Kỹ Năng Số (Digital Skills)",
                                desc: "Kỹ năng sử dụng thiết bị công nghệ, an toàn Internet và xã hội an toàn."
                            },
                            {
                                icon: <Activity className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: "Năng Lực (Competencies)",
                                desc: "Tư duy sáng tạo, tư duy phản biện, giao tiếp và hợp tác nhóm hiệu quả."
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

            <section id="khoa-hoc" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-[var(--erg-blue)]">Chương Trình Đào Tạo</h2>
                            <p className="text-gray-600 mt-2">Biên soạn bởi đội ngũ chuyên gia giáo dục Common Sense Educator.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {COURSES.congdanso.map((course) => (
                            <CourseCard
                                key={course.id}
                                {...course}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-[var(--erg-blue)] text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Bạn đã sẵn sàng?</h2>
                    <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                        Đừng để lỡ "thời điểm vàng". Đăng ký ngay để nhận lộ trình chi tiết cho con em mình.
                    </p>
                    <Link href="/lien-he" className="inline-block px-12 py-4 bg-[var(--erg-red)] text-white font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-red-900/30">
                        Đăng Ký Tư Vấn Ngay
                    </Link>
                </div>
            </section>
        </main>
    );
}
