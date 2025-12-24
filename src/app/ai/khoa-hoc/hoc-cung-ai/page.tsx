'use client';

import React from 'react';
import {
    BookOpen,
    Bot,
    BrainCircuit,
    CheckCircle,
    ChevronRight,
    Cpu,
    Globe,
    GraduationCap,
    Layout,
    Sparkles,
    Users,
    Zap
} from 'lucide-react';
// Import Component Gallery (Giữ nguyên từ code cũ)
import ImageGallery from '@/components/ai/ImageGallery';
import {AI_IMAGES, REAL_IMAGES} from '@/mocks/imageGalerry';

// --- MÀU SẮC & DỮ LIỆU CỐ ĐỊNH ---
const AI_INDIGO = '#4f46e5'; // Indigo-600
const AI_DARK = '#312e81';   // Indigo-900
const ACCENT_YELLOW = '#facc15'; // Yellow-400

// 1. Lợi ích khóa học
const BENEFITS = [
    "Tiếp cận kiến thức AI chính thống từ bộ sách của NXB Giáo dục Việt Nam.",
    "Hình thành tư duy máy tính và năng lực số ngay từ bậc Tiểu học.",
    "Hiểu biết về Robot, Dữ liệu lớn (Big Data) và Vạn vật kết nối (IoT).",
    "Rèn luyện kỹ năng giải quyết vấn đề thực tế thông qua các dự án STEAM.",
    "Nắm vững đạo đức AI và cách sử dụng công nghệ an toàn trên không gian mạng.",
    "Định hướng nghề nghiệp sớm trong các lĩnh vực công nghệ cao."
];

// 2. Lộ trình đào tạo (3 Cấp độ)
const ROADMAP = [
    {
        level: "TIỂU HỌC (LỚP 1 - 5)",
        title: "Khám Phá & Làm Quen",
        desc: "Học sinh làm quen với robot, nhận diện giọng nói, hình ảnh qua các trò chơi tương tác. Hình thành khái niệm ban đầu về trí tuệ nhân tạo.",
        modules: [
            "Làm quen với Robot và Máy tính",
            "Nhận diện khuôn mặt & Giọng nói",
            "Lập trình kéo thả điều khiển Robot",
            "An toàn trực tuyến cơ bản"
        ],
        icon: <Bot size={32} className="text-pink-500" />,
        color: "border-pink-200 bg-pink-50"
    },
    {
        level: "THCS (LỚP 6 - 9)",
        title: "Kiến Tạo & Ứng Dụng",
        desc: "Đi sâu vào cấu trúc dữ liệu, thuật toán. Học sinh bắt đầu lập trình các ứng dụng AI đơn giản và hiểu về Machine Learning.",
        modules: [
            "Dữ liệu lớn (Big Data) là gì?",
            "Các thuật toán Máy học cơ bản",
            "Lập trình Python cho AI",
            "Dự án Nhà thông minh (IoT)"
        ],
        icon: <Cpu size={32} className="text-indigo-500" />,
        color: "border-indigo-200 bg-indigo-50"
    },
    {
        level: "THPT (LỚP 10 - 12)",
        title: "Chuyên Sâu & Định Hướng",
        desc: "Nghiên cứu các mô hình AI phức tạp, Deep Learning. Thực hiện các dự án xã hội và chuẩn bị hành trang vào Đại học.",
        modules: [
            "Mạng nơ-ron và Deep Learning",
            "Xử lý ngôn ngữ tự nhiên (NLP)",
            "Thị giác máy tính (Computer Vision)",
            "Đạo đức AI & Pháp luật số"
        ],
        icon: <BrainCircuit size={32} className="text-blue-500" />,
        color: "border-blue-200 bg-blue-50"
    }
];

// 3. Thông tin sách (Dựa trên ảnh bìa sách)
const BOOK_INFO = {
    publisher: "Nhà Xuất Bản Giáo Dục Việt Nam",
    authors: "Hồ Tấn Minh, Huỳnh Ngọc Thanh (Đồng chủ biên), Lê Trung Dũng, Trần Huy...",
    standard: "Chuẩn chương trình Giáo dục phổ thông mới"
};

