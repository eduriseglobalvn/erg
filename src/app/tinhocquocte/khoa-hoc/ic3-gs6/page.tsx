'use client';

import React from 'react';
import { Layers, CheckCircle, BookOpen, Phone } from 'lucide-react';

export default function IC3GS6Page() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* HEADER: Màu đặc trưng của IC3 (Teal/Green) */}
            <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white py-20 relative">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        <span className="text-xs font-bold uppercase tracking-wider">Chứng chỉ quốc tế</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">IC3 Digital Literacy <br/><span className="text-teal-200">Global Standard 6</span></h1>
                    <p className="text-teal-50 text-lg max-w-2xl border-l-4 border-teal-300 pl-4">
                        Chuẩn hóa năng lực công nghệ thông tin theo tiêu chuẩn toàn cầu mới nhất do Certiport (Hoa Kỳ) cấp.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-20">

                {/* LEFT CONTENT */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Tổng quan */}
                    <section className="bg-white p-8 rounded-xl shadow-md border-t-4 border-[var(--erg-blue)]">
                        <h2 className="text-2xl font-bold text-[var(--erg-blue)] mb-4">Tổng Quan Chương Trình</h2>
                        <p className="text-gray-600 leading-relaxed text-justify">
                            Chương trình đào tạo chuẩn quốc tế, trang bị kiến thức và kỹ năng sử dụng máy tính, Internet và phần mềm văn phòng cơ bản. Đây là chuẩn đánh giá được công nhận toàn cầu và là thước đo năng lực công nghệ chính xác nhất hiện nay.
                        </p>
                    </section>

                    {/* Cấu trúc 3 Level (Brochure ảnh 2) */}
                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold text-[var(--erg-blue)] mb-6 flex items-center gap-2">
                            <Layers className="text-[var(--erg-red)]" /> Cấu Trúc Đào Tạo
                        </h2>

                        <div className="space-y-4">
                            {/* Level 1 */}
                            <div className="group border border-gray-100 rounded-lg p-5 hover:border-[var(--erg-blue)] hover:shadow-lg transition-all duration-300 bg-gray-50">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-4xl font-black text-gray-200 group-hover:text-[var(--erg-red)] transition-colors">01</span>
                                    <h3 className="text-xl font-bold text-[var(--erg-blue)]">Level 1 - Nhập môn</h3>
                                </div>
                                <p className="text-gray-600 pl-[3.5rem]">Nắm vững các khái niệm cơ bản và yếu tố nền tảng về CNTT.</p>
                            </div>

                            {/* Level 2 */}
                            <div className="group border border-gray-100 rounded-lg p-5 hover:border-[var(--erg-blue)] hover:shadow-lg transition-all duration-300 bg-gray-50">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-4xl font-black text-gray-200 group-hover:text-[var(--erg-red)] transition-colors">02</span>
                                    <h3 className="text-xl font-bold text-[var(--erg-blue)]">Level 2 - Thực hành</h3>
                                </div>
                                <p className="text-gray-600 pl-[3.5rem]">Rèn luyện kỹ năng ứng dụng công nghệ vào thực tế và làm chủ các công cụ số thiết yếu.</p>
                            </div>

                            {/* Level 3 */}
                            <div className="group border border-gray-100 rounded-lg p-5 hover:border-[var(--erg-blue)] hover:shadow-lg transition-all duration-300 bg-gray-50">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-4xl font-black text-gray-200 group-hover:text-[var(--erg-red)] transition-colors">03</span>
                                    <h3 className="text-xl font-bold text-[var(--erg-blue)]">Level 3 - Nâng cao</h3>
                                </div>
                                <p className="text-gray-600 pl-[3.5rem]">Phát triển tư duy số chuyên sâu và năng lực vận hành công nghệ ở trình độ cao.</p>
                            </div>
                        </div>
                    </section>

                    {/* 7 Chuyên đề (Brochure ảnh 2) */}
                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold text-[var(--erg-blue)] mb-6 flex items-center gap-2">
                            <BookOpen className="text-[var(--erg-red)]" /> 7 Chuyên Đề Trọng Tâm
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
                            {[
                                "Công nghệ thông tin cơ bản",
                                "Công dân trong kỷ nguyên số",
                                "Quản lý và xử lý thông tin",
                                "Tư duy sáng tạo & tạo nội dung số",
                                "Giao tiếp và truyền thông số",
                                "Làm việc trực tuyến và cộng tác",
                                "An toàn và bảo mật thông tin"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                    <span className="font-medium text-gray-700 text-sm md:text-base">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="lg:col-span-4 space-y-6 pt-10 lg:pt-0">
                    <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-[var(--erg-red)] sticky top-24">
                        <h3 className="text-xl font-bold text-[var(--erg-blue)] mb-1">Đăng ký tư vấn</h3>
                        <p className="text-gray-500 text-sm mb-6">Nhận lộ trình học chi tiết cho con</p>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Cấp độ:</span>
                                <span className="font-bold text-[var(--erg-blue)]">Level 1, 2, 3</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Chứng chỉ:</span>
                                <span className="font-bold text-teal-600">Certiport (Mỹ)</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Hình thức:</span>
                                <span className="font-bold text-gray-800">Online, Offline</span>
                            </div>
                        </div>

                        <button className="w-full py-3.5 bg-[var(--erg-red)] text-white font-bold rounded-lg hover:bg-red-700 transition-transform active:scale-95 uppercase shadow-lg shadow-red-200">
                            Tư vấn ngay
                        </button>

                        {/*<div className="mt-4 text-center">*/}
                        {/*    <span className="text-xs text-gray-400">Hotline hỗ trợ 24/7</span>*/}
                        {/*    <div className="text-[var(--erg-blue)] font-bold text-lg flex justify-center items-center gap-2">*/}
                        {/*        <Phone size={18}/> 0766.144.888*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}