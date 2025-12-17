'use client';

import React from 'react';
import { Eye, Target, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function VisionMissionPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative h-[450px] flex items-center justify-center bg-[#00008b] overflow-hidden">
                {/* Abstract Background Image */}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                    <img
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop"
                        alt="Vision Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Dot Grid Pattern Overlay (White dots on Blue) */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                ></div>

                <div className="relative z-10 text-center px-4 animate-fade-in-up">
                    <h4 className="text-[#cc0022] font-bold tracking-[0.2em] text-sm uppercase mb-4 bg-white/10 inline-block px-4 py-1 rounded-full backdrop-blur-sm border border-white/10">
                        Định hướng chiến lược
                    </h4>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        TẦM NHÌN & SỨ MỆNH
                    </h1>
                    <div className="w-24 h-1.5 bg-[#cc0022] mx-auto rounded-full mb-6"></div>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
                        "Khẳng định vị thế, kiến tạo tương lai số hóa bền vững."
                    </p>
                </div>
            </section>

            {/* --- MAIN CONTENT: VISION (Tầm Nhìn) --- */}
            <section className="py-24 relative">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 -z-10 hidden lg:block"></div>
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
                                <img
                                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop"
                                    alt="ERG Vision"
                                    className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#00008b]/80 to-transparent opacity-60"></div>

                                {/* Floating Icon Badge */}
                                <div className="absolute bottom-8 left-8 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 animate-bounce-slow">
                                    <div className="bg-blue-50 p-3 rounded-full">
                                        <Eye className="w-8 h-8 text-[#00008b]" />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 uppercase font-bold">Mục tiêu</span>
                                        <span className="block text-lg font-bold text-[#00008b]">Định hình tương lai</span>
                                    </div>
                                </div>
                            </div>
                            {/* Decor Square */}
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#cc0022] rounded-2xl -z-10 opacity-10"></div>
                        </div>

                        {/* Text Block (Right) */}
                        <div className="w-full lg:w-1/2">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-12 h-1 bg-[#cc0022]"></span>
                                <span className="text-[#00008b] font-bold uppercase tracking-wider">Tầm Nhìn (Vision)</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                                Trở thành tập đoàn công nghệ <span className="text-[#00008b]">hàng đầu</span>
                            </h2>

                            {/* Nội dung từ ảnh */}
                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-justify">
                                <p>
                                    ERG hướng tới trở thành một tập đoàn công nghệ về cung ứng hạ tầng, nhân sự và cung cấp giải pháp công nghệ thông tin, định hình tương lai số hóa và tạo ra tác động tích cực bền vững cho xã hội.
                                </p>
                                <p>
                                    Tập trung vào việc xây dựng mối quan hệ tin cậy với khách hàng và đối tác, chúng tôi hướng đến việc trở thành biểu tượng của sự <span className="font-bold text-[#cc0022]">chuyên nghiệp, minh bạch và tận tâm</span> trong kỷ nguyên công nghệ số.
                                </p>
                            </div>

                            <div className="mt-10 grid grid-cols-2 gap-4">
                                {['Định hình tương lai số', 'Tác động bền vững', 'Biểu tượng chuyên nghiệp', 'Đối tác tin cậy'].map((tag, i) => (
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
                {/* Decor Dots */}
                <div
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#cc0022 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                ></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16">

                        {/* Image Block (Right) - Style khác 1 chút cho đa dạng */}
                        <div className="w-full lg:w-1/2 relative group">
                            {/* Image Container */}
                            <div className="relative rounded-tl-[80px] rounded-br-[80px] rounded-tr-2xl rounded-bl-2xl overflow-hidden shadow-2xl border-4 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                                    alt="ERG Mission"
                                    className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-[#00008b] opacity-10 group-hover:opacity-0 transition-opacity"></div>

                                {/* Floating Icon Badge */}
                                <div className="absolute top-8 right-8 bg-[#cc0022] text-white p-4 rounded-xl shadow-lg flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                                        <Target className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <span className="block text-xs opacity-80 uppercase font-bold">Cam kết</span>
                                        <span className="block text-lg font-bold">Chất lượng cao</span>
                                    </div>
                                </div>
                            </div>
                            {/* Decor Circle */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#00008b] rounded-full -z-10 opacity-10 blur-2xl"></div>
                        </div>

                        {/* Text Block (Left) */}
                        <div className="w-full lg:w-1/2">
                            <div className="flex items-center gap-3 mb-4 justify-end lg:justify-start">
                                <span className="w-12 h-1 bg-[#cc0022]"></span>
                                <span className="text-[#00008b] font-bold uppercase tracking-wider">Sứ Mệnh (Mission)</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight text-right lg:text-left">
                                Thúc đẩy <span className="text-[#cc0022]">chuyển đổi số</span> & Phát triển cộng đồng
                            </h2>

                            {/* Nội dung từ ảnh */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#cc0022]">
                                <p className="text-lg text-gray-600 leading-relaxed text-justify">
                                    ERG cung cấp các giải pháp công nghệ và dịch vụ tin học chất lượng cao, góp phần thúc đẩy quá trình chuyển đổi số trong cộng đồng, nâng cao năng lực công nghệ cho khách hàng và đối tác, đồng hành cùng sự phát triển bền vững của xã hội trong kỷ nguyên số hóa.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-end lg:justify-start">
                                <div className="text-center sm:text-left">
                                    <h3 className="text-4xl font-bold text-[#00008b]">100%</h3>
                                    <p className="text-sm text-gray-500 mt-1">Cam kết chất lượng</p>
                                </div>
                                <div className="w-px h-12 bg-gray-300 hidden sm:block"></div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-4xl font-bold text-[#00008b]">4.0</h3>
                                    <p className="text-sm text-gray-500 mt-1">Tiêu chuẩn công nghệ</p>
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
                        Những giá trị này được xây dựng dựa trên 5 trụ cột cốt lõi
                    </h2>
                    <a
                        href="/gia-tri-cot-loi"
                        className="inline-flex items-center bg-[#cc0022] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all hover:scale-105"
                    >
                        XEM GIÁ TRỊ CỐT LÕI <ArrowRight className="ml-2 w-5 h-5" />
                    </a>
                </div>
            </section>

        </div>
    );
}