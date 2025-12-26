'use client';

import React from 'react';
import {Award, FileText, Check, Star, Database, Mail, Presentation, Table, Phone, ImageIcon} from 'lucide-react';
import ImageGallery from "@/components/ImageGallery";
import {REAL_IMAGES} from "@/mocks/imageGalerry";

export default function MOSPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* HEADER: Màu Microsoft Red-Orange (#F25022) + Hiệu ứng Glossy Shine */}
            <div className="relative overflow-hidden bg-[#F25022] text-white py-20">

                {/* 1. Lớp phủ Gradient trắng chéo tạo độ bóng bề mặt */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>

                {/* 2. Đốm sáng Blur trắng (White Blur Shine) ở góc trên */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-white opacity-20 rounded-full blur-[100px]"></div>

                {/* 3. Đốm sáng phụ ở dưới để tạo chiều sâu */}
                <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white opacity-10 rounded-full blur-[80px]"></div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Badge hiệu ứng kính (Glassmorphism) */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-5 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-white drop-shadow-sm">Tin học văn phòng</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-md">
                        Microsoft Office <br/>
                        <span className="text-white relative">
                            Specialist (MOS)
                            {/* Đường gạch chân phát sáng */}
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300 opacity-80" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.7501 9.99995 84.8547 9.75001 58 1.99999C47.3982 0.366224 45.4204 7.50002 67 6.99997C93.9755 6.3749 146.5 2.50001 198 4.99998" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                        </span>
                    </h1>

                    <p className="text-white/95 text-lg max-w-2xl border-l-4 border-white/50 pl-5 font-medium leading-relaxed drop-shadow-sm">
                        Chứng chỉ tin học văn phòng quốc tế do Microsoft cấp, có giá trị sử dụng trên toàn cầu.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-20">

                {/* LEFT CONTENT */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Nội dung đào tạo */}
                    <section className="bg-white p-8 rounded-xl shadow-md border-t-4 border-[var(--erg-blue)]">
                        <h2 className="text-2xl font-bold text-[var(--erg-blue)] mb-8 flex items-center gap-2">
                            <FileText className="text-[#F25022]" /> Nội Dung Đào Tạo
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* 1. MOS Word */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-500 transition-all bg-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12 translate-x-2 -translate-y-2">
                                    <FileText size={80} className="text-blue-600"/>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-100 rounded text-blue-600"><FileText size={20}/></div>
                                        MOS Word
                                    </h3>
                                    <p className="text-gray-600 text-sm pl-9">Soạn thảo, định dạng và xử lý văn bản chuyên nghiệp.</p>
                                </div>
                            </div>

                            {/* 2. MOS Excel */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-green-500 transition-all bg-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12 translate-x-2 -translate-y-2">
                                    <Table size={80} className="text-green-600"/>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center gap-2">
                                        <div className="p-1.5 bg-green-100 rounded text-green-600"><Table size={20}/></div>
                                        MOS Excel
                                    </h3>
                                    <p className="text-gray-600 text-sm pl-9">Tính toán, phân tích và trình bày dữ liệu hiệu quả.</p>
                                </div>
                            </div>

                            {/* 3. MOS PowerPoint */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-500 transition-all bg-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12 translate-x-2 -translate-y-2">
                                    <Presentation size={80} className="text-orange-600"/>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold text-orange-800 mb-2 flex items-center gap-2">
                                        <div className="p-1.5 bg-orange-100 rounded text-orange-600"><Presentation size={20}/></div>
                                        MOS PowerPoint
                                    </h3>
                                    <p className="text-gray-600 text-sm pl-9">Thiết kế bài trình chiếu ấn tượng và trực quan.</p>
                                </div>
                            </div>

                            {/* 4. MOS Outlook (Đã thêm ảnh nền và style giống các môn trên) */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-cyan-500 transition-all bg-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12 translate-x-2 -translate-y-2">
                                    <Mail size={80} className="text-cyan-600"/>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold text-cyan-800 mb-2 flex items-center gap-2">
                                        <div className="p-1.5 bg-cyan-100 rounded text-cyan-600"><Mail size={20}/></div>
                                        MOS Outlook
                                    </h3>
                                    <p className="text-gray-600 text-sm pl-9">Quản lý email, lịch biểu và thông tin cá nhân.</p>
                                </div>
                            </div>

                            {/* 5. MOS Access (Cho nằm full bề ngang ở dưới cùng để cân đối) */}
                            <div className="md:col-span-2 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-red-500 transition-all bg-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12 translate-x-2 -translate-y-2">
                                    <Database size={80} className="text-red-600"/>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                                        <div className="p-1.5 bg-red-100 rounded text-red-600"><Database size={20}/></div>
                                        MOS Access
                                    </h3>
                                    <p className="text-gray-600 text-sm pl-9">Hệ quản trị cơ sở dữ liệu, xây dựng và quản lý dữ liệu chuyên nghiệp.</p>
                                </div>
                            </div>

                        </div>
                    </section>
                    {/* Các cấp độ chứng chỉ */}
                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold text-[var(--erg-blue)] mb-6 flex items-center gap-2">
                            <Award className="text-[#F25022]" /> Các Cấp Độ Chứng Chỉ
                        </h2>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="font-bold text-[#F25022] text-sm">1</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">MOS Specialist</h3>
                                    <p className="text-gray-600 text-sm mt-1">Chứng chỉ cơ bản cho từng ứng dụng. Xác nhận kỹ năng sử dụng thành thạo.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="font-bold text-[#F25022] text-sm">2</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">MOS Expert</h3>
                                    <p className="text-gray-600 text-sm mt-1">Cấp độ nâng cao dành cho Word và Excel. Dành cho các tác vụ chuyên sâu.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="font-bold text-[#F25022] text-sm">3</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">MOS Master</h3>
                                    <p className="text-gray-600 text-sm mt-1">Chứng chỉ cao nhất, dành cho người hoàn thành đủ 4 bài thi theo yêu cầu.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="lg:col-span-4 space-y-6 pt-10 lg:pt-0">
                    <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-[#F25022] sticky top-24">
                        <h3 className="text-xl font-bold text-[var(--erg-blue)] mb-4">Lợi ích khi có MOS</h3>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                                <span className="text-sm text-gray-600">Ưu tiên xét tuyển Đại học</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                                <span className="text-sm text-gray-600">Chuẩn đầu ra sinh viên</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                                <span className="text-sm text-gray-600">Ứng dụng thực tế trong công việc</span>
                            </li>

                        </ul>

                        {/* Nút bấm cũng dùng màu chuẩn F25022 */}
                        <button className="w-full py-3.5 bg-[#F25022] text-white font-bold rounded-lg hover:opacity-90 transition-opacity active:scale-95 uppercase shadow-lg shadow-orange-200">
                            Đăng Ký Học MOS
                        </button>
                        {/*<div className="mt-4 text-center">*/}
                        {/*    <div className="text-[var(--erg-blue)] font-bold text-lg flex justify-center items-center gap-2">*/}
                        {/*        <Phone size={18}/> 0766.144.888*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>

                    {/* 2. CARD HÌNH ẢNH (GỌI COMPONENT) */}
                    <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-teal-500">
                        <div className="flex items-center gap-2 mb-2">
                            <ImageIcon className="text-teal-600" size={20} />
                            <h3 className="text-lg font-bold">Hình ảnh thực tế</h3>
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
    );
}