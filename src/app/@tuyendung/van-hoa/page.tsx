'use client';

import React from 'react';
import {
    Heart, Users, Quote, Globe, Star, Lightbulb, CheckCircle2
} from 'lucide-react';

export default function CulturePage() {

    // Dữ liệu
    const CORE_VALUES = [
        {
            id: 1,
            num: "01",
            title: "Trách Nhiệm Xã Hội",
            desc: "Đóng góp vào sự phát triển bền vững thông qua đào tạo quốc tế, nâng cao kỹ năng công nghệ cho cộng đồng.",
            icon: <Globe size={32} />,
            color: "blue"
        },
        {
            id: 2,
            num: "02",
            title: "Chất Lượng Vượt Trội",
            desc: "Cam kết mang lại sản phẩm giáo dục ưu việt nhất, đảm bảo tỷ lệ thành công tối ưu cho học viên.",
            icon: <Star size={32} />,
            color: "red"
        },
        {
            id: 3,
            num: "03",
            title: "Hợp Tác & Phát Triển",
            desc: "Xây dựng môi trường làm việc cởi mở, nơi mọi người cùng chia sẻ kiến thức và cùng nhau lớn mạnh.",
            icon: <Users size={32} />,
            color: "blue"
        },
        {
            id: 4,
            num: "04",
            title: "Khách Hàng Là Trung Tâm",
            desc: "Đặt lợi ích của học viên và đối tác lên hàng đầu. Thấu hiểu, minh bạch và giữ đúng cam kết.",
            icon: <Heart size={32} />,
            color: "red"
        },
        {
            id: 5,
            num: "05",
            title: "Sáng Tạo Đổi Mới",
            desc: "Công nghệ là động lực chuyển hóa. ERG luôn khuyến khích tư duy đột phá trong từng giải pháp.",
            icon: <Lightbulb size={32} />,
            color: "blue"
        }
    ];

    return (
        /* 1. Thêm antialiased và thay đổi màu text mặc định sang slate-900 để rõ nét hơn trên Win */
        <main className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-blue-100">

            {/* --- HERO SECTION --- */}
            <section className="relative bg-[#00008b] text-white py-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#cc0022]/20 rounded-full -ml-10 -mb-10 blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-4 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-yellow-400 mb-6 backdrop-blur-sm">
                        Văn hóa doanh nghiệp
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                        Người <span className="text-[#cc0022] bg-white px-3 rounded-lg inline-block transform -rotate-2">EDURISE</span>
                    </h1>
                    {/* Giảm nhẹ độ mỏng của font-light để tránh mất nét trên Win */}
                    <p className="text-xl text-white/90 max-w-3xl mx-auto font-normal leading-relaxed">
                        "Tại ERG, chúng tôi không chỉ dạy Tin học. Chúng tôi truyền cảm hứng để thế hệ trẻ làm chủ công nghệ và kiến tạo tương lai."
                    </p>
                </div>
            </section>

            {/* --- CORE VALUES --- */}
            <section className="py-24 bg-gray-50/50 relative">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#00008b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-[#cc0022] font-bold text-sm uppercase tracking-widest">DNA Của Chúng Tôi</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#00008b] mt-3 tracking-tight">5 Giá Trị Cốt Lõi</h2>
                        <div className="w-20 h-1.5 bg-[#cc0022] mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {CORE_VALUES.map((item) => {
                            const isBlue = item.color === 'blue';
                            return (
                                <div
                                    key={item.id}
                                    className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
                                >
                                    <div className={`absolute top-0 left-0 w-full h-1.5 ${isBlue ? 'bg-[#00008b]' : 'bg-[#cc0022]'}`}></div>

                                    {/* Tăng opacity watermark để Win render tốt hơn */}
                                    <div className={`absolute -right-4 -bottom-10 text-[10rem] font-black leading-none opacity-[0.04] select-none transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.08] ${isBlue ? 'text-[#00008b]' : 'text-[#cc0022]'}`}>
                                        {item.num}
                                    </div>

                                    <div className="flex items-center gap-5 mb-6">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-transform duration-500 group-hover:rotate-6
                                    ${isBlue ? 'bg-gradient-to-br from-blue-900 to-blue-600' : 'bg-gradient-to-br from-red-600 to-orange-500'}`}
                                        >
                                            {item.icon}
                                        </div>
                                        <h3 className={`text-xl font-bold uppercase tracking-tight ${isBlue ? 'text-[#00008b]' : 'text-[#cc0022]'}`}>
                                            {item.title}
                                        </h3>
                                    </div>

                                    {/* Đổi text-gray-600 thành text-slate-600 để tăng độ tương phản */}
                                    <p className="text-slate-600 leading-relaxed text-justify relative z-10 flex-1 font-medium md:font-normal">
                                        {item.desc}
                                    </p>

                                    <div className={`w-12 h-1 mt-6 rounded-full transition-all duration-500 group-hover:w-full ${isBlue ? 'bg-blue-100 group-hover:bg-[#00008b]' : 'bg-red-100 group-hover:bg-[#cc0022]'}`}></div>
                                </div>
                            );
                        })}

                        <div className="bg-[#00008b] rounded-3xl p-8 text-white flex flex-col justify-center items-center text-center shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-[#cc0022] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative z-10">
                                <CheckCircle2 size={48} className="mb-4 mx-auto text-yellow-400" />
                                <h3 className="text-xl font-bold uppercase mb-2 tracking-tight">Cam Kết Của ERG</h3>
                                <p className="text-blue-50 text-sm font-normal">Luôn đồng hành cùng sự phát triển của Giáo dục Việt Nam.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LEADERSHIP MESSAGE --- */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="relative rounded-3xl overflow-hidden bg-[#00008b] text-white shadow-2xl">
                        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                            </svg>
                        </div>

                        <div className="flex flex-col md:flex-row items-center">
                            <div className="w-full md:w-3/5 p-10 md:p-16 relative z-10">
                                <Quote size={60} className="text-[#cc0022] mb-6 opacity-90" />
                                {/* Thay đổi font-serif sang font-sans để tránh lỗi răng cưa trên Windows */}
                                <h3 className="text-2xl md:text-3xl font-medium italic leading-relaxed mb-8 text-white/95">
                                    "Mục tiêu của Edurise Global không chỉ dừng lại ở việc cung cấp kiến thức. Chúng tôi muốn xây dựng một môi trường nơi <span className="text-yellow-400 font-bold">mỗi giáo viên là một người truyền lửa</span>, và mỗi học sinh đều có cơ hội tiếp cận công nghệ bình đẳng theo tiêu chuẩn quốc tế."
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="h-1 w-12 bg-[#cc0022]"></div>
                                    <div>
                                        <h4 className="font-bold text-xl uppercase tracking-wide">Ông Bùi Quốc Việt</h4>
                                        <p className="text-blue-100 text-sm">Giám đốc - EDURISE GLOBAL CO., LTD</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-2/5 h-64 md:h-full min-h-[400px] relative">
                                <img
                                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Ban lãnh đạo ERG"
                                    className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-overlay md:mix-blend-normal"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-[#00008b]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LIFE AT ERG --- */}
            <section className="py-24 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#00008b] tracking-tight">Nhịp sống Edurise</h2>
                    <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-medium md:font-normal">
                        Những khoảnh khắc nhiệt huyết và sáng tạo của đội ngũ ERG trên hành trình kiến tạo tương lai số.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
                    <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Giờ học STEM" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                        <div className="absolute bottom-6 left-6 text-white z-10"><h3 className="text-xl font-bold drop-shadow-lg">Giờ học STEM đầy cảm hứng</h3></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    {/* ... Các ô ảnh khác ... */}
                    <div className="md:col-span-1 md:row-span-1 rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Training" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                        <div className="absolute bottom-4 left-4 text-white z-10"><h3 className="font-bold text-sm drop-shadow-lg">Đào tạo Giáo viên</h3></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    <div className="md:col-span-1 md:row-span-1 rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Team Building" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                        <div className="absolute bottom-4 left-4 text-white z-10"><h3 className="font-bold text-sm drop-shadow-lg">Team Building</h3></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    <div className="md:col-span-2 md:row-span-1 rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Sự kiện" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                        <div className="absolute bottom-4 left-4 text-white z-10"><h3 className="font-bold text-lg drop-shadow-lg">Hội thảo Công nghệ Giáo dục</h3></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                </div>
            </section>
        </main>
    );
}