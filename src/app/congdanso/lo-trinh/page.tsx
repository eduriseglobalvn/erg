'use client';

import React from 'react';
import {
    Shield,
    MessageCircle,
    Brain,
    Heart,
    CheckCircle2,
    Globe,
    GraduationCap
} from 'lucide-react';
import Link from 'next/link';

const DigitalCitizenshipRoadmap = () => {
    // Dữ liệu lộ trình Công dân số chi tiết
    const roadmapSteps = [
        {
            id: 1,
            tag: "Giai đoạn 1: Phòng Vệ",
            title: "An Toàn & Bảo Mật Số",
            description: "Xây dựng 'lá chắn' đầu tiên. Học viên nhận thức được các rủi ro và biết cách tự bảo vệ mình cũng như dữ liệu cá nhân trên không gian mạng.",
            type: 'foundation',
            mainColor: "#0284c7", // Xanh dương đậm (Sky-700)
            icon: <Shield size={32} className="text-white" />,
            modules: [
                "Quản lý dấu chân số (Digital Footprint) & Danh tính",
                "Bảo mật tài khoản: Mật khẩu mạnh & Xác thực 2 lớp",
                "Nhận diện lừa đảo (Phishing) & Phần mềm độc hại",
            ]
        },
        {
            id: 2,
            tag: "Giai đoạn 2: Kết Nối",
            title: "Văn Hóa & Giao Tiếp Số",
            description: "Học cách tương tác văn minh. Xây dựng hình ảnh cá nhân tích cực, tôn trọng sự khác biệt và thấu cảm trong cộng đồng trực tuyến.",
            type: 'skill',
            mainColor: "#7c3aed", // Tím đậm (Violet-700)
            icon: <MessageCircle size={32} className="text-white" />,
            modules: [
                "Quy tắc ứng xử văn minh (Netiquette) & Tôn trọng",
                "Phòng chống và ứng phó với bắt nạt mạng (Cyberbullying)",
                "Kỹ năng giao tiếp chuyên nghiệp qua Email & Mạng xã hội",
            ]
        },
        {
            id: 3,
            tag: "Giai đoạn 3: Tư Duy",
            title: "Năng Lực Thông Tin & Phản Biện",
            description: "Không bị dẫn dắt sai lệch. Phát triển tư duy sắc bén để tìm kiếm, đánh giá và sử dụng thông tin một cách thông minh, có chọn lọc.",
            type: 'skill',
            mainColor: "#d97706", // Vàng cam đậm (Amber-600)
            icon: <Brain size={32} className="text-white" />,
            modules: [
                "Phân biệt Tin thật - Tin giả (Fake News) & Lừa đảo",
                "Tra cứu thông tin & Đánh giá độ tin cậy của nguồn tin",
                "Bản quyền số, Đạo văn & Sử dụng tài nguyên hợp lý",
            ]
        },
        {
            id: 4,
            tag: "Giai đoạn 4: Cống Hiến",
            title: "Trách Nhiệm & Sống Cân Bằng",
            description: "Trở thành công dân số toàn cầu có trách nhiệm, biết cân bằng giữa cuộc sống thực và ảo, tuân thủ pháp luật và đạo đức.",
            type: 'milestone',
            badge: "Đạt chuẩn Công Dân Số Toàn Cầu",
            mainColor: "#059669", // Xanh lá đậm (Emerald-600)
            icon: <Heart size={32} className="text-white" />,
            modules: [
                "Sức khỏe số (Digital Wellbeing) & Cai nghiện thiết bị",
                "Luật An ninh mạng & Trách nhiệm pháp lý cơ bản",
                "Sử dụng công nghệ để lan tỏa giá trị tích cực",
            ]
        }
    ];

    return (
        <>
            {/* === PHẦN 1: LỘ TRÌNH DẠNG ĐƯỜNG ĐI TRÊN NỀN Ô VUÔNG MỜ === */}
            <section className="py-24 relative overflow-hidden bg-white"
                     style={{
                         backgroundColor: '#ffffff',
                         backgroundImage: `
                        linear-gradient(to right, rgba(229, 231, 235, 0.4) 1.5px, transparent 1.5px),
                        linear-gradient(to bottom, rgba(229, 231, 235, 0.4) 1.5px, transparent 1.5px)
                    `,
                         backgroundSize: '80px 80px' // Giữ nguyên ô vuông to
                     }}
            >
                <div className="container mx-auto px-4 relative z-10">

                    {/* Header Section */}
                    <div className="text-center mb-20">
                        <div className="flex items-center justify-center gap-2 text-[var(--erg-blue)] font-bold mb-3 uppercase tracking-wider text-sm">
                            <Globe size={20} />
                            <span>Hành Trình Trưởng Thành</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
                            Lộ Trình <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Công Dân Số</span> Chi Tiết
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg bg-white/90 backdrop-blur-sm inline-block p-3 rounded-xl ring-1 ring-gray-100 shadow-sm">
                            Từ nhận thức an toàn đến hành động trách nhiệm - 4 bước toàn diện để làm chủ cuộc sống trong kỷ nguyên số.
                        </p>
                    </div>

                    <div className="relative max-w-6xl mx-auto">

                        {/* Đường lộ chính (The Road) */}
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-8 bg-gray-100 shadow-inner z-0 rounded-full border-x border-gray-200">
                            {/* Vạch kẻ đường đứt đoạn */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-400 opacity-30"></div>
                        </div>

                        <div className="space-y-24 relative pt-8 pb-8">
                            {roadmapSteps.map((step, index) => {
                                const isEven = index % 2 !== 0;
                                const isMilestone = step.type === 'milestone';
                                // Tạo màu nền nhạt cho tag dựa trên màu chính
                                const tagBgStyle = { backgroundColor: `${step.mainColor}15`, color: step.mainColor }; // 15% opacity

                                return (
                                    <div key={step.id} className={`flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} items-center md:gap-24 relative`}>

                                        {/* Nút tròn biểu tượng ở giữa (Thay số bằng Icon) */}
                                        <div
                                            className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center w-20 h-20 rounded-full border-[6px] bg-white z-20 shadow-xl transition-transform hover:scale-110 hover:rotate-6"
                                            style={{ borderColor: step.mainColor }}
                                        >
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner" style={{ backgroundColor: step.mainColor }}>
                                                {step.icon}
                                            </div>
                                        </div>

                                        {/* Mobile Node */}
                                        <div className="md:hidden flex items-center gap-4 mb-6 self-start">
                                            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 bg-white z-20 shadow-md"
                                                 style={{ borderColor: step.mainColor }}>
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: step.mainColor }}>
                                                    {/* Clone icon nhỏ hơn cho mobile */}
                                                    {React.cloneElement(step.icon as any, { size: 18 })}
                                                </div>
                                            </div>
                                            <div className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-current" style={tagBgStyle}>
                                                {step.tag}
                                            </div>
                                        </div>

                                        <div className="hidden md:block w-1/2" />

                                        {/* Thẻ nội dung */}
                                        <div className="w-full md:w-[45%] bg-white rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] p-8 relative border-t-[6px] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                                             style={{ borderTopColor: step.mainColor }}>

                                            {/* Tag Giai đoạn (Desktop) */}
                                            <div className="hidden md:inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 border border-current" style={tagBgStyle}>
                                                {step.tag}
                                            </div>

                                            <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:opacity-80 transition-opacity">
                                                {step.title}
                                            </h3>

                                            {/* Badge nếu là cột mốc quan trọng */}
                                            {isMilestone && (
                                                <div className="flex items-center gap-2 mb-5 p-3 rounded-lg border bg-emerald-50 border-emerald-100">
                                                    <GraduationCap size={20} className="text-emerald-600" />
                                                    <span className="text-emerald-700 font-bold text-sm">{step.badge}</span>
                                                </div>
                                            )}

                                            <p className="text-gray-600 mb-6 leading-relaxed font-medium text-[15px]">
                                                {step.description}
                                            </p>

                                            {/* Nội dung chi tiết */}
                                            <div className="space-y-4 pt-5 border-t border-gray-100">
                                                <h4 className="font-bold text-gray-400 text-xs uppercase mb-2 tracking-widest">Kỹ năng đạt được:</h4>
                                                <ul className="space-y-3">
                                                    {step.modules.map((mod, idx) => (
                                                        <li key={idx} className="flex items-start gap-3 text-gray-700 text-sm font-semibold">
                                                            <CheckCircle2 size={18} style={{ color: step.mainColor }} className="mt-0.5 flex-shrink-0" />
                                                            <span>{mod}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* === PHẦN 2: FOOTER CTA === */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-[var(--erg-blue)] mb-6">
                        Bạn Đã Sẵn Sàng?
                    </h2>
                    <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto font-medium">
                        Đừng để lỡ "thời điểm vàng" để trang bị tư duy số. Đăng ký ngay để nhận tư vấn lộ trình phù hợp nhất.
                    </p>
                    <Link href="/lien-he" className="inline-block px-12 py-5 bg-[var(--erg-red)] text-white font-bold text-xl rounded-xl hover:bg-red-700 transition-all shadow-xl hover:shadow-red-200 transform hover:-translate-y-1 uppercase tracking-wider">
                        Đăng Ký Tư Vấn Ngay
                    </Link>
                </div>
            </section>
        </>
    );
};

export default DigitalCitizenshipRoadmap;