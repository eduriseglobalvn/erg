'use client';

import React from 'react';
import {
    Heart, Star, Globe, Lightbulb, Users,
    ShieldCheck, Zap, ArrowRight
} from 'lucide-react';

export default function CoreValuesPage() {
    // Dữ liệu giữ nguyên
    const values = [
        {
            id: 1,
            title: "Trách nhiệm xã hội",
            content: "ERG đóng góp vào sự phát triển bền vững của xã hội thông qua các chương trình đào tạo quốc tế, nâng cao kỹ năng công nghệ cho cộng đồng.",
            icon: <Globe className="w-8 h-8 text-white" />, // Tăng size icon
            theme: "blue",
        },
        {
            id: 2,
            title: "Chất lượng vượt trội",
            content: "ERG cam kết mang lại những sản phẩm và dịch vụ với chất lượng tốt nhất thông qua việc đảm bảo tỷ lệ thành công tối ưu và trải nghiệm dịch vụ vượt trội.",
            icon: <Star className="w-8 h-8 text-white" />,
            theme: "red",
        },
        {
            id: 3,
            title: "Hợp tác và phát triển",
            content: "ERG xây dựng một môi trường làm việc đội nhóm, nơi mọi người cùng nhau chia sẻ kiến thức, kinh nghiệm và cùng nhau phát triển.",
            icon: <Users className="w-8 h-8 text-white" />,
            theme: "blue",
        },
        {
            id: 4,
            title: "Khách hàng là trung tâm",
            content: "ERG đặt lợi ích và sự hài lòng của khách hàng làm ưu tiên hàng đầu trên các khía cạnh về sự thấu hiểu, cải tiến chất lượng, minh bạch hóa, giữ đúng cam kết.",
            icon: <Heart className="w-8 h-8 text-white" />,
            theme: "red",
        },
        {
            id: 5,
            title: "Sáng tạo đổi mới",
            content: "Công nghệ không chỉ là công cụ, mà là động lực để chuyển hóa giáo dục. ERG thúc đẩy tinh thần đổi mới trong từng giải pháp, khuyến khích tư duy sáng tạo.",
            icon: <Lightbulb className="w-8 h-8 text-white" />,
            theme: "blue",
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative py-20 bg-white overflow-hidden text-center">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10"
                     style={{
                         backgroundImage: 'radial-gradient(#00008b 1px, transparent 1px)',
                         backgroundSize: '30px 30px'
                     }}>
                </div>

                <div className="relative z-10 px-4 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#00008b] text-base font-bold mb-6 shadow-sm">
                        <ShieldCheck className="w-5 h-5" /> VĂN HÓA DOANH NGHIỆP
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-[#00008b] mb-6 tracking-tight">
                        GIÁ TRỊ CỐT LÕI
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
                        5 trụ cột định hình phong cách làm việc và chất lượng đào tạo tại <span className="text-[#cc0022] font-bold">Edurise Global</span>.
                    </p>
                </div>
            </section>

            {/* --- TIMELINE SECTION --- */}
            <section className="py-10 relative container mx-auto px-4 max-w-6xl">

                {/* TRỤC GIỮA (To hơn) */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-2 bg-gray-200 rounded-full">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00008b] via-[#cc0022] to-[#00008b] opacity-20 rounded-full"></div>
                </div>

                <div className="flex flex-col">
                    {values.map((val, index) => {
                        const isLeft = index % 2 === 0;
                        const themeColor = val.theme === 'blue' ? 'bg-[#00008b]' : 'bg-[#cc0022]';
                        const borderColor = val.theme === 'blue' ? 'border-[#00008b]' : 'border-[#cc0022]';
                        const textColor = val.theme === 'blue' ? 'text-[#00008b]' : 'text-[#cc0022]';

                        return (
                            // Sử dụng -mt-24 để kéo các thẻ sát lại với nhau hơn nữa theo chiều dọc
                            <div key={val.id} className={`md:flex items-center w-full relative ${index !== 0 ? '-mt-12 md:-mt-24' : ''} ${isLeft ? '' : 'flex-row-reverse'}`}>

                                {/* 1. CỘT TRÁI/PHẢI CHỨA CARD */}
                                <div className={`w-full md:w-1/2 relative ${isLeft ? 'md:pr-20 pl-4 md:pl-0' : 'md:pl-20 pl-4'}`}>
                                    <div className={`
                                        bg-white p-8 md:p-12 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                                        border-t-[6px] ${borderColor} relative group h-full flex flex-col justify-center
                                    `}>

                                        {/* Background Icon mờ trang trí (To hơn) */}
                                        <div className={`absolute -bottom-8 -right-8 opacity-5 transform rotate-12 scale-[2] text-gray-800`}>
                                            {val.icon}
                                        </div>

                                        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                                            {/* ICON CHÍNH (To hơn) */}
                                            <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${themeColor} flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform`}>
                                                {val.icon}
                                            </div>

                                            <div>
                                                <h3 className={`text-2xl md:text-3xl font-bold ${textColor} mb-3 uppercase tracking-wide`}>
                                                    {val.id}. {val.title}
                                                </h3>
                                                <p className="text-gray-600 text-lg leading-relaxed text-justify font-medium">
                                                    {val.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Đường nối ngang (Connector) - Căn giữa theo chiều dọc */}
                                    <div className={`hidden md:block absolute top-1/2 -mt-1 h-[2px] bg-gray-300 transition-all duration-300 group-hover:bg-[#cc0022] z-0
                                        ${isLeft ? 'right-0 w-20' : 'left-0 w-20'}
                                    `}></div>
                                </div>

                                {/* 2. NÚT TRÒN TRỤC GIỮA - Căn giữa theo chiều dọc */}
                                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center h-full">
                                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-[4px] border-white shadow-xl ${themeColor} flex items-center justify-center relative`}>
                                        <span className="text-white font-bold text-xl">{val.id}</span>
                                        {/* Hiệu ứng Pulse */}
                                        <div className={`absolute -inset-2 rounded-full ${themeColor} opacity-20 animate-ping`}></div>
                                    </div>
                                </div>

                                {/* 3. KHOẢNG TRỐNG CÂN BẰNG (Spacer) */}
                                <div className="hidden md:block w-1/2"></div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* --- BOTTOM CTA --- */}
            <section className="py-24 bg-gray-50 border-t border-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00008b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-5xl mx-auto bg-white/60 backdrop-blur-md rounded-[3rem] p-12 md:p-16 border border-white shadow-2xl">
                        <Zap className="w-16 h-16 text-[#ffcc00] mx-auto mb-6 drop-shadow-md animate-bounce" />
                        <h2 className="text-4xl md:text-5xl font-bold text-[#00008b] mb-6">Sẵn sàng đồng hành cùng ERG?</h2>
                        <p className="text-gray-600 mb-10 max-w-3xl mx-auto text-xl leading-relaxed">
                            Chúng tôi luôn chào đón những nhân tài chia sẻ cùng hệ giá trị để kiến tạo tương lai giáo dục.
                        </p>
                        <a href="https://tuyendung.erg.edu.vn" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-[#cc0022] hover:bg-red-700 text-white font-bold text-xl py-5 px-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1">
                            Xem cơ hội nghề nghiệp
                            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform"/>
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}