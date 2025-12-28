'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Compass, Award, Users, BookOpen, Star, CheckCircle2, Globe, TrendingUp } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">

            {/* 1. HERO SECTION: Giới thiệu chung */}
            <section className="relative bg-[var(--erg-blue)] text-white py-24 overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[var(--erg-red)] opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block py-1 px-4 rounded-full bg-white/10 border border-white/20 text-sm font-semibold backdrop-blur-md mb-6">
                Về EduRise Global
            </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Kiến Tạo Tương Lai <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-400">
                    Công Dân Số Toàn Cầu
                </span>
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                        ERG không chỉ là trung tâm đào tạo tin học. Chúng tôi là người bạn đồng hành, xây dựng nền tảng công nghệ vững chắc cho thế hệ trẻ Việt Nam từ những bước đi đầu tiên đến khi trưởng thành.
                    </p>
                </div>
            </section>

            {/* 2. CÂU CHUYỆN CỦA CHÚNG TÔI (Mission & Vision) */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Hình ảnh minh họa (Bạn có thể thay bằng ảnh thật của trung tâm/lớp học) */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-[var(--erg-blue)] rounded-3xl transform rotate-3 opacity-10"></div>
                            <div className="relative bg-gray-200 rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                                {/* Placeholder ảnh */}
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                    <span className="text-sm">[Image: Giáo viên hướng dẫn học sinh]</span>
                                </div>
                            </div>
                            {/* Floating Card */}
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border-l-4 border-[var(--erg-red)] max-w-xs hidden md:block">
                                <div className="flex items-center gap-3 mb-2">
                                    <Users className="text-[var(--erg-red)]" />
                                    <span className="font-bold text-[var(--erg-blue)]">Học viên tiêu biểu</span>
                                </div>
                                <p className="text-sm text-gray-600">Hàng ngàn học viên đã đạt chứng chỉ quốc tế xuất sắc tại ERG.</p>
                            </div>
                        </div>

                        {/* Nội dung text */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-[var(--erg-blue)] mb-4">Sứ Mệnh & Tầm Nhìn</h2>
                                <p className="text-gray-600 leading-relaxed text-justify">
                                    Trong kỷ nguyên 4.0, năng lực số không còn là một "điểm cộng" mà là yêu cầu bắt buộc. Tại ERG, chúng tôi cam kết mang đến chương trình đào tạo chuẩn quốc tế, giúp học sinh Việt Nam tiếp cận với những tiêu chuẩn công nghệ tiên tiến nhất ngay từ ghế nhà trường.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Card Mission */}
                                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <Compass className="text-blue-600" size={24}/>
                                    </div>
                                    <h3 className="font-bold text-[var(--erg-blue)] mb-2">Sứ Mệnh</h3>
                                    <p className="text-sm text-gray-600">Chuẩn hóa kỹ năng tin học cho học sinh, sinh viên và người đi làm theo chuẩn quốc tế.</p>
                                </div>

                                {/* Card Vision */}
                                <div className="p-6 bg-red-50 rounded-2xl border border-red-100 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                        <Target className="text-[var(--erg-red)]" size={24}/>
                                    </div>
                                    <h3 className="font-bold text-[var(--erg-blue)] mb-2">Tầm Nhìn</h3>
                                    <p className="text-sm text-gray-600">Trở thành hệ thống đào tạo tin học hàng đầu, là bệ phóng cho nhân tài số Việt Nam.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. GIÁ TRỊ CỐT LÕI (Triết lý lộ trình) */}
            {/* Phần này giải thích sâu hơn về cái ảnh Roadmap */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-[var(--erg-red)] font-bold uppercase tracking-wider text-sm">Triết lý đào tạo</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)] mt-2">Lộ Trình Công Dân Số Toàn Diện</h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                            Chúng tôi thiết kế lộ trình học tập liền mạch, phù hợp với sự phát triển tư duy của từng lứa tuổi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Giai đoạn 1: Khởi động */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-blue-400 group hover:-translate-y-2 transition-transform duration-300">
                            <div className="mb-6 relative">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                    <Star size={32} />
                                </div>
                                <span className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Tiểu học</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--erg-blue)] mb-3">Khởi Tạo Tư Duy Số</h3>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                Giai đoạn vàng để trẻ làm quen với máy tính. Tập trung vào an toàn trực tuyến và đạo đức số.
                            </p>
                            <div className="pt-4 border-t border-gray-100">
                                <span className="font-bold text-sm text-blue-600">Chương trình: IC3 Spark</span>
                            </div>
                        </div>

                        {/* Giai đoạn 2: Tăng tốc */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-teal-500 group hover:-translate-y-2 transition-transform duration-300">
                            <div className="mb-6 relative">
                                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600">
                                    <TrendingUp size={32} />
                                </div>
                                <span className="absolute -top-3 -right-3 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">THCS</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--erg-blue)] mb-3">Phát Triển Năng Lực</h3>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                Thành thạo các ứng dụng văn phòng chủ chốt. Hình thành kỹ năng giải quyết vấn đề bằng công nghệ.
                            </p>
                            <div className="pt-4 border-t border-gray-100">
                                <span className="font-bold text-sm text-teal-600">Chương trình: IC3 GS6</span>
                            </div>
                        </div>

                        {/* Giai đoạn 3: Về đích */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-[#F25022] group hover:-translate-y-2 transition-transform duration-300">
                            <div className="mb-6 relative">
                                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-[#F25022]">
                                    <Award size={32} />
                                </div>
                                <span className="absolute -top-3 -right-3 bg-[#F25022] text-white text-xs font-bold px-3 py-1 rounded-full">THPT & ĐH</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--erg-blue)] mb-3">Chinh Phục Chuyên Gia</h3>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                Làm chủ hoàn toàn Microsoft Office. Chuẩn bị hành trang chuyên nghiệp cho môi trường làm việc toàn cầu.
                            </p>
                            <div className="pt-4 border-t border-gray-100">
                                <span className="font-bold text-sm text-[#F25022]">Chương trình: MOS</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 4. ĐỐI TÁC CHIẾN LƯỢC */}
            <section className="py-20 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-400 mb-10 uppercase tracking-widest">Đối Tác & Chứng Nhận</h2>

                    {/* Logo Partners - Bạn nên thay bằng ảnh logo thật */}
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">

                        {/* Logo IIG (Mô phỏng) */}
                        <div className="flex items-center gap-2 group">
                            <Globe size={40} className="text-blue-900"/>
                            <span className="text-2xl font-black text-blue-900">IIG<span className="text-red-600">VIETNAM</span></span>
                        </div>

                        {/* Logo Microsoft (Mô phỏng) */}
                        <div className="flex items-center gap-2 group">
                            <div className="grid grid-cols-2 gap-1">
                                <div className="w-4 h-4 bg-[#F25022]"></div>
                                <div className="w-4 h-4 bg-[#7FBA00]"></div>
                                <div className="w-4 h-4 bg-[#00A4EF]"></div>
                                <div className="w-4 h-4 bg-[#FFB900]"></div>
                            </div>
                            <span className="text-2xl font-bold text-gray-600">Microsoft</span>
                        </div>

                        {/* Logo Certiport (Mô phỏng) */}
                        <div className="flex items-center gap-2 group">
                            <Award size={40} className="text-orange-500"/>
                            <span className="text-2xl font-bold text-gray-700">CERTIPORT</span>
                        </div>

                    </div>
                </div>
            </section>

            {/* 5. STATS (Con số biết nói) */}
            <section className="py-16 bg-[var(--erg-blue)] text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-800/50">
                        <div>
                            <div className="text-4xl md:text-5xl font-black mb-2 text-yellow-400">5+</div>
                            <div className="text-blue-200 text-sm md:text-base">Năm kinh nghiệm</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black mb-2 text-yellow-400">1000+</div>
                            <div className="text-blue-200 text-sm md:text-base">Học viên theo học</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black mb-2 text-yellow-400">100%</div>
                            <div className="text-blue-200 text-sm md:text-base">Cam kết đầu ra</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black mb-2 text-yellow-400">20+</div>
                            <div className="text-blue-200 text-sm md:text-base">Giáo viên chất lượng</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CTA */}
            <section className="py-20 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-[var(--erg-blue)] mb-6">Bắt Đầu Hành Trình Của Bạn Tại ERG</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">Liên hệ ngay để được tư vấn lộ trình học tập phù hợp nhất với năng lực và mục tiêu của bạn.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/lien-he" className="px-8 py-3 bg-[var(--erg-red)] text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg">
                            Liên Hệ Ngay
                        </Link>
                        <Link href="/khoa-hoc" className="px-8 py-3 bg-white text-[var(--erg-blue)] border border-[var(--erg-blue)] font-bold rounded-lg hover:bg-blue-50 transition-colors">
                            Xem Khóa Học
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}