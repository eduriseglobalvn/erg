'use client';

import React from 'react';
import { Flag, BookOpen, Trophy, Target } from 'lucide-react';

export default function RoadmapPage() {
    return (
        <div className="min-h-screen bg-white">

            {/* 1. HERO SECTION: Chữ to hơn, thoáng hơn */}
            <section className="bg-[var(--erg-blue)] text-white py-28 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
                        <Target size={20} className="text-yellow-400" />
                        <span className="text-base font-bold tracking-wide text-yellow-100 uppercase">Lộ trình chuẩn quốc tế</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 uppercase tracking-tight leading-tight">
                        Kế Hoạch Đào Tạo <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-red-400">& Luyện Thi</span>
                    </h1>
                    <p className="text-blue-100 max-w-3xl mx-auto text-xl md:text-2xl font-light leading-relaxed">
                        Chi tiết từng giai đoạn học tập và ôn luyện, đảm bảo học viên tự tin chinh phục chứng chỉ IC3 & MOS.
                    </p>
                </div>
            </section>

            {/* 2. PHẦN 1: LỘ TRÌNH HỌC TRONG NĂM (Big Timeline) */}
            <section className="py-24 bg-gray-50 relative overflow-hidden">
                {/* Lưới nền mờ */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                     style={{backgroundImage: `linear-gradient(#00008b 1px, transparent 1px), linear-gradient(90deg, #00008b 1px, transparent 1px)`, backgroundSize: '60px 60px'}}>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--erg-blue)] uppercase flex items-center justify-center gap-4">
                            <BookOpen className="text-[var(--erg-red)]" size={48}/> Lộ Trình Học
                        </h2>
                        <div className="w-32 h-2 bg-[var(--erg-red)] mx-auto mt-6 rounded-full"></div>
                    </div>

                    {/* Container mở rộng max-w-7xl để chứa card to */}
                    <div className="relative max-w-7xl mx-auto">

                        {/* TRỤC GIỮA (To hơn) */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-4 md:w-8 bg-gray-300 transform md:-translate-x-1/2 rounded-full shadow-inner"></div>
                        <div className="absolute left-10 md:left-1/2 top-0 bottom-0 w-0 border-l-2 border-dashed border-white h-full transform md:-translate-x-[1px] z-0"></div>

                        {/* --- STEP 1 --- */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between mb-20 md:mb-32 group">
                            <div className="md:w-1/2 md:pr-20 pl-24 md:pl-0 w-full">
                                {/* Card to hơn (p-10), Chữ to hơn */}
                                <div className="bg-white p-10 rounded-3xl shadow-xl border-l-8 border-[var(--erg-red)] relative hover:-translate-y-2 transition-transform duration-300">
                                    {/* Mũi tên chỉ hướng */}
                                    <div className="hidden md:block absolute top-1/2 -right-4 w-6 h-6 bg-white transform -translate-y-1/2 rotate-45 border-r border-t border-gray-100"></div>

                                    <span className="inline-block px-4 py-2 bg-red-50 text-[var(--erg-red)] text-sm md:text-base font-bold rounded-lg mb-4 border border-red-100">
                                THÁNG 9 - 10
                            </span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--erg-blue)] mb-3">Khởi động năm học</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Bắt đầu giảng dạy nội dung chương trình HK1 theo khung chương trình chuẩn của bộ môn Tin học quốc tế.
                                    </p>
                                </div>
                            </div>
                            {/* Nút tròn to hơn (w-16 h-16) */}
                            <div className="absolute left-8 md:left-1/2 w-16 h-16 bg-[var(--erg-red)] rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold text-2xl transform -translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                                1
                            </div>
                            <div className="md:w-1/2"></div>
                        </div>

                        {/* --- STEP 2 --- */}
                        <div className="relative flex flex-col md:flex-row-reverse items-center justify-between mb-20 md:mb-32 group">
                            <div className="md:w-1/2 md:pl-20 pl-24 w-full">
                                <div className="bg-white p-10 rounded-3xl shadow-xl border-r-8 md:border-r-8 md:border-l-0 border-l-8 border-orange-500 relative hover:-translate-y-2 transition-transform duration-300">
                                    <div className="hidden md:block absolute top-1/2 -left-4 w-6 h-6 bg-white transform -translate-y-1/2 -rotate-45 border-l border-t border-gray-100"></div>

                                    <span className="inline-block px-4 py-2 bg-orange-50 text-orange-600 text-sm md:text-base font-bold rounded-lg mb-4 border border-orange-100">
                                THÁNG 11
                            </span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--erg-blue)] mb-3">Làm quen công cụ thi</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Học sinh làm quen, nắm rõ thao tác phần mềm giả lập thi Gmetrix để chuẩn bị tâm lý vững vàng.
                                    </p>
                                </div>
                            </div>
                            <div className="absolute left-8 md:left-1/2 w-16 h-16 bg-orange-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold text-2xl transform -translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                                2
                            </div>
                            <div className="md:w-1/2"></div>
                        </div>

                        {/* --- STEP 3 --- */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between mb-20 md:mb-32 group">
                            <div className="md:w-1/2 md:pr-20 pl-24 md:pl-0 w-full">
                                <div className="bg-white p-10 rounded-3xl shadow-xl border-l-8 border-yellow-500 relative hover:-translate-y-2 transition-transform duration-300">
                                    <div className="hidden md:block absolute top-1/2 -right-4 w-6 h-6 bg-white transform -translate-y-1/2 rotate-45 border-r border-t border-gray-100"></div>

                                    <span className="inline-block px-4 py-2 bg-yellow-50 text-yellow-600 text-sm md:text-base font-bold rounded-lg mb-4 border border-yellow-100">
                                THÁNG 12
                            </span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--erg-blue)] mb-3">Đánh giá Lần 1</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Ôn luyện đề chuẩn. Tiến hành kiểm tra đánh giá năng lực, phân loại học sinh để có phương án bồi dưỡng phù hợp.
                                    </p>
                                </div>
                            </div>
                            <div className="absolute left-8 md:left-1/2 w-16 h-16 bg-yellow-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold text-2xl transform -translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                                3
                            </div>
                            <div className="md:w-1/2"></div>
                        </div>

                        {/* --- STEP 4 --- */}
                        <div className="relative flex flex-col md:flex-row-reverse items-center justify-between mb-20 md:mb-32 group">
                            <div className="md:w-1/2 md:pl-20 pl-24 w-full">
                                <div className="bg-white p-10 rounded-3xl shadow-xl border-r-8 md:border-r-8 md:border-l-0 border-l-8 border-blue-500 relative hover:-translate-y-2 transition-transform duration-300">
                                    <div className="hidden md:block absolute top-1/2 -left-4 w-6 h-6 bg-white transform -translate-y-1/2 -rotate-45 border-l border-t border-gray-100"></div>

                                    <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 text-sm md:text-base font-bold rounded-lg mb-4 border border-blue-100">
                                THÁNG 1 - 2
                            </span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--erg-blue)] mb-3">Chương trình HK2</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Tiếp tục giảng dạy nội dung chương trình HK2 theo khung chương trình chuẩn của bộ môn Tin học quốc tế.
                                    </p>
                                </div>
                            </div>
                            <div className="absolute left-8 md:left-1/2 w-16 h-16 bg-blue-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold text-2xl transform -translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                                4
                            </div>
                            <div className="md:w-1/2"></div>
                        </div>

                        {/* --- STEP 5 --- */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between group">
                            <div className="md:w-1/2 md:pr-20 pl-24 md:pl-0 w-full">
                                <div className="bg-white p-10 rounded-3xl shadow-xl border-l-8 border-indigo-600 relative hover:-translate-y-2 transition-transform duration-300">
                                    <div className="hidden md:block absolute top-1/2 -right-4 w-6 h-6 bg-white transform -translate-y-1/2 rotate-45 border-r border-t border-gray-100"></div>

                                    <span className="inline-block px-4 py-2 bg-indigo-50 text-indigo-600 text-sm md:text-base font-bold rounded-lg mb-4 border border-indigo-100">
                                ĐẦU THÁNG 3
                            </span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--erg-blue)] mb-3">Đánh giá Lần 2</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Tổng kiểm tra kiến thức toàn diện. Phân loại học sinh lần cuối trước khi bước vào giai đoạn luyện thi nước rút.
                                    </p>
                                </div>
                            </div>
                            <div className="absolute left-8 md:left-1/2 w-16 h-16 bg-indigo-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold text-2xl transform -translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                                5
                            </div>
                            <div className="md:w-1/2"></div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. PHẦN 2: LỘ TRÌNH LUYỆN THI (To và Rõ) */}
            <section className="py-24 bg-white border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 mb-4 border border-red-100">
                            <Flag size={18} className="text-[var(--erg-red)]" />
                            <span className="text-sm font-bold text-[var(--erg-red)] uppercase tracking-wide">Giai đoạn nước rút</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--erg-blue)] uppercase">
                            Lộ Trình Về Đích
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop Only - Wide Screens) */}
                        <div className="hidden xl:block absolute top-16 left-0 w-full h-2 bg-gray-100 -z-10 rounded-full"></div>

                        {/* Card 1 */}
                        <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:border-[var(--erg-red)] transition-all duration-300 group h-full flex flex-col">
                            <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform border-8 border-white shadow-xl">
                                <span className="text-5xl font-black text-[var(--erg-red)]">01</span>
                            </div>
                            <div className="text-center flex-1">
                                <h4 className="text-base font-bold text-gray-400 uppercase mb-2 tracking-wide">Giữa Tháng 3</h4>
                                <h3 className="text-2xl font-bold text-[var(--erg-blue)] mb-3">Phân Loại</h3>
                                <p className="text-lg text-gray-600 leading-relaxed">Tiếp tục ôn luyện theo nhóm trình độ, bám sát năng lực từng em.</p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:border-orange-500 transition-all duration-300 group h-full flex flex-col">
                            <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform border-8 border-white shadow-xl">
                                <span className="text-5xl font-black text-orange-500">02</span>
                            </div>
                            <div className="text-center flex-1">
                                <h4 className="text-base font-bold text-gray-400 uppercase mb-2 tracking-wide">Cuối Tháng 3</h4>
                                <h3 className="text-2xl font-bold text-[var(--erg-blue)] mb-3">Tổng Ôn</h3>
                                <p className="text-lg text-gray-600 leading-relaxed">Hệ thống hóa toàn bộ kiến thức, luyện các bộ đề sát sườn nhất.</p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:border-yellow-500 transition-all duration-300 group h-full flex flex-col">
                            <div className="w-32 h-32 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform border-8 border-white shadow-xl">
                                <span className="text-5xl font-black text-yellow-500">03</span>
                            </div>
                            <div className="text-center flex-1">
                                <h4 className="text-base font-bold text-gray-400 uppercase mb-2 tracking-wide">Tháng 4</h4>
                                <h3 className="text-2xl font-bold text-[var(--erg-blue)] mb-3">Thi Thử</h3>
                                <p className="text-lg text-gray-600 leading-relaxed">Tổ chức thi thử nghiêm túc như thi thật. Rèn bản lĩnh phòng thi.</p>
                            </div>
                        </div>

                        {/* Card 4 (Finish) */}
                        <div className="bg-gradient-to-br from-[var(--erg-blue)] to-blue-700 p-8 rounded-3xl shadow-2xl transform xl:scale-105 relative overflow-hidden group h-full flex flex-col border-4 border-blue-200">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 border-8 border-white/10 shadow-inner backdrop-blur-sm">
                                <Trophy size={60} className="text-yellow-300" fill="currentColor"/>
                            </div>
                            <div className="text-center text-white flex-1">
                                <h4 className="text-base font-bold text-blue-200 uppercase mb-2 tracking-wide">Tháng 5</h4>
                                <h3 className="text-3xl font-bold mb-3 text-yellow-300">THI CHỨNG CHỈ</h3>
                                <p className="text-lg text-blue-100 leading-relaxed">Chính thức tham gia kỳ thi và nhận chứng chỉ quốc tế.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 4. CTA FOOTER - To hơn */}
            <section className="bg-gray-50 py-24 border-t border-gray-200">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)] mb-6">Bạn Đã Sẵn Sàng?</h3>
                    <p className="text-gray-600 mb-10 text-xl max-w-2xl mx-auto">Đừng để lỡ "thời điểm vàng". Đăng ký ngay để nhận lộ trình chi tiết cho con em mình.</p>
                    <a className="px-12 py-5 bg-[var(--erg-red)] text-white font-bold text-xl rounded-xl hover:bg-red-700 transition-all shadow-xl hover:shadow-red-200 transform hover:-translate-y-1"
                    href="/lien-he">
                        Đăng Ký Tư Vấn Ngay
                    </a>
                </div>
            </section>

        </div>
    );
}