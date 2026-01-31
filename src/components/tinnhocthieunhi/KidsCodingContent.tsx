'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    Award,
    Gamepad2,
    Monitor,
    Smile,
    Palette,
    Terminal,
    Sparkles,
    Zap,
    Check
} from 'lucide-react';
import { CourseCard } from '@/components/cards/course-card';

const KidsCodingCarousel = () => {
    const images = [
        { src: "/util/scratch-banner.jpg", label: "Lập trình Scratch (Tiểu học)" },
        { src: "/util/python-banner.jpg", label: "Lập trình Python (THCS)" },
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
                        <Gamepad2 size={64} className="text-[#DAA520]" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-[#8B0000] uppercase mb-2">Lập trình Thiếu Nhi</h3>
                    <p className="font-semibold text-gray-700">{images[current].label}</p>
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

export default function KidsCodingContent() {
    return (
        <main className="min-h-screen">
            <section className="relative bg-[var(--erg-blue)] text-white py-20 lg:py-28 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('/pattern-grid.png')] opacity-5"></div>
                <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-yellow-500 opacity-10 blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2 space-y-6">
                        <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/20 border border-yellow-400/30 text-sm font-semibold backdrop-blur-sm text-yellow-300">
                            ★ Khóa học tiêu chuẩn cho trẻ 6 - 15 tuổi
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            KHƠI DẬY ĐAM MÊ <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                                CÔNG NGHỆ TƯƠNG LAI
                            </span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                            Trang bị tư duy máy tính, logic và kỹ năng giải quyết vấn đề thông qua Lập trình Scratch & Python. Bước đệm vững chắc để trở thành công dân số toàn cầu.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/khoa-hoc" className="px-8 py-3.5 bg-[var(--erg-red)] hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20 flex items-center gap-2">
                                Xem Chương Trình <ArrowRight size={18} />
                            </Link>
                            <Link href="/tu-van" className="px-8 py-3.5 bg-white text-[var(--erg-blue)] hover:bg-blue-50 font-bold rounded-lg transition-all">
                                Tư Vấn Miễn Phí
                            </Link>
                        </div>
                    </div>

                    <div className="md:w-1/2 flex justify-center w-full">
                        <KidsCodingCarousel />
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[var(--erg-blue)]">Trẻ Em Sẽ Học Được Gì?</h2>
                        <p className="text-gray-600 mt-2">Phát triển toàn diện từ tư duy đến kỹ năng mềm</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Monitor className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: "Tư Duy Máy Tính",
                                desc: "Rèn luyện tính kiên trì, cẩn thận. Phát triển tư duy logic và cách diễn đạt ý tưởng chặt chẽ."
                            },
                            {
                                icon: <Award className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: "Sáng Tạo & Độc Lập",
                                desc: "Tự do sáng tạo trò chơi riêng. Hình thành tính tự giác giải quyết công việc chưa hoàn thành."
                            },
                            {
                                icon: <Smile className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: "Kỹ Năng Mềm",
                                desc: "Biết phân chia, phối hợp làm việc nhóm. Rèn luyện kỹ năng thuyết trình, giải thích mạch lạc."
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

            <section id="khoa-hoc" className="py-20 bg-gray-50 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)] mb-4">
                            CHƯƠNG TRÌNH ĐÀO TẠO
                        </h2>
                        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                            Hai hướng tiếp cận công nghệ hoàn toàn độc lập dành cho học sinh Tiểu học & THCS.
                            Tùy thuộc vào sở thích của bé (thích vẽ/sáng tạo hay thích toán/logic), ba mẹ hãy chọn chương trình phù hợp nhất.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                        <CourseCard
                            id="scratch"
                            code="Tiểu học"
                            displayTitle="SCRATCH"
                            subtitle="Creative Coding"
                            title="Lộ trình Sáng Tạo (Scratch)"
                            description="Phù hợp với trẻ thích hình ảnh, âm thanh, vẽ tranh & kể chuyện. Bé tự tạo được trò chơi, thiệp điện tử, phim hoạt hình."
                            points={[
                                "Học tư duy Kéo - Thả (No-code)",
                                "Tự làm Game & Phim hoạt hình",
                                "Phát triển trí tưởng tượng phong phú"
                            ]}
                            href="/khoa-hoc/lap-trinh-scratch"
                            headerGradient="from-orange-500 to-yellow-400"
                            btnColor="border-orange-500 text-orange-600 hover:bg-orange-600"
                            icon={<Palette />}
                            modules="Lộ trình học tập:"
                        />

                        <CourseCard
                            id="python-kids"
                            code="THCS"
                            displayTitle="PYTHON"
                            subtitle="Logic & Data"
                            title="Lộ trình Tư Duy (Python)"
                            description="Phù hợp với trẻ thích toán học, giải đố. Tiếp cận ngôn ngữ lập trình thực tế số 1 thế giới chuẩn kỹ sư công nghệ."
                            points={[
                                "Lập trình dòng lệnh thực tế",
                                "Giải quyết vấn đề & Thuật toán",
                                "Nền tảng cho AI & Khoa học dữ liệu"
                            ]}
                            href="/khoa-hoc/lap-trinh-python-thieu-nhi"
                            headerGradient="from-blue-600 to-indigo-500"
                            btnColor="border-blue-600 text-blue-600 hover:bg-blue-600"
                            icon={<Terminal />}
                            modules="Lộ trình học tập:"
                        />
                    </div>
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 text-gray-600 bg-white px-6 py-3 rounded-full border border-gray-200 shadow-sm text-sm font-medium">
                            <Check size={18} className="text-green-500" />
                            <span>Cả hai chương trình đều được thiết kế chuẩn sư phạm cho học sinh <strong>Tiểu học & Trung học Cơ sở</strong></span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-[var(--erg-blue)] text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Đầu tư cho tương lai của con ngay hôm nay</h2>
                    <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                        Để lại thông tin để được tư vấn lộ trình học lập trình phù hợp nhất với độ tuổi và năng lực của bé.
                    </p>
                    <Link href="/lien-he" className="inline-block px-12 py-4 bg-[var(--erg-red)] text-white font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-red-900/30">
                        Đăng Ký Học Thử
                    </Link>
                </div>
            </section>
        </main>
    );
}
