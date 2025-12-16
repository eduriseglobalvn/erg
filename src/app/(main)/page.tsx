'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TRAINING_PROGRAMS , getSubdomainLink} from '@/constants/MenuItem';
import {
    ChevronLeft, ChevronRight, ArrowRight, Star
} from 'lucide-react';
import {
    HERO_SLIDES, TRAINING_FIELDS, CORE_VALUES, WHY_CHOOSE_US, TESTIMONIALS, LATEST_NEWS
} from '@/mocks/main.constants';

// --- DECORATIVE COMPONENTS ---
const DotGrid = ({ className }: { className?: string }) => (
    <svg className={`absolute opacity-[0.08] pointer-events-none ${className}`} width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
        <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
);

const TechCircle = ({ className }: { className?: string }) => (
    <div className={`absolute rounded-full border border-gray-300 opacity-30 pointer-events-none ${className}`}>
        <div className="absolute top-1/2 -right-1 w-2 h-2 bg-[var(--erg-blue)] rounded-full"></div>
    </div>
);

const GradientBlob = ({ className, color = "bg-blue-200" }: { className?: string, color?: string }) => (
    <div className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none mix-blend-multiply ${color} ${className}`}></div>
);


export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const testimonialRef = useRef<HTMLDivElement>(null);

    // --- Auto Slide Hero ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // --- Logic cuộn Testimonial ---
    const scrollTestimonials = (direction: 'left' | 'right') => {
        if (testimonialRef.current) {
            const { current } = testimonialRef;
            const scrollAmount = 350;
            const targetScroll = direction === 'left'
                ? current.scrollLeft - scrollAmount
                : current.scrollLeft + scrollAmount;
            current.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
    };

    return (
        <div className="font-sans text-slate-800 bg-white overflow-x-hidden w-full">

            {/* 1. HERO SECTION */}
            <section className="relative h-[550px] lg:h-[650px] overflow-hidden group">
                {HERO_SLIDES.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                    </div>
                ))}

                <div className="absolute inset-0 flex items-center container mx-auto px-4 md:px-6">
                    <div className="relative bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-2xl max-w-xl animate-fade-in-up border-l-[6px] border-[var(--erg-red)] overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--erg-blue)]/10 rounded-full blur-xl"></div>
                        <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-[var(--erg-blue)] mb-4 leading-tight">
                            {HERO_SLIDES[currentSlide].title}
                        </h2>
                        <p className="relative z-10 text-lg text-gray-600 mb-8 leading-relaxed">
                            {HERO_SLIDES[currentSlide].subtitle}
                        </p>
                        <Link
                            href="/linh-vuc-dao-tao"
                            className="relative z-10 inline-block bg-[var(--erg-red)] hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:-translate-y-1 shadow-md uppercase tracking-wide text-sm"
                        >
                            Khám phá các khóa học
                        </Link>
                    </div>
                </div>

                {/* --- NAVIGATION BUTTONS (Updated) --- */}
                {/* Left Arrow: Ẩn trên mobile (hidden), Hiện trên Desktop (md:flex) + Hover Effect */}
                <button
                    onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-[var(--erg-blue)] text-white transition-all duration-500 ease-in-out backdrop-blur-md border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 transform hover:scale-110"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Right Arrow: Tương tự */}
                <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-[var(--erg-blue)] text-white transition-all duration-500 ease-in-out backdrop-blur-md border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 transform hover:scale-110"
                >
                    <ChevronRight size={24} />
                </button>

                {/* --- MOBILE DOTS INDICATOR (New) --- */}
                {/* Chỉ hiện trên mobile (md:hidden) để thay thế mũi tên */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:hidden z-20">
                    {HERO_SLIDES.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === index ? 'bg-[var(--erg-red)] w-8' : 'bg-white/50 w-2'}`}
                        />
                    ))}
                </div>
            </section>

            {/* 2. INTRO & CORE VALUES */}
            <section className="py-24 bg-white relative overflow-hidden">
                {/* [FIX] Giảm kích thước số 15 trên mobile (text-[120px]) để không chiếm hết màn hình */}
                <div className="absolute top-10 left-[-5%] lg:left-[-2%] text-[120px] lg:text-[300px] font-bold text-gray-100 opacity-50 select-none pointer-events-none -z-0 leading-none font-mono">
                </div>
                <GradientBlob color="bg-red-100" className="bottom-0 right-0 w-96 h-96 translate-x-1/3 translate-y-1/3" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                        {/* [FIX] Thay 'sticky top-24' thành 'lg:sticky lg:top-24'
                -> Mobile sẽ cuộn bình thường, không bị dính đè lên các thẻ bên dưới
            */}
                        <div className="lg:col-span-4 lg:sticky lg:top-24 relative">
                            <h4 className="flex items-center gap-2 text-[var(--erg-red)] font-bold uppercase tracking-widest text-sm mb-3">
                                <span className="w-8 h-[2px] bg-[var(--erg-red)]"></span>
                                Về chúng tôi
                            </h4>
                            <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)] mb-6 leading-snug">
                                Kiến tạo nền tảng vững chắc cho tương lai
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed text-justify relative">
                                Tại ERG Global, chúng tôi tin rằng mỗi học viên đều có tiềm năng riêng biệt. Với hơn 15 năm kinh nghiệm, chúng tôi cam kết mang đến môi trường giáo dục chuẩn quốc tế.
                            </p>
                            {/* Thêm whitespace-nowrap để chữ không bị rớt dòng xấu */}
                            <Link
                                href="/gioi-thieu"
                                className="group inline-flex items-center gap-2 text-[var(--erg-blue)] font-bold hover:text-[var(--erg-red)] transition-all whitespace-nowrap"
                            >
                                <span className="border-b-2 border-transparent group-hover:border-[var(--erg-red)] pb-0.5">Xem chi tiết</span>
                                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {CORE_VALUES.map((item, index) => (
                                <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-xl hover:border-[var(--erg-blue)]/30 hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[var(--erg-blue)] group-hover:text-white transition-all duration-300">
                                        <item.icon size={28} className="text-[var(--erg-blue)] group-hover:text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {item.content}
                                    </p>
                                </div>
                            ))}
                            <div className="bg-gradient-to-br from-[var(--erg-blue)] to-blue-900 p-8 rounded-2xl text-white flex flex-col justify-center items-center text-center relative overflow-hidden shadow-lg">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <h3 className="text-5xl font-bold mb-2 relative z-10">15+</h3>
                                <p className="text-blue-100 relative z-10">Năm kinh nghiệm đào tạo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. LĨNH VỰC ĐÀO TẠO */}
            <section className="py-20 bg-slate-50 relative overflow-hidden">
                {/* ... (Phần TechCircle giữ nguyên) ... */}
                <TechCircle className="w-[500px] h-[500px] -top-20 -right-20 border-[2px] opacity-10" />
                <TechCircle className="w-[400px] h-[400px] -top-10 -right-10 border-[1px] opacity-10" />
                <TechCircle className="w-[300px] h-[300px] top-40 -left-20 border-[1px] opacity-10" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="mb-12 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)]">Lĩnh vực đào tạo</h2>
                        <div className="w-20 h-1 bg-[var(--erg-red)] mt-4 rounded-full mx-auto md:mx-0"></div>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto md:mx-0">
                            Các chương trình đào tạo trọng điểm được thiết kế bám sát nhu cầu thực tế của doanh nghiệp.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {TRAINING_FIELDS.map((field) => {
                            // --- LOGIC MỚI: TÁI SỬ DỤNG getSubdomainLink ---

                            // 1. Tìm cấu hình subdomain
                            const programConfig = TRAINING_PROGRAMS.find(p => p.label === field.title);

                            // 2. Tạo URL: Nếu có config thì dùng hàm helper, không thì dùng link cũ
                            const targetUrl = programConfig
                                ? getSubdomainLink(programConfig.subdomain)
                                : field.link;

                            return (
                                <div key={field.id} className="bg-white rounded-2xl p-8 flex flex-col sm:flex-row gap-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-gray-100 group min-h-[280px]">
                                    <div className="w-full sm:w-1/2 rounded-xl overflow-hidden shrink-0 relative h-64 sm:h-auto">
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-500 z-10" />
                                        <img
                                            src={field.image}
                                            alt={field.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    <div className="flex flex-col h-full items-start justify-center flex-1">
                                        <h3 className="text-2xl font-bold text-[var(--erg-blue)] mb-3 group-hover:text-[var(--erg-red)] transition-colors">
                                            {field.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                            {field.description}
                                        </p>

                                        {/* Link đã được xử lý subdomain chuẩn xác */}
                                        <Link
                                            href={targetUrl}
                                            className="text-sm font-bold uppercase tracking-wider text-[var(--erg-red)] hover:underline underline-offset-4"
                                        >
                                            Xem chương trình &rarr;
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. TIN TỨC */}
            <section className="py-24 bg-white relative border-b border-gray-100 overflow-hidden">
                <DotGrid className="top-20 left-0 text-gray-400 hidden xl:block w-32 h-64" />
                <DotGrid className="bottom-20 right-0 text-gray-400 hidden xl:block w-32 h-64" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)] mb-2">Tin tức & Sự kiện</h2>
                            <div className="w-16 h-1 bg-[var(--erg-red)] rounded-full"></div>
                        </div>
                        <Link href="/tin-tuc" className="hidden md:flex items-center gap-2 text-gray-500 hover:text-[var(--erg-red)] transition-colors font-medium">
                            Xem tất cả <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {LATEST_NEWS.map((news) => (
                            <div key={news.id} className="group cursor-pointer flex flex-col h-full">
                                <div className="rounded-xl overflow-hidden mb-5 relative aspect-video shadow-md">
                                    <img
                                        src={news.image}
                                        alt={news.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--erg-blue)] shadow-sm flex flex-col items-center text-center leading-tight min-w-[50px]">
                                        <span className="text-[var(--erg-red)] text-lg block">{news.date.split('/')[0]}</span>
                                        <span className="text-[10px] text-gray-500 uppercase">Tháng {news.date.split('/')[1]}</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[var(--erg-blue)] transition-colors line-clamp-2">
                                    {news.title}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                                    {news.summary}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* 5. WHY CHOOSE US */}
            <section className="py-24 bg-blue-50/40 relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)] mb-3">Tại sao chọn ERG Global?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Sự khác biệt tạo nên thương hiệu đào tạo hàng đầu</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 relative">
                        {WHY_CHOOSE_US.map((item, index) => (
                            <div key={index} className="flex flex-col items-center text-center group relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-[var(--erg-red)] group-hover:bg-[var(--erg-red)] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                    <item.icon size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed px-6">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. TESTIMONIALS */}
            <section className="py-24 bg-white relative overflow-hidden">
                <GradientBlob color="bg-blue-100" className="top-1/4 left-0 w-[500px] h-[500px] -translate-x-1/2" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="mb-12 text-center md:text-left">
                        <h4 className="text-[var(--erg-red)] font-bold uppercase text-xs tracking-wider mb-2">Góc học viên</h4>
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)]">Cảm nhận học viên</h2>
                    </div>

                    {/* Thẻ bao ngoài có class 'group' để điều khiển trạng thái hover */}
                    <div className="relative group">

                        {/* [FIX] NÚT TRÁI
                - opacity-0: Bình thường ẩn
                - group-hover:opacity-100: Hover vào khung slider mới hiện
                - transition-all duration-300: Hiện ra mượt mà trong 0.3s
            */}
                        <button
                            onClick={() => scrollTestimonials('left')}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -mt-4 z-20 w-12 h-12 rounded-full border border-gray-200 items-center justify-center bg-white shadow-lg text-gray-500 hover:bg-[var(--erg-blue)] hover:text-white hover:border-[var(--erg-blue)] transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        {/* [FIX] NÚT PHẢI - Tương tự */}
                        <button
                            onClick={() => scrollTestimonials('right')}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 -mt-4 z-20 w-12 h-12 rounded-full border border-gray-200 items-center justify-center bg-white shadow-lg text-gray-500 hover:bg-[var(--erg-blue)] hover:text-white hover:border-[var(--erg-blue)] transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={24} />
                        </button>

                        <div
                            ref={testimonialRef}
                            className="flex overflow-x-auto gap-8 pb-10 snap-x no-scrollbar scroll-smooth px-1"
                        >
                            {TESTIMONIALS.map((item, index) => (
                                <div key={index} className="min-w-[320px] md:min-w-[400px] snap-center">
                                    <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] h-full border border-gray-50 flex flex-col relative overflow-hidden group hover:border-[var(--erg-blue)] transition-colors">
                                        <div className="absolute top-4 right-6 text-8xl text-gray-100 font-serif leading-none select-none font-bold opacity-50 group-hover:text-blue-50 transition-colors">”</div>

                                        <div className="flex items-center gap-1 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 italic mb-8 leading-relaxed text-base flex-grow relative z-10">
                                            "{item.content}"
                                        </p>
                                        <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-6">
                                            <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100" />
                                            <div>
                                                <h4 className="font-bold text-[var(--erg-blue)] text-base">{item.name}</h4>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}