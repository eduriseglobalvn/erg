import React from 'react';
import { Layers, CheckCircle, BookOpen, ImageIcon } from 'lucide-react';
// Import Component Gallery
import ImageGallery from '@/components/ImageGallery';
import {REAL_IMAGES} from '@/mocks/imageGalerry'

// Định nghĩa kiểu dữ liệu nếu cần thiết (Optional)
interface LevelInfo {
    lv: string;
    title: string;
    desc: string;
}

// --- DỮ LIỆU CỐ ĐỊNH ---
const ERG_BLUE = '#00008b';
const ERG_RED = '#cc0022';



const TOPICS: string[] = [
    "Công nghệ thông tin cơ bản",
    "Công dân trong kỷ nguyên số",
    "Quản lý và xử lý thông tin",
    "Tư duy sáng tạo & tạo nội dung số",
    "Giao tiếp và truyền thông số",
    "Làm việc trực tuyến và cộng tác",
    "An toàn và bảo mật thông tin"
];

const LEVELS: LevelInfo[] = [
    { lv: "01", title: "Level 1 - Nhập môn", desc: "Nắm vững các khái niệm cơ bản và yếu tố nền tảng về CNTT." },
    { lv: "02", title: "Level 2 - Thực hành", desc: "Rèn luyện kỹ năng ứng dụng công nghệ vào thực tế và làm chủ các công cụ số thiết yếu." },
    { lv: "03", title: "Level 3 - Nâng cao", desc: "Phát triển tư duy số chuyên sâu và năng lực vận hành công nghệ ở trình độ cao." }
];

export default function IC3GS6Page() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white py-20 relative">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        <span className="text-xs font-bold uppercase tracking-wider">Chứng chỉ quốc tế</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        IC3 Digital Literacy <br />
                        <span className="text-teal-200">Global Standard 6</span>
                    </h1>
                    <p className="text-teal-50 text-lg max-w-2xl border-l-4 border-teal-300 pl-4">
                        Chuẩn hóa năng lực công nghệ thông tin theo tiêu chuẩn toàn cầu mới nhất do Certiport (Hoa Kỳ) cấp.
                    </p>
                </div>
            </div>

            {/* BODY CONTENT */}
            <div className="container mx-auto px-4 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-20">

                {/* --- LEFT COLUMN --- */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Tổng quan */}
                    <section className="bg-white p-8 rounded-xl shadow-md border-t-4" style={{ borderColor: ERG_BLUE }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: ERG_BLUE }}>Tổng Quan Chương Trình</h2>
                        <p className="text-gray-600 leading-relaxed text-justify">
                            Chương trình đào tạo chuẩn quốc tế, trang bị kiến thức và kỹ năng sử dụng máy tính, Internet và phần mềm văn phòng cơ bản. Đây là chuẩn đánh giá được công nhận toàn cầu và là thước đo năng lực công nghệ chính xác nhất hiện nay.
                        </p>
                    </section>

                    {/* Cấu trúc */}
                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: ERG_BLUE }}>
                            <Layers style={{ color: ERG_RED }} /> Cấu Trúc Đào Tạo
                        </h2>
                        <div className="space-y-4">
                            {LEVELS.map((item, idx) => (
                                <div key={idx} className="group border border-gray-100 rounded-lg p-5 hover:shadow-lg transition-all duration-300 bg-gray-50 hover:border-blue-800">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="text-4xl font-black text-gray-200 group-hover:text-red-700 transition-colors">{item.lv}</span>
                                        <h3 className="text-xl font-bold" style={{ color: ERG_BLUE }}>{item.title}</h3>
                                    </div>
                                    <p className="text-gray-600 pl-[3.5rem]">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Chuyên đề */}
                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: ERG_BLUE }}>
                            <BookOpen style={{ color: ERG_RED }} /> 7 Chuyên Đề Trọng Tâm
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
                            {TOPICS.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                    <span className="font-medium text-gray-700 text-sm md:text-base">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* --- RIGHT COLUMN (SIDEBAR STICKY) --- */}
                <div className="lg:col-span-4 relative">
                    <div className="sticky top-24 space-y-6">

                        {/* 1. CARD ĐĂNG KÝ */}
                        <div className="bg-white p-6 rounded-xl shadow-xl border-t-4" style={{ borderColor: ERG_RED }}>
                            <h3 className="text-xl font-bold mb-1" style={{ color: ERG_BLUE }}>Đăng ký tư vấn</h3>
                            <p className="text-gray-500 text-sm mb-6">Nhận lộ trình học chi tiết cho con</p>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500 text-sm">Cấp độ:</span>
                                    <span className="font-bold" style={{ color: ERG_BLUE }}>Level 1, 2, 3</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500 text-sm">Chứng chỉ:</span>
                                    <span className="font-bold text-teal-600">Certiport (Mỹ)</span>
                                </div>
                            </div>

                            <button
                                className="w-full py-3.5 text-white font-bold rounded-lg hover:bg-red-700 transition-transform active:scale-95 uppercase shadow-lg shadow-red-200"
                                style={{ backgroundColor: ERG_RED }}
                            >
                                Tư vấn ngay
                            </button>
                        </div>

                        {/* 2. CARD HÌNH ẢNH (GỌI COMPONENT) */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-teal-500">
                            <div className="flex items-center gap-2 mb-2">
                                <ImageIcon className="text-teal-600" size={20} />
                                <h3 className="text-lg font-bold" style={{ color: ERG_BLUE }}>Hình ảnh thực tế</h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-4 text-justify">
                                Trải nghiệm không gian học tập chuẩn quốc tế và các hoạt động ngoại khóa thú vị.
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