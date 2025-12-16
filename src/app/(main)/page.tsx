'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Users, Award, BookOpen, CheckCircle, Quote, ChevronLeft, ChevronRight, Monitor, Globe, Handshake } from 'lucide-react';
import { HERO_SLIDES, COURSES, NEWS, TESTIMONIALS, WHY_CHOOSE_US } from '@/mocks/constants';

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const testimonialRef = useRef<HTMLDivElement>(null);

    // --- Auto Slide Hero ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    // --- Logic cuộn Testimonial ---
    useEffect(() => {
        const autoScrollTestimonials = () => {
            if (testimonialRef.current) {
                const { current } = testimonialRef;
                const firstCard = current.firstElementChild as HTMLElement;
                const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 400;
                const maxScrollLeft = current.scrollWidth - current.clientWidth;

                if (current.scrollLeft >= maxScrollLeft - 10) {
                    current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        };

        const testimonialTimer = setInterval(autoScrollTestimonials, 4000);
        return () => clearInterval(testimonialTimer);
    }, []);

    const scrollTestimonials = (direction: 'left' | 'right') => {
        if (testimonialRef.current) {
            const { current } = testimonialRef;
            const firstCard = current.firstElementChild as HTMLElement;
            const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 400;

            const targetScroll = direction === 'left'
                ? current.scrollLeft - scrollAmount
                : current.scrollLeft + scrollAmount;

            current.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
    };

    const INFO_BAR_ITEMS = [
        {
            title: "Đào tạo Tin học cơ bản đến chuyên sâu",
            content: "Chúng tôi bồi dưỡng tin học văn phòng từ cơ bản đến nâng cao, lấy chất lượng làm gốc, cam kết đầu ra thành thạo tin học văn phòng.",
            bgColor: "bg-[#29b6f6]",
            icon: Monitor,
        },
        {
            title: "Chứng chỉ quốc tế IC3 Spark, IC3, MOS",
            content: "ERG cam kết đầu ra chứng chỉ tin học quốc tế, không chỉ là tấm bằng mà là hành trang cho tương lai của bạn.",
            bgColor: "bg-[#8bc34a]",
            icon: Award,
        },
        {
            title: "Đào tạo theo chương trình chuẩn quốc tế",
            content: "Chúng tôi mang tới cho bạn trải nghiệm học chất lượng cao, kiến thức vững chắc mà quốc tế công nhận.",
            bgColor: "bg-[#5c6bc0]",
            icon: Globe,
        },
        {
            title: "Hợp tác đào tạo tại cơ sở của bạn",
            content: "ERG sẵn sàng hợp tác triển khai đào tạo Tin học ngay tại cơ sở của quý đơn vị.",
            bgColor: "bg-[#ef5350]",
            icon: Handshake,
        }
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative h-[500px] md:h-[calc(100vh-65px)] lg:h-[600px] overflow-hidden bg-gray-900">
                {HERO_SLIDES.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 flex items-center justify-center text-center">
                            <div className="container mx-auto px-4">
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-md">
                                    {slide.title}
                                </h2>
                                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-sm">
                                    {slide.subtitle}
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <Link
                                        href="/lo-trinh"
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg"
                                    >
                                        Xem lộ trình chi tiết
                                    </Link>
                                    <Link
                                        href="/lien-he"
                                        className="bg-white hover:bg-gray-100 text-blue-900 px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
                                    >
                                        Tư vấn ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {HERO_SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentSlide ? 'bg-white' : 'bg-white/40'
                            }`}
                        />
                    ))}
                </div>
            </section>

            {/* Info Colors Bar Section */}
            <section className="w-full bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {INFO_BAR_ITEMS.map((item, index) => (
                        <div
                            key={index}
                            className={`${item.bgColor} p-8 md:p-10 text-center text-white flex flex-col items-center justify-start h-full group relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:z-10 cursor-default border-b md:border-b-0 md:border-r border-white/10 last:border-0`}
                        >
                            <div className="mb-6 relative">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                    <item.icon size={32} className="text-white" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-4 leading-tight min-h-[3.5rem] flex items-center justify-center">
                                {item.title}
                            </h3>

                            <div className="w-12 h-1 bg-white/40 mb-6 rounded-full group-hover:w-24 transition-all duration-300"></div>

                            <p className="text-white/90 text-sm md:text-base leading-relaxed opacity-90 group-hover:opacity-100">
                                {item.content}
                            </p>

                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Tại sao nên chọn ERG?</h2>
                        <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-x-12 gap-y-16">
                        {WHY_CHOOSE_US.map((item, index) => (
                            <div key={index} className="flex gap-6 items-start">
                                <div className="shrink-0 relative group">
                                    <div className="w-16 h-16 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300">
                                        <item.icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <div className="absolute top-0 right-0 -mr-2 -mt-2 w-16 h-16 bg-blue-100 rounded-full -z-0"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Courses - ĐÃ CHỈNH SỬA THEO YÊU CẦU: VIỀN TRẮNG + KHÔNG CẮT ẢNH */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lộ trình đào tạo</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-clip whitespace-nowrap">
                            Đa dạng các khóa học từ cơ bản đến nâng cao, đáp ứng mọi nhu cầu học tập của học sinh.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {COURSES.slice(0, 4).map((course) => (
                            <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow overflow-hidden group flex flex-col sm:flex-row h-full">

                                {/* --- CHỈNH SỬA TẠI ĐÂY --- */}
                                {/* 1. bg-white: Nền trắng.
                    2. p-2: Padding 2 (8px) tạo viền trắng xung quanh ảnh. */}
                                <div className="relative w-full sm:w-2/5 shrink-0 bg-white p-2">

                                    {/* 1. aspect-[3/4]: Tỷ lệ khung dọc, giúp khung trên Mobile cao to, dễ nhìn.
                      2. rounded-xl: Bo góc ảnh bên trong.
                      3. border border-gray-100: Viền mờ nhẹ bao quanh ảnh (tuỳ chọn cho đẹp). */}
                                    <div className="aspect-[3/4] sm:aspect-[3/4] sm:h-full w-full relative rounded-xl overflow-hidden border border-gray-100">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            /* object-contain: Giữ nguyên vẹn ảnh, không cắt đầu đuôi. */
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Badge */}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-wide shadow-sm border border-gray-100">
                                        {course.category}
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="p-6 flex flex-col w-full sm:w-3/5">
                                    <h3 className="text-xl md:text-2xl font-bold text-[#0ea5e9] mb-3 leading-tight group-hover:text-blue-700 transition-colors">
                                        {course.title}
                                    </h3>

                                    <div className="mb-4 space-y-1.5 text-gray-700">
                                        <p className="flex items-center gap-2">
                                            <span className="text-orange-500 font-bold">Hình thức:</span>
                                            <span className="font-medium">{course.format || 'Online & Offline'}</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="text-orange-500 font-bold">Thời lượng:</span>
                                            <span className="font-medium">{course.duration}</span>
                                        </p>
                                    </div>

                                    {course.curriculum && (
                                        <ul className="space-y-1.5 mb-6 flex-grow">
                                            {course.curriculum.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <span className="text-black text-lg leading-4">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div className="mt-auto">
                                        <Link href="/khoa-hoc" className="inline-block text-blue-600 font-bold hover:underline">
                                            Xem chi tiết &gt;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link
                            href="/khoa-hoc"
                            className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-colors"
                        >
                            Xem tất cả khóa học
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-blue-900 text-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: 'Học viên', value: '2500+', icon: Users },
                            { label: 'Giáo viên', value: '50+', icon: Award },
                            { label: 'Khóa học', value: '30+', icon: BookOpen },
                            { label: 'Hài lòng', value: '98%', icon: Star },
                        ].map((stat, index) => (
                            <div key={index} className="p-4">
                                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <stat.icon size={32} />
                                </div>
                                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                                <p className="text-blue-200">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 translate-y-1/3"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">

                    {/* Header Section */}
                    <div className="flex flex-col items-center text-center mb-12">
                        <div className="max-w-3xl">

                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                                Học viên nói gì về ERG?
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Sự hài lòng của phụ huynh và học sinh là minh chứng rõ nhất cho chất lượng đào tạo của chúng tôi.
                            </p>
                        </div>
                    </div>

                    {/* --- SLIDER CONTAINER --- */}
                    <div className="relative group">

                        {/* Nút Previous (Trái) */}
                        <button
                            onClick={() => scrollTestimonials('left')}
                            /* - hidden md:flex: Ẩn trên mobile, hiện trên PC/Tablet
                               - -mt-4: Kéo nút lên một chút để bù cho phần padding dưới (pb-8) của danh sách thẻ
                            */
                            className="hidden md:flex absolute top-1/2 -left-4 xl:-left-6 transform -translate-y-1/2 -mt-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition-all"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        {/* Danh sách các thẻ */}
                        {/* pb-8: Padding dưới để chứa shadow của thẻ */}
                        <div
                            ref={testimonialRef}
                            className="flex overflow-x-auto gap-6 pb-8 px-2 snap-x no-scrollbar scroll-smooth items-stretch"
                        >
                            {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
                                <div
                                    key={`${item.id}-${index}`}
                                    className="w-[340px] flex-shrink-0 snap-center"
                                >
                                    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 h-full flex flex-col relative transition-transform duration-300 hover:-translate-y-1">

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                                                ))}
                                            </div>
                                            <Quote className="text-blue-100 rotate-180 transform scale-x-[-1]" size={40} fill="currentColor" />
                                        </div>

                                        <p className="text-gray-600 italic leading-relaxed text-base mb-6 flex-grow line-clamp-4">
                                            {item.content}
                                        </p>

                                        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
                                            <img
                                                src={item.avatar}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-50 flex-shrink-0"
                                            />
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
                                                <p className="text-blue-600 font-medium text-xs">{item.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Nút Next (Phải) */}
                        <button
                            onClick={() => scrollTestimonials('right')}
                            /* Tương tự nút trái: Ẩn trên mobile và chỉnh lại vị trí cho giữa tâm thẻ */
                            className="hidden md:flex absolute top-1/2 -right-4 xl:-right-6 transform -translate-y-1/2 -mt-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition-all"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight size={24} />
                        </button>

                    </div>
                </div>
            </section>
            {/* Intro Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Students"
                                className="rounded-2xl shadow-xl w-full"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-xl hidden md:block shadow-lg">
                                <p className="text-4xl font-bold mb-1">15+</p>
                                <p className="text-sm font-medium">Năm kinh nghiệm</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-blue-600 font-bold uppercase tracking-wide mb-2">Về chúng tôi</h4>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Kiến tạo nền tảng vững chắc cho tương lai
                            </h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Tại ERG, chúng tôi tin rằng mỗi học sinh đều có những tiềm năng riêng biệt cần được khơi dậy.
                                Với phương pháp giáo dục hiện đại, kết hợp giữa lý thuyết và thực hành, chúng tôi cam kết mang
                                đến môi trường học tập tốt nhất.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Đội ngũ giáo viên giàu kinh nghiệm, tâm huyết.',
                                    'Cơ sở vật chất hiện đại, môi trường học tập an toàn.',
                                    'Chương trình học chuẩn quốc tế, cập nhật liên tục.',
                                    'Cam kết đầu ra, hỗ trợ học sinh tối đa.',
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="text-green-500 shrink-0" size={20} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/gioi-thieu"
                                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
                            >
                                Xem thêm về chúng tôi <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}