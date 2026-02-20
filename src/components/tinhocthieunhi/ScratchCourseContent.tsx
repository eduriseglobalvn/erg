'use client';

import React from 'react';
import {
    Layers,
    CheckCircle,
    BookOpen,
    ImageIcon,
    Calendar,
    Clock,
    Users,
    Gamepad2,
    Star
} from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';
import { REAL_IMAGES } from '@/mocks/imageGalerry';

const ERG_BLUE = '#00008b';
const ERG_ORANGE = '#f97316';

const BENEFITS: string[] = [
    "Rèn luyện tính kiên trì, cẩn thận trong học tập và cuộc sống.",
    "Bồi dưỡng niềm say mê học tập, tính tự giác giải quyết công việc.",
    "Kích thích và phát huy trí tưởng tượng phong phú.",
    "Biết diễn đạt ý tưởng, suy nghĩ một cách chặt chẽ, logic.",
    "Biết chọn lọc và thử nghiệm các ý tưởng mới.",
    "Biết phân chia và phối hợp trong khi làm việc nhóm.",
    "Biết xử lý lỗi (debug) và tìm các giải pháp thay thế.",
    "Rèn luyện kỹ năng thuyết trình, giải thích mạch lạc."
];

const CURRICULUM = [
    { lesson: 1, title: "Tư duy máy tính và làm quen với Scratch" },
    { lesson: 2, title: "Tạo Sprites và chuyển động" },
    { lesson: 3, title: "Vẽ hình trong Scratch" },
    { lesson: 4, title: "Âm thanh trong Scratch" },
    { lesson: 5, title: "Điều khiển rẽ nhánh (Phần 1)" },
    { lesson: 6, title: "Điều khiển rẽ nhánh (Phần 2)" },
    { lesson: 7, title: "Vòng lặp (Phần 1)" },
    { lesson: 8, title: "Vòng lặp (Phần 2)" },
    { lesson: 9, title: "Hội thoại và truyền thông" },
    { lesson: 10, title: "Cảm biến" },
    { lesson: 11, title: "Thực hiện dự án học tập (Phần 1)" },
    { lesson: 12, title: "Hoàn thiện dự án, Thuyết trình & Đánh giá" },
];

const TARGET_AUDIENCE = [
    "Học sinh chưa biết gì về lập trình, muốn bắt đầu từ con số 0.",
    "Học sinh từ Lớp 4 bắt đầu làm quen với tư duy máy tính.",
    "Học sinh yêu thích Game, muốn tự tay thiết kế trò chơi riêng."
];

export default function ScratchCourseContent() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800 pt-[70px] lg:pt-[135px]">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-4">
                        <Gamepad2 size={16} className="text-white" />
                        <span className="text-xs font-bold uppercase tracking-wider">Lập trình Thiếu nhi</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        KHÓA HỌC LẬP TRÌNH <br />
                        <span className="text-yellow-100">SCRATCH</span>
                    </h1>
                    <p className="text-orange-50 text-lg max-w-2xl border-l-4 border-yellow-300 pl-4 font-medium">
                        Khơi dậy tư duy sáng tạo thông qua ngôn ngữ lập trình kéo thả. Giúp trẻ biến ý tưởng thành Game và Phim hoạt hình sinh động.
                    </p>
                </div>
            </div>

            {/* BODY CONTENT */}
            <div className="container mx-auto px-4 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-20">
                <div className="lg:col-span-8 space-y-10">
                    <section className="bg-white p-8 rounded-xl shadow-md border-t-4" style={{ borderColor: ERG_ORANGE }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: ERG_BLUE }}>Giới Thiệu Khóa Học</h2>
                        <p className="text-gray-600 leading-relaxed text-justify mb-4">
                            Scratch là phần mềm lập trình đồ họa dành cho trẻ em với các công cụ giúp các em học sinh tiếp cận với công nghệ lập trình bằng những ngôn ngữ cơ bản và đơn giản nhất.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-justify">
                            Thay vì phải viết những dòng lệnh phức tạp, các em có thể tự mình thiết kế ra nhiều nhân vật khác nhau bằng cách <strong>"kéo thả"</strong> và lắp ghép các khối lệnh đầy màu sắc giống như chơi Lego. Từ đó, trẻ dễ dàng tạo ra các trò chơi thú vị, rèn luyện tư duy lập trình và tính kiên trì.
                        </p>
                    </section>

                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: ERG_BLUE }}>
                            <Star className="text-yellow-500 fill-yellow-500" /> Trẻ Em Sẽ Học Được Gì?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                            {BENEFITS.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-100">
                                    <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <span className="font-medium text-gray-700 text-sm md:text-base leading-snug">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: ERG_BLUE }}>
                            <Users style={{ color: ERG_ORANGE }} /> Đối Tượng Tham Gia
                        </h2>
                        <ul className="space-y-3">
                            {TARGET_AUDIENCE.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border-l-4 border-orange-400">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: ERG_BLUE }}>
                            <BookOpen style={{ color: ERG_ORANGE }} /> Nội Dung Khóa Học
                        </h2>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            {CURRICULUM.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center p-4 hover:bg-orange-50 transition-colors ${idx !== CURRICULUM.length - 1 ? 'border-b border-gray-100' : ''
                                        }`}
                                >
                                    <div className="w-16 flex-shrink-0">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Bài {item.lesson}</span>
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-800">{item.title}</h3>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 relative">
                    <div className="sticky top-[150px] space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-xl border-t-4" style={{ borderColor: ERG_ORANGE }}>
                            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: ERG_BLUE }}>THÔNG TIN KHÓA HỌC</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3 p-2 border-b border-gray-100 pb-3">
                                    <Calendar className="text-orange-500 mt-1" size={18} />
                                    <div>
                                        <span className="block text-sm text-gray-500 font-semibold">Lịch học:</span>
                                        <span className="font-bold text-gray-800">Sáng 2 - 4 - 6</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-2 border-b border-gray-100 pb-3">
                                    <Clock className="text-orange-500 mt-1" size={18} />
                                    <div>
                                        <span className="block text-sm text-gray-500 font-semibold">Khai giảng:</span>
                                        <span className="font-bold text-gray-800">2026</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-2">
                                    <Layers className="text-orange-500 mt-1" size={18} />
                                    <div>
                                        <span className="block text-sm text-gray-500 font-semibold">Thời lượng:</span>
                                        <span className="font-bold text-gray-800">12 Buổi</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="w-full py-3.5 text-white font-bold rounded-lg hover:bg-orange-600 transition-transform active:scale-95 uppercase shadow-lg shadow-orange-200"
                                style={{ backgroundColor: ERG_ORANGE }}
                            >
                                Đăng ký ngay
                            </button>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-yellow-400">
                            <div className="flex items-center gap-2 mb-2">
                                <ImageIcon className="text-yellow-600" size={20} />
                                <h3 className="text-lg font-bold" style={{ color: ERG_BLUE }}>Hình ảnh lớp học</h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-4 text-justify">
                                Môi trường học tập sáng tạo, trang thiết bị hiện đại giúp bé thỏa sức khám phá.
                            </p>
                            <ImageGallery images={REAL_IMAGES} autoPlayTime={5000} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