export default function AiDetailPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">

            {/* HEADER HERO SECTION */}
            <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 text-white py-20 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern-grid.png')] opacity-10"></div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    {/* Left Text */}
                    <div className="md:w-3/5 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/30 border border-indigo-400/50 backdrop-blur-md">
                            <Sparkles size={16} className="text-yellow-400" />
                            <span className="text-sm font-bold uppercase tracking-wider text-indigo-100">Chương trình giáo dục tương lai</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            CHƯƠNG TRÌNH <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                                HỌC CÙNG AI
                            </span>
                        </h1>
                        <p className="text-indigo-100 text-lg max-w-2xl font-light leading-relaxed border-l-4 border-yellow-400 pl-4">
                            Hệ thống kiến thức Trí tuệ nhân tạo bài bản từ <strong>Lớp 1 đến Lớp 12</strong>. Giảng dạy dựa trên bộ sách giáo khoa chuẩn của <strong>NXB Giáo dục Việt Nam</strong>.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="px-8 py-4 bg-yellow-500 text-indigo-900 font-bold rounded-xl shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition-all hover:-translate-y-1">
                                Đăng Ký Tư Vấn Ngay
                            </button>
                            <button className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
                                Xem Lộ Trình Chi Tiết
                            </button>
                        </div>
                    </div>

                    {/* Right Image (Mô phỏng bìa sách) */}
                    <div className="md:w-2/5 flex justify-center">
                        <div className="relative w-64 md:w-80 aspect-[3/4] bg-gradient-to-b from-blue-400 to-indigo-600 rounded-lg shadow-2xl transform rotate-3 border-r-4 border-b-4 border-indigo-900/50 flex flex-col overflow-hidden group hover:rotate-0 transition-all duration-500">
                            {/* Spine effect */}
                            <div className="absolute left-0 top-0 bottom-0 w-4 bg-white/20 z-20"></div>

                            {/* Cover Content */}
                            <div className="p-6 flex flex-col h-full text-center text-white relative z-10">
                                <p className="text-[10px] uppercase tracking-widest mb-1 opacity-90">{BOOK_INFO.publisher}</p>
                                <div className="h-px w-full bg-white/30 mb-6"></div>

                                <h2 className="text-4xl font-extrabold font-serif mb-2 drop-shadow-md">
                                    Học cùng <br/>
                                    <span className="text-6xl text-yellow-300">AI</span>
                                </h2>

                                <div className="flex-1 flex items-center justify-center">
                                    <Bot size={100} className="text-white drop-shadow-xl animate-pulse" />
                                </div>

                                <div className="mt-auto">
                                    <div className="flex justify-center -space-x-2 mb-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-indigo-600 flex items-center justify-center text-indigo-900 font-bold text-xs z-10">
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs font-medium bg-black/20 py-1 rounded">Dành cho học sinh phổ thông</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BODY CONTENT */}
            <div className="container mx-auto px-4 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-20">

                {/* --- LEFT COLUMN (CONTENT) --- */}
                <div className="lg:col-span-8 space-y-12">

                    {/* 1. Giới thiệu chung (Bộ sách) */}
                    <section className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-indigo-600">
                        <div className="flex items-center gap-3 mb-6">
                            <BookOpen className="text-indigo-600" size={28} />
                            <h2 className="text-2xl font-bold text-gray-800">Về Bộ Sách "Học Cùng AI"</h2>
                        </div>
                        <div className="prose text-gray-600 max-w-none">
                            <p className="mb-4 text-justify leading-relaxed">
                                Đây là bộ sách giáo khoa đầu tiên tại Việt Nam cung cấp kiến thức về Trí tuệ nhân tạo một cách hệ thống cho học sinh từ Lớp 1 đến Lớp 12. Bộ sách được biên soạn bởi đội ngũ chuyên gia hàng đầu và được thẩm định bởi <strong>{BOOK_INFO.publisher}</strong>.
                            </p>
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                                <Users size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-indigo-900 text-sm uppercase mb-1">Đội ngũ tác giả:</h4>
                                    <p className="text-sm text-indigo-800 italic">{BOOK_INFO.authors}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Lộ trình chi tiết (Roadmap) */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Layout className="text-indigo-600" size={28} />
                            <h2 className="text-2xl font-bold text-gray-800">Lộ Trình Đào Tạo 12 Năm</h2>
                        </div>

                        <div className="space-y-6">
                            {ROADMAP.map((stage, idx) => (
                                <div key={idx} className={`bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-xl ${stage.color} relative overflow-hidden group`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        {stage.icon}
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                        {/* Left: Icon & Level */}
                                        <div className="md:w-1/4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-200/50 pb-4 md:pb-0 md:pr-4">
                                            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-3">
                                                {stage.icon}
                                            </div>
                                            <span className="font-bold text-indigo-900 text-sm">{stage.level}</span>
                                        </div>

                                        {/* Right: Content */}
                                        <div className="md:w-3/4">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{stage.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4">{stage.desc}</p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {stage.modules.map((mod, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                                        <CheckCircle size={14} className="text-green-500" />
                                                        {mod}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. Lợi ích (Grid) */}
                    <section className="bg-white p-8 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="text-yellow-500 fill-yellow-500" size={28} />
                            <h2 className="text-2xl font-bold text-gray-800">Tại Sao Chọn Chương Trình Này?</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {BENEFITS.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-transparent hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle size={14} className="text-indigo-600" />
                                    </div>
                                    <p className="text-gray-700 text-sm font-medium leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* --- RIGHT COLUMN (SIDEBAR STICKY) --- */}
                <div className="lg:col-span-4 relative">
                    <div className="sticky top-24 space-y-6">

                        {/* 1. CARD ĐĂNG KÝ */}
                        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-indigo-600">
                            <h3 className="text-xl font-bold mb-4 text-center text-indigo-900">THÔNG TIN ĐĂNG KÝ</h3>

                            <div className="space-y-4 mb-6">
                                <div className="bg-indigo-50 p-4 rounded-xl flex items-center gap-3 border border-indigo-100">
                                    <Globe className="text-indigo-600" size={24} />
                                    <div>
                                        <p className="text-xs text-indigo-500 font-bold uppercase">Hình thức học</p>
                                        <p className="font-bold text-gray-800">Liên kết đào tạo</p>
                                    </div>
                                </div>

                                <ul className="space-y-3 pt-2">
                                    <li className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                        <span className="text-gray-500">Đối tượng:</span>
                                        <span className="font-bold text-gray-800">6 - 18 tuổi</span>
                                    </li>
                                    <li className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                        <span className="text-gray-500">Giáo trình:</span>
                                        <span className="font-bold text-gray-800">NXB Giáo Dục VN</span>
                                    </li>
                                    <li className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                        <span className="text-gray-500">Thiết bị:</span>
                                        <span className="font-bold text-gray-800">Robot & Laptop</span>
                                    </li>
                                </ul>
                            </div>

                            <button className="w-full py-4 text-white font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group">
                                Nhận Tư Vấn Lộ Trình <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-3">Tư vấn miễn phí theo năng lực của bé</p>
                        </div>

                        {/* 2. CARD HÌNH ẢNH */}
                        <div className="bg-white p-5 rounded-2xl shadow-lg border-t-4 border-yellow-400">
                            <div className="flex items-center gap-2 mb-3">
                                <GraduationCap className="text-yellow-600" size={20} />
                                <h3 className="text-lg font-bold text-gray-800">Tài liệu học tập</h3>
                            </div>
                            {/*<p className="text-xs text-gray-500 mb-4">*/}
                            {/*    Phòng Lab hiện đại, trang bị đầy đủ Robot giáo dục và hệ thống máy tính cấu hình cao.*/}
                            {/*</p>*/}

                            {/* --- CẬP NHẬT TẠI ĐÂY --- */}
                            <ImageGallery
                                images={AI_IMAGES}
                                autoPlayTime={4000}
                                // Sử dụng tỷ lệ 3:4 (Dọc) để cao hơn hình vuông
                                aspectRatio="aspect-[3/4]"
                            />
                        </div>

                        {/* 3. Author Badge (Optional Decoration) */}
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-2xl shadow-lg text-white text-center">
                            <Sparkles className="mx-auto mb-2 text-yellow-300" size={32} />
                            <h4 className="font-bold text-lg mb-1">Chuẩn Đầu Ra</h4>
                            <p className="text-xs text-indigo-100 opacity-90">
                                Cam kết học sinh nắm vững kiến thức nền tảng và kỹ năng thực hành theo chuẩn Bộ GD&ĐT.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}