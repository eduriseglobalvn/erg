'use client';

import React from 'react';
import Link from 'next/link';
import {
    ArrowRight, CheckCircle2, Award, Users, BookOpen,
    MonitorPlay, GraduationCap, ArrowUpRight
} from 'lucide-react';
import { TRAINING_FIELDS } from "@/mocks/main.constants";

export default function TrainingFieldsPage() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans text-slate-800">

            {/* --- 1. HERO SECTION (MỚI) --- */}
            <section className="relative pt-20 pb-24 overflow-hidden" style={{ backgroundColor: '#00008b' }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-yellow-400 mb-6 backdrop-blur-sm">
                        Chương trình đào tạo chuẩn quốc tế
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Khơi Nguồn Trí Tuệ <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                            Dẫn Lối Tương Lai
                        </span>
                    </h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Hệ thống đào tạo đa dạng từ Tin học văn phòng đến Công nghệ cao, giúp bạn tự tin làm chủ công nghệ và bứt phá trong sự nghiệp.
                    </p>
                </div>
            </section>

            {/* --- 2. STATS SECTION (CON SỐ ẤN TƯỢNG) --- */}
            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border border-gray-100">
                    {[
                        { num: "8+", label: "Năm kinh nghiệm", icon: <Award className="w-6 h-6 text-[#cc0022]" /> },
                        { num: "50+", label: "Khóa học chuyên sâu", icon: <BookOpen className="w-6 h-6 text-[#cc0022]" /> },
                        { num: "20k+", label: "Học viên tiêu biểu", icon: <Users className="w-6 h-6 text-[#cc0022]" /> },
                        { num: "100%", label: "Cam kết chất lượng", icon: <CheckCircle2 className="w-6 h-6 text-[#cc0022]" /> },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="mb-3 bg-red-50 p-3 rounded-full">{stat.icon}</div>
                            <span className="text-3xl font-black text-[#00008b] mb-1">{stat.num}</span>
                            <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- 3. MAIN CONTENT: DANH SÁCH LĨNH VỰC --- */}
            <div className="container mx-auto px-4 py-24">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#00008b' }}>
                        Các Lĩnh Vực Đào Tạo
                    </h2>
                    <div className="w-20 h-1.5 mx-auto rounded-full mb-6" style={{ backgroundColor: '#cc0022' }}></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Được thiết kế lộ trình bài bản, cập nhật xu hướng công nghệ mới nhất và cấp chứng chỉ có giá trị toàn cầu.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {TRAINING_FIELDS.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-stretch relative overflow-hidden"
                        >
                            {/* Thanh màu trang trí bên trái khi hover */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#cc0022] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>

                            {/* Image Area */}
                            <div className="w-full md:w-5/12 h-56 md:h-auto shrink-0 relative overflow-hidden rounded-xl">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="bg-white/90 backdrop-blur-sm text-[#00008b] p-3 rounded-full">
                                        <ArrowUpRight size={24} />
                                    </span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 py-1 pr-2 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 rounded bg-blue-50 text-[#00008b] text-[10px] font-bold uppercase tracking-wider">
                                            Chương trình
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 transition-colors group-hover:text-[#cc0022]" style={{ color: '#00008b' }}>
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Action Link */}
                                <Link
                                    href={item.link}
                                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:gap-3 transition-all mt-auto group/btn w-fit"
                                    style={{ color: '#cc0022' }}
                                >
                                    Xem chi tiết
                                    <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform"/>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- 4. WHY CHOOSE ERG (LÝ DO CHỌN) --- */}
            <section className="bg-white py-20 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="text-center px-4">
                            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-[#00008b] mb-6">
                                <GraduationCap size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-gray-900">Giảng viên chuyên gia</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Đội ngũ giảng viên giàu kinh nghiệm thực chiến, có chứng chỉ sư phạm quốc tế và tận tâm với học viên.</p>
                        </div>
                        <div className="text-center px-4">
                            <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center text-[#cc0022] mb-6">
                                <MonitorPlay size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-gray-900">Thực hành chuyên sâu</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Thời lượng thực hành chiếm 70%, học trên dự án thực tế giúp học viên thành thạo kỹ năng ngay tại lớp.</p>
                        </div>
                        <div className="text-center px-4">
                            <div className="w-16 h-16 mx-auto bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 mb-6">
                                <Award size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-gray-900">Chứng chỉ uy tín</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Hỗ trợ thi và cấp các chứng chỉ Quốc tế (MOS, IC3) và Quốc gia, có giá trị trọn đời trên toàn cầu.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 5. CTA SECTION (KÊU GỌI HÀNH ĐỘNG) --- */}
            <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#00008b' }}>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Bạn chưa biết bắt đầu từ đâu?
                    </h2>
                    <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
                        Đừng ngần ngại liên hệ với chúng tôi để được tư vấn lộ trình học tập phù hợp nhất với năng lực và mục tiêu của bạn.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/lien-he" className="inline-block px-8 py-4 bg-[#cc0022] text-white font-bold rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-red-900/30 hover:-translate-y-1">
                            Đăng Ký Tư Vấn Ngay
                        </Link>
                        <Link href="/tuyen-dung" className="inline-block px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white hover:text-[#00008b] transition-all">
                            Xem Lịch Khai Giảng
                        </Link>
                    </div>
                </div>
                {/* Decor circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mb-32"></div>
            </section>

        </main>
    );
}