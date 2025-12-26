'use client';

import React from 'react';
import Image from 'next/image';
import { GraduationCap, Quote, Star, BookOpen, Facebook, Linkedin, Mail } from 'lucide-react';

// DATA MẪU (Dựa trên ảnh của bạn, nhưng đã tách text ra khỏi ảnh)
const TEACHERS = [
    {
        id: 1,
        name: "Thầy Ngô Xuân Trúc",
        role: "Kỹ Sư CNTT",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop", // Thay bằng ảnh chân dung thầy Trúc
        subjects: ["IC3 GS6", "MOS", "CNTT Cơ Bản"],
        quote: "Mỗi một học sinh đều là một câu chuyện riêng, vai trò của tôi là người lắng nghe, đồng hành cùng các em.",
        exp: "5+ Năm"
    },
    {
        id: 2,
        name: "Thầy Trần Tướng Tuấn",
        role: "Thạc Sĩ CNTT", // Giả định title
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=800&auto=format&fit=crop", // Thay bằng ảnh chân dung thầy Tuấn
        subjects: ["Lập trình", "IC3 Spark", "MOS Expert"],
        quote: "Công nghệ chỉ là một công cụ. Nhiệm vụ của chúng tôi là giúp các em làm chủ những công cụ đó trong tương lai.",
        exp: "8+ Năm"
    },
    {
        id: 3,
        name: "Thầy Trần Quốc Vương",
        role: "Kỹ Sư CNTT",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop", // Thay bằng ảnh chân dung thầy Vương
        subjects: ["IC3 GS6", "Tin học quốc tế"],
        quote: "Tin học ứng dụng lập trình giúp học sinh rèn luyện tư duy logic, tính thân thiện và khả năng sáng tạo.",
        exp: "4+ Năm"
    },
    {
        id: 4,
        name: "Thầy Trần Thanh Nhã",
        role: "Kỹ Sư CNTT",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop", // Thay bằng ảnh chân dung thầy Nhã
        subjects: ["Scratch", "IC3 Spark", "Tin học cơ bản"],
        quote: "Công nghệ không chỉ hiện diện trong lớp học, mà còn trở thành một phần trong tư duy và hành động.",
        exp: "6+ Năm"
    }
];

export default function TeachersPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* 1. HERO SECTION: Giới thiệu đội ngũ */}
            <section className="bg-[var(--erg-blue)] text-white py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--erg-red)] opacity-20 rounded-full blur-2xl"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Đội Ngũ Giáo Viên Tâm Huyết</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg font-light">
                        Những người truyền lửa đam mê công nghệ. Tại ERG, giáo viên không chỉ là người dạy kiến thức mà còn là người dẫn đường, khơi dậy tiềm năng số trong mỗi học viên.
                    </p>
                </div>
            </section>

            {/* 2. GRID GIÁO VIÊN */}
            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {TEACHERS.map((teacher) => (
                        <div key={teacher.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">

                            {/* Ảnh chân dung (Tỉ lệ 4:5 hoặc 1:1) */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
                                <img
                                    src={teacher.image}
                                    alt={teacher.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Overlay gradient khi hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--erg-blue)]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <div className="flex gap-3 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <a href="#" className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm"><Facebook size={18}/></a>
                                        <a href="#" className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm"><Linkedin size={18}/></a>
                                        <a href="#" className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm"><Mail size={18}/></a>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin chi tiết */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-[var(--erg-blue)]">{teacher.name}</h3>
                                        <p className="text-sm font-semibold text-[var(--erg-red)] flex items-center gap-1">
                                            <GraduationCap size={14}/> {teacher.role}
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">{teacher.exp}</span>
                                </div>

                                {/* Môn dạy (Tags) */}
                                <div className="flex flex-wrap gap-2 mb-4 mt-2">
                                    {teacher.subjects.map((sub, idx) => (
                                        <span key={idx} className="text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100">
                                    {sub}
                                </span>
                                    ))}
                                </div>

                                {/* Quote */}
                                <div className="mt-auto relative bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <Quote size={20} className="absolute -top-3 left-4 text-gray-300 bg-gray-50 px-1" />
                                    <p className="text-xs text-gray-600 italic leading-relaxed pt-1">
                                        "{teacher.quote}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. TUYỂN DỤNG (CTA) */}
            <section className="container mx-auto px-4 mt-20">
                <div className="bg-[var(--erg-blue)] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Trở Thành Một Phần Của ERG Team</h2>
                        <p className="text-blue-100 font-light">
                            Chúng tôi luôn tìm kiếm những giáo viên tài năng, tâm huyết để cùng nhau xây dựng môi trường giáo dục chất lượng cao.
                        </p>
                    </div>
                    <div className="relative z-10">
                        <a
                            href="https://tuyendung.erg.edu.vn"
                            target="_blank" // Thêm dòng này nếu muốn mở tab mới
                            rel="noopener noreferrer" // Bảo mật khi mở tab mới
                            className="px-8 py-3 bg-white text-[var(--erg-blue)] font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap inline-block"
                        >
                            Xem Vị Trí Tuyển Dụng
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}