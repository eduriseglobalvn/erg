'use client';

import React from 'react';
import {
    Layers,
    CheckCircle,
    BookOpen,
    ImageIcon,
    Calendar,
    Clock,
    DollarSign,
    Users,
    Code2,
    Terminal,
    Cpu,
    Zap
} from 'lucide-react';
// Import Component Gallery
import ImageGallery from '@/components/ImageGallery';
import { REAL_IMAGES } from '@/mocks/imageGalerry';

// --- MÀU SẮC & DỮ LIỆU CỐ ĐỊNH ---
const ERG_BLUE = '#00008b'; // Màu thương hiệu chung
const PYTHON_BLUE = '#2563eb'; // Màu xanh đặc trưng Python
const PYTHON_YELLOW = '#fbbf24'; // Màu vàng bổ trợ (Logo Python)

// 1. Dữ liệu: Lợi ích/Mục tiêu (Tổng hợp từ nội dung học)
const BENEFITS: string[] = [
    "Tiếp cận ngôn ngữ lập trình thực tế số 1 thế giới hiện nay.",
    "Rèn luyện tư duy logic, mạch lạc thông qua việc viết code (text-based).",
    "Hiểu bản chất máy tính: Biến, Vòng lặp, Hàm, Cấu trúc dữ liệu.",
    "Tự tay lập trình Game đơn giản, Game giao diện 2D với Pygame.",
    "Phát triển kỹ năng giải quyết vấn đề và sửa lỗi (Debugging).",
    "Nền tảng vững chắc để tiếp cận AI và Khoa học dữ liệu sau này."
];

// 2. Dữ liệu: Nội dung khóa học (12 Bài - Theo ảnh)
const CURRICULUM = [
    { lesson: 1, title: "Bắt đầu với Python", desc: "Giới thiệu, cài đặt môi trường, lệnh print đơn giản." },
    { lesson: 2, title: "Biến và cú pháp Python", desc: "Từ khóa, phép gán, nhập liệu (input), bài toán nhập xuất." },
    { lesson: 3, title: "Kiểu dữ liệu Number", desc: "Các phép toán số học (+, -, *, /), toán tử so sánh." },
    { lesson: 4, title: "Điều khiển rẽ nhánh (If/elif/else)", desc: "Biểu thức điều kiện, kiểm tra chẵn/lẻ, chia hết." },
    { lesson: 5, title: "Vòng lặp có giới hạn (For)", desc: "Tính tổng dãy số, trung bình cộng, điều kiện lặp đơn giản." },
    { lesson: 6, title: "Vòng lặp vô hạn (While)", desc: "Sự khác nhau giữa For/While. Tính toán tìm số, mẫu số chung." },
    { lesson: 7, title: "Chương trình con (Hàm)", desc: "Khai báo và gọi hàm. Bài tập minh họa." },
    { lesson: 8, title: "Kiểu dữ liệu Xâu (String)", desc: "Các phép toán với chuỗi, so sánh, membership (in, not in)." },
    { lesson: 9, title: "Mini Projects (Pygame)", desc: "Giới thiệu thư viện Pygame. Hướng dẫn làm game cơ bản." },
    { lesson: 10, title: "Mini Projects (Thực hành)", desc: "Phát triển dự án Game/Ứng dụng cá nhân." },
    { lesson: 11, title: "Hoàn thiện Projects & Debug", desc: "Sửa lỗi nhỏ, tư duy sửa lỗi, hoàn thiện sản phẩm." },
    { lesson: 12, title: "Tổng kết & Báo cáo", desc: "Trình bày sản phẩm thực hiện. Kiểm tra và đánh giá cuối khóa." },
];

// 3. Dữ liệu: Đối tượng tham gia (Theo ảnh)
const TARGET_AUDIENCE = [
    "Học sinh từ lớp 6 trở lên có đam mê và muốn tìm hiểu về ngôn ngữ lập trình.",
    "Học sinh có định hướng theo đuổi công nghệ và trở thành lập trình viên trong tương lai.",
    "Học sinh muốn chuyển từ lập trình kéo thả (Scratch) sang lập trình dòng lệnh chuyên nghiệp."
];

export default function PythonPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400 opacity-20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-4">
                        <Code2 size={16} className="text-yellow-300" />
                        <span className="text-xs font-bold uppercase tracking-wider">Lập trình Thiếu nhi & THCS</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        KHÓA HỌC LẬP TRÌNH <br />
                        <span className="text-yellow-300">PYTHON</span>
                    </h1>
                    <p className="text-blue-100 text-lg max-w-2xl border-l-4 border-yellow-400 pl-4 font-medium">
                        Bước đệm trở thành lập trình viên chuyên nghiệp. Chinh phục ngôn ngữ phổ biến nhất thế giới với tư duy logic và thuật toán.
                    </p>
                </div>
            </div>

            {/* BODY CONTENT */}
            <div className="container mx-auto px-4 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-20">

                {/* --- LEFT COLUMN --- */}
                <div className="lg:col-span-8 space-y-10">

                    {/* 1. Tổng quan */}
                    <section className="bg-white p-8 rounded-xl shadow-md border-t-4" style={{ borderColor: PYTHON_BLUE }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: ERG_BLUE }}>Giới Thiệu Khóa Học</h2>
                        <p className="text-gray-600 leading-relaxed text-justify mb-4">
                            Python là ngôn ngữ lập trình mạnh mẽ, dễ đọc và được sử dụng rộng rãi nhất hiện nay (trong AI, Web, Data Science). Khóa học được thiết kế đặc biệt cho học sinh THCS để làm quen với <strong>lập trình dòng lệnh (Text-based coding)</strong>.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-justify">
                            Không chỉ dừng lại ở việc viết code, khóa học còn hướng dẫn các em tạo ra các sản phẩm thực tế như Game đơn giản (giao diện 2D), các chương trình tính toán thông minh, giúp các em thấy được sức mạnh của công nghệ.
                        </p>
                    </section>

                    {/* 2. Lợi ích */}
                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: ERG_BLUE }}>
                            <Zap className="text-yellow-500 fill-yellow-500" /> Giá Trị Nhận Được
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                            {BENEFITS.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="font-medium text-gray-700 text-sm md:text-base leading-snug">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. Đối tượng tham gia */}
                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: ERG_BLUE }}>
                            <Users style={{ color: PYTHON_BLUE }} /> Đối Tượng Tham Gia
                        </h2>
                        <ul className="space-y-3">
                            {TARGET_AUDIENCE.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 4. Nội dung chi tiết (Curriculum) */}
                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: ERG_BLUE }}>
                            <Terminal style={{ color: PYTHON_BLUE }} /> Nội Dung Khóa Học
                        </h2>
                        <div className="space-y-4">
                            {CURRICULUM.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all bg-white"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                                                {item.lesson}
                                            </span>
                                            <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 pl-[2.75rem]">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* --- RIGHT COLUMN (SIDEBAR STICKY) --- */}
                <div className="lg:col-span-4 relative">
                    <div className="sticky top-24 space-y-6">

                        {/* 1. CARD THÔNG TIN LỚP HỌC */}
                        <div className="bg-white p-6 rounded-xl shadow-xl border-t-4" style={{ borderColor: PYTHON_BLUE }}>
                            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: ERG_BLUE }}>THÔNG TIN LỚP HỌC</h3>

                            <div className="space-y-4 mb-6">
                                {/* Học phí */}
                                {/*<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">*/}
                                {/*    <div className="bg-blue-100 p-2 rounded-full text-blue-600">*/}
                                {/*        <DollarSign size={20} />*/}
                                {/*    </div>*/}
                                {/*    <div>*/}
                                {/*        <p className="text-xs text-gray-500 uppercase font-bold">Học phí trọn khóa</p>*/}
                                {/*        <p className="text-xl font-bold text-blue-600">1.800.000 đ</p>*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                {/* Lịch học */}
                                <div className="flex items-start gap-3 p-2 border-b border-gray-100 pb-3">
                                    <Calendar className="text-blue-500 mt-1" size={18} />
                                    <div>
                                        <span className="block text-sm text-gray-500 font-semibold">Lịch học:</span>
                                        <span className="font-bold text-gray-800">Chiều 2 - 4 - 6</span>
                                    </div>
                                </div>

                                {/* Khai giảng */}
                                <div className="flex items-start gap-3 p-2 border-b border-gray-100 pb-3">
                                    <Clock className="text-blue-500 mt-1" size={18} />
                                    <div>
                                        <span className="block text-sm text-gray-500 font-semibold">Khai giảng:</span>
                                        <span className="font-bold text-gray-800">2026</span>
                                    </div>
                                </div>

                                {/* Thời lượng */}
                                <div className="flex items-start gap-3 p-2">
                                    <Layers className="text-blue-500 mt-1" size={18} />
                                    <div>
                                        <span className="block text-sm text-gray-500 font-semibold">Thời lượng:</span>
                                        <span className="font-bold text-gray-800">12 Buổi</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="w-full py-3.5 text-white font-bold rounded-lg hover:bg-blue-600 transition-transform active:scale-95 uppercase shadow-lg shadow-blue-200"
                                style={{ backgroundColor: PYTHON_BLUE }}
                            >
                                Đăng ký tư vấn
                            </button>
                        </div>

                        {/* 2. CARD HÌNH ẢNH (GỌI COMPONENT) */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-yellow-400">
                            <div className="flex items-center gap-2 mb-2">
                                <Cpu className="text-yellow-600" size={20} />
                                <h3 className="text-lg font-bold" style={{ color: ERG_BLUE }}>Không gian Code</h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-4 text-justify">
                                Phòng máy hiện đại cấu hình cao, cài đặt sẵn Python & Pygame sẵn sàng cho các dự án lớn.
                            </p>

                            {/* Truyền Props với đúng kiểu dữ liệu */}
                            <ImageGallery images={REAL_IMAGES} autoPlayTime={5000} />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}