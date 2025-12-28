'use client';

import React from 'react';
import { Eye, Target, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';

export default function VisionMissionPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-hidden">

            {/* --- HERO SECTION (Giữ nguyên ảnh nền abstract vì nó làm nền tốt) --- */}
            <section className="relative h-[450px] flex items-center justify-center bg-[#00008b] overflow-hidden">
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                    <img
                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop"
                        alt="Education Vision Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                ></div>

                <div className="relative z-10 text-center px-4 animate-fade-in-up">
                    <h4 className="text-[#cc0022] font-bold tracking-[0.2em] text-sm uppercase mb-4 bg-white/10 inline-block px-4 py-1 rounded-full backdrop-blur-sm border border-white/10">
                        La bàn định hướng
                    </h4>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        TẦM NHÌN & SỨ MỆNH
                    </h1>
                    <div className="w-24 h-1.5 bg-[#cc0022] mx-auto rounded-full mb-6"></div>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed italic">
                        "Khơi dậy tiềm năng con người, kiến tạo công dân số toàn cầu."
                    </p>
                </div>
            </section>

            {/* --- MAIN CONTENT: VISION (Tầm Nhìn) --- */}
            <section className="py-24 relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -z-10 hidden lg:block"></div>
                <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#00008b 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                ></div>

                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        {/* Image Block (Left) */}
                        <div className="w-full lg:w-1/2 relative group">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-[8px] border-white">
                                {/* ẢNH MỚI CHO TẦM NHÌN:
                                    - Hình ảnh một đội ngũ chuyên nghiệp đang nhìn về hướng cửa sổ lớn/thành phố.
                                    - Thể hiện: Tầm nhìn xa, hướng tới tương lai, sự chuyên nghiệp của doanh nghiệp.
                                */}
                                <img
                                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop"
                                    alt="ERG Future Vision Team"
                                    className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#00008b]/50 to-transparent opacity-30"></div>

                                {/* Floating Icon Badge */}
                                <div className="absolute bottom-8 left-8 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 animate-bounce-slow">
                                    <div className="bg-blue-50 p-3 rounded-full">
                                        <Eye className="w-8 h-8 text-[#00008b]" />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 uppercase font-bold">Mục tiêu 2030</span>
                                        <span className="block text-lg font-bold text-[#00008b]">Hệ sinh thái giáo dục số</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#cc0022] rounded-2xl -z-10 opacity-10"></div>
                        </div>

                        {/* Text Block (Right) */}
                        <div className="w-full lg:w-1/2">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-12 h-1 bg-[#cc0022]"></span>
                                <span className="text-[#00008b] font-bold uppercase tracking-wider">Tầm Nhìn (Vision)</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                                Trở thành tổ chức giáo dục công nghệ <span className="text-[#00008b]">tiên phong</span>
                            </h2>

                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-justify">
                                <p>
                                    ERG định hướng trở thành hệ thống giáo dục công nghệ hàng đầu, tiên phong trong việc cung cấp các giải pháp đào tạo chuẩn quốc tế. Chúng tôi kiến tạo môi trường học tập không giới hạn, nơi công nghệ là đòn bẩy để khai phóng tư duy và kỹ năng.
                                </p>
                                <p>
                                    Chúng tôi khao khát xây dựng một thế hệ nhân lực số ưu tú, không chỉ làm chủ công nghệ mà còn dẫn dắt sự đổi mới sáng tạo, góp phần đưa trí tuệ Việt vươn tầm thế giới trong kỷ nguyên 4.0.
                                </p>
                            </div>

                            <div className="mt-10 grid grid-cols-2 gap-4">
                                {['Chuẩn hóa quốc tế', 'Học tập trọn đời', 'Cộng đồng tri thức', 'Đổi mới sáng tạo'].map((tag, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-[#cc0022]" />
                                        <span className="text-sm font-medium text-gray-700">{tag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MAIN CONTENT: MISSION (Sứ Mệnh) --- */}
            <section className="py-24 bg-gray-50 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#cc0022 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                ></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16">

                        {/* Image Block (Right) */}
                        <div className="w-full lg:w-1/2 relative group">
                            <div className="relative rounded-tl-[80px] rounded-br-[80px] rounded-tr-2xl rounded-bl-2xl overflow-hidden shadow-2xl border-4 border-white">
                                {/* ẢNH MỚI CHO SỨ MỆNH:
                                    - Hình ảnh một nhóm sinh viên/học viên đa dạng đang tích cực hợp tác, sử dụng laptop.
                                    - Thể hiện: Hành động thực tế (thực học - thực làm), sự hợp tác, môi trường học tập hiện đại.
                                */}
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
                                    alt="ERG Practical Mission"
                                    className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-[#00008b] opacity-10 group-hover:opacity-0 transition-opacity"></div>

                                {/* Floating Icon Badge */}
                                <div className="absolute top-8 right-8 bg-[#cc0022] text-white p-4 rounded-xl shadow-lg flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                                        <BookOpen className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <span className="block text-xs opacity-80 uppercase font-bold">Phương châm</span>
                                        <span className="block text-lg font-bold">Thực học - Thực làm</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#00008b] rounded-full -z-10 opacity-10 blur-2xl"></div>
                        </div>

                        {/* Text Block (Left) */}
                        <div className="w-full lg:w-1/2">
                            <div className="flex items-center gap-3 mb-4 justify-end lg:justify-start">
                                <span className="w-12 h-1 bg-[#cc0022]"></span>
                                <span className="text-[#00008b] font-bold uppercase tracking-wider">Sứ Mệnh (Mission)</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight text-right lg:text-left">
                                Nâng tầm tri thức & <span className="text-[#cc0022]">Phổ cập kỹ năng số</span>
                            </h2>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#cc0022]">
                                <p className="text-lg text-gray-600 leading-relaxed text-justify">
                                    Sứ mệnh của ERG là xóa bỏ khoảng cách số thông qua giáo dục chất lượng cao. Chúng tôi cam kết cung cấp các chương trình đào tạo thực chiến, cập nhật xu hướng công nghệ mới nhất, giúp học viên không chỉ thành thạo kỹ năng mà còn phát triển tư duy giải quyết vấn đề, sẵn sàng chinh phục thị trường lao động toàn cầu.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-end lg:justify-start">
                                <div className="text-center sm:text-left">
                                    <h3 className="text-4xl font-bold text-[#00008b]">10K+</h3>
                                    <p className="text-sm text-gray-500 mt-1">Học viên tiêu biểu</p>
                                </div>
                                <div className="w-px h-12 bg-gray-300 hidden sm:block"></div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-4xl font-bold text-[#00008b]">98%</h3>
                                    <p className="text-sm text-gray-500 mt-1">Hài lòng về chất lượng</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA TO CORE VALUES --- */}
            <section className="py-16 bg-[#00008b] text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        Triết lý giáo dục này được xây dựng trên 5 giá trị cốt lõi
                    </h2>
                    <a
                        href="/gia-tri-cot-loi"
                        className="inline-flex items-center bg-[#cc0022] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all hover:scale-105"
                    >
                        KHÁM PHÁ GIÁ TRỊ CỐT LÕI <ArrowRight className="ml-2 w-5 h-5" />
                    </a>
                </div>
            </section>

        </div>
    );
}