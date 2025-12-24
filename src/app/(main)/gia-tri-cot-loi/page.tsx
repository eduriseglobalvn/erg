'use client';

import React from 'react';
import {
    Heart, Star, Globe, Lightbulb, Users,
    ShieldCheck, Zap, ArrowRight
} from 'lucide-react';

export default function CoreValuesPage() {
    // Dữ liệu giữ nguyên từ tài liệu gốc
    const values = [
        {
            id: 1,
            title: "Trách nhiệm xã hội",
            content: "ERG đóng góp vào sự phát triển bền vững của xã hội thông qua các chương trình đào tạo quốc tế, nâng cao kỹ năng công nghệ cho cộng đồng.",
            icon: <Globe className="w-6 h-6 text-white" />,
            theme: "blue", // Xanh
        },
        {
            id: 2,
            title: "Chất lượng vượt trội",
            content: "ERG cam kết mang lại những sản phẩm và dịch vụ với chất lượng tốt nhất thông qua việc đảm bảo tỷ lệ thành công tối ưu và trải nghiệm dịch vụ vượt trội.",
            icon: <Star className="w-6 h-6 text-white" />,
            theme: "red", // Đỏ
        },
        {
            id: 3,
            title: "Hợp tác và phát triển",
            content: "ERG xây dựng một môi trường làm việc đội nhóm, nơi mọi người cùng nhau chia sẻ kiến thức, kinh nghiệm và cùng nhau phát triển.",
            icon: <Users className="w-6 h-6 text-white" />,
            theme: "blue",
        },
        {
            id: 4,
            title: "Khách hàng là trung tâm",
            content: "ERG đặt lợi ích và sự hài lòng của khách hàng làm ưu tiên hàng đầu trên các khía cạnh về sự thấu hiểu, cải tiến chất lượng, minh bạch hóa, giữ đúng cam kết.",
            icon: <Heart className="w-6 h-6 text-white" />,
            theme: "red",
        },
        {
            id: 5,
            title: "Sáng tạo đổi mới",
            content: "Công nghệ không chỉ là công cụ, mà là động lực để chuyển hóa giáo dục. ERG thúc đẩy tinh thần đổi mới trong từng giải pháp, khuyến khích tư duy sáng tạo.",
            icon: <Lightbulb className="w-6 h-6 text-white" />,
            theme: "blue",
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative h-[400px] flex items-center justify-center bg-white overflow-hidden">
                {/* Background Pattern: Dot Grid */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(#00008b 1px, transparent 1px)',
                        backgroundSize: '24px 24px' // Kích thước chấm giống ảnh mẫu
                    }}
                ></div>

                <div className="relative z-10 text-center px-4 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#00008b] text-sm font-semibold mb-6">
                        <ShieldCheck className="w-4 h-4" /> VĂN HÓA DOANH NGHIỆP
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#00008b] mb-4 tracking-tight">
                        GIÁ TRỊ CỐT LÕI
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
                        5 trụ cột định hình phong cách làm việc và chất lượng đào tạo tại <span className="text-[#cc0022] font-bold">Edurise Global</span>.
                    </p>
                </div>
            </section>

            {/* --- TIMELINE SECTION --- */}
            <section className="py-20 relative container mx-auto px-4 max-w-5xl">

                {/* Đường kẻ dọc trục giữa (Central Line) */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gray-200">
                    {/* Gradient overlay tạo cảm giác dòng chảy */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00008b] via-[#cc0022] to-[#00008b] opacity-30"></div>
                </div>

                <div className="space-y-12 md:space-y-0 relative">
                    {values.map((val, index) => {
                        const isLeft = index % 2 === 0;
                        const themeColor = val.theme === 'blue' ? 'bg-[#00008b]' : 'bg-[#cc0022]';
                        const borderColor = val.theme === 'blue' ? 'border-[#00008b]' : 'border-[#cc0022]';
                        const textColor = val.theme === 'blue' ? 'text-[#00008b]' : 'text-[#cc0022]';

                        return (
                            <div key={val.id} className={`md:flex items-center justify-between w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>

                                {/* 1. KHOẢNG TRỐNG (Spacer) - Giữ cân bằng layout */}
                                <div className="hidden md:block w-5/12" />

                                {/* 2. TRỤC GIỮA (Center Point) */}
                                <div className="hidden md:flex w-2/12 justify-center relative z-10">
                                    {/* Điểm nút tròn trên trục */}
                                    <div className={`w-6 h-6 rounded-full border-4 border-white shadow-md ${themeColor} relative`}>
                                        {/* Hiệu ứng Pulse lan tỏa */}
                                        <div className={`absolute -inset-2 rounded-full ${themeColor} opacity-20 animate-ping`}></div>
                                    </div>
                                </div>

                                {/* 3. CARD NỘI DUNG (Content Card) */}
                                <div className="w-full md:w-5/12 relative group">
                                    {/* Đường nối ngang (Connector Line) */}
                                    <div className={`hidden md:block absolute top-1/2 -mt-0.5 w-10 h-[2px] bg-gray-300 transition-all duration-300 group-hover:bg-[#cc0022] ${isLeft ? '-right-10' : '-left-10'}`}></div>

                                    <div className={`
                    bg-white p-6 rounded-xl shadow-lg border-t-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                    ${borderColor} relative overflow-hidden
                  `}>
                                        {/* Background Icon mờ trang trí */}
                                        <div className={`absolute -bottom-6 -right-6 opacity-5 transform rotate-12 scale-150 text-gray-800`}>
                                            {val.icon}
                                        </div>

                                        <div className="flex items-start gap-4 relative z-10">
                                            {/* ICON CHÍNH - Gắn liền vào Card */}
                                            <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${themeColor} flex items-center justify-center shadow-md transform group-hover:rotate-6 transition-transform`}>
                                                {val.icon}
                                            </div>

                                            <div>
                                                <h3 className={`text-xl font-bold ${textColor} mb-2 uppercase tracking-wide`}>
                                                    {val.id}. {val.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm leading-relaxed text-justify">
                                                    {val.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </section>

            {/* --- BOTTOM CTA (Nền chấm + Button đỏ) --- */}
            <section className="py-20 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
                {/* Background Pattern: Dot Grid mờ toàn nền */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#00008b 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                ></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-4xl mx-auto bg-blue-50/80 backdrop-blur-sm rounded-3xl p-10 md:p-14 border border-blue-100 shadow-xl">

                        <Zap className="w-12 h-12 text-[#ffcc00] mx-auto mb-6 drop-shadow-sm" />

                        <h2 className="text-3xl font-bold text-[#00008b] mb-4">
                            Sẵn sàng đồng hành cùng ERG?
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                            Chúng tôi luôn chào đón những nhân tài chia sẻ cùng hệ giá trị để kiến tạo tương lai giáo dục.
                        </p>

                        <a
                            href="https://tuyendung.erg.edu.vn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-[#cc0022] hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1"
                        >
                            Xem cơ hội nghề nghiệp
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                        </a>

                        {/* Decor Circles ở góc (Giống ảnh 2) */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#cc0022] opacity-5 rounded-bl-full rounded-tr-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00008b] opacity-5 rounded-tr-full rounded-bl-3xl"></div>
                    </div>
                </div>
            </section>

        </div>
    );
}