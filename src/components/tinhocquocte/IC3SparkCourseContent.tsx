'use client';

import React from 'react';
import { BookOpen, Shield, Star, MousePointer2, Monitor, Trophy, CheckCircle2, ImageIcon } from 'lucide-react';
import ImageGallery from "@/components/ImageGallery";

export default function IC3SparkCourseContent({ pageData, galleryImages }: { pageData: any, galleryImages: any }) {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-[70px] lg:pt-[135px]">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-20 relative overflow-hidden">
                <div className="absolute top-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                <div className="absolute bottom-5 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-4">
                        <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                        <span className="text-xs font-bold uppercase tracking-wider">Dành cho Khối Tiểu Học</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        IC3 Spark <br />
                        <span className="text-cyan-100">Global Standard 6</span>
                    </h1>
                    <p className="text-blue-50 text-lg max-w-2xl border-l-4 border-cyan-300 pl-4">
                        {pageData?.title || "Chứng chỉ tin học quốc tế khởi đầu hoàn hảo cho trẻ em. Xây dựng nền tảng công nghệ đúng đắn và an toàn ngay từ bậc Tiểu học."}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-20">
                <div className="lg:col-span-8 space-y-10">
                    <section className="bg-white p-8 rounded-xl shadow-md border-t-4 border-[#00008b]">
                        <h2 className="text-2xl font-bold text-[#00008b] mb-4">Tại Sao Trẻ Cần Học IC3 Spark?</h2>
                        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
                            Trong kỷ nguyên số, trẻ em tiếp xúc với công nghệ từ rất sớm. IC3 Spark không chỉ dạy cách sử dụng máy tính, mà quan trọng hơn là dạy trẻ cách **tương tác an toàn**, bảo vệ thông tin cá nhân và hình thành tư duy logic.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                                <Shield className="text-blue-600 w-6 h-6" />
                                <span className="text-sm font-bold text-gray-700">An toàn trực tuyến</span>
                            </div>
                            <div className="flex items-center gap-3 bg-cyan-50 p-3 rounded-lg">
                                <Monitor className="text-cyan-600 w-6 h-6" />
                                <span className="text-sm font-bold text-gray-700">Thành thạo công cụ số</span>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold text-[#00008b] mb-8 flex items-center gap-2">
                            <Trophy className="text-[#cc0022]" /> Lộ Trình Đào Tạo
                        </h2>
                        <div className="relative border-l-2 border-dashed border-blue-200 ml-4 md:ml-6 space-y-10 pb-4">
                            <div className="relative pl-8 md:pl-10 group">
                                <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-blue-100 border-4 border-[#00008b]"></div>
                                <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl hover:shadow-lg hover:border-blue-400 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">LEVEL 1</span>
                                        <h3 className="text-lg font-bold text-[#00008b]">Các khái niệm cơ bản</h3>
                                    </div>
                                    <p className="text-gray-600 italic mb-2">"Học máy tính từ những bước đầu tiên"</p>
                                    <ul className="text-sm text-gray-500 space-y-1">
                                        <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-500 mt-0.5" /> Phần cứng, phần mềm, hệ điều hành</li>
                                        <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-500 mt-0.5" /> Các thao tác chuột, bàn phím cơ bản</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative pl-8 md:pl-10 group">
                                <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-cyan-100 border-4 border-cyan-500"></div>
                                <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl hover:shadow-lg hover:border-cyan-400 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                        <span className="bg-cyan-600 text-white text-xs font-bold px-2 py-1 rounded">LEVEL 2</span>
                                        <h3 className="text-lg font-bold text-[#00008b]">Ứng dụng chủ chốt</h3>
                                    </div>
                                    <p className="text-gray-600 italic mb-2">"Nâng cao nhận thức & kĩ năng thực hành"</p>
                                    <ul className="text-sm text-gray-500 space-y-1">
                                        <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-500 mt-0.5" /> Soạn thảo văn bản, bảng tính đơn giản</li>
                                        <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-500 mt-0.5" /> Tạo bài trình chiếu đa phương tiện</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative pl-8 md:pl-10 group">
                                <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-purple-100 border-4 border-purple-500"></div>
                                <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl hover:shadow-lg hover:border-purple-400 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                        <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">LEVEL 3</span>
                                        <h3 className="text-lg font-bold text-[#00008b]">Cuộc sống trực tuyến</h3>
                                    </div>
                                    <p className="text-gray-600 italic mb-2">"Hiểu rõ trách nhiệm và đạo đức trong môi trường số"</p>
                                    <ul className="text-sm text-gray-500 space-y-1">
                                        <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-500 mt-0.5" /> Sử dụng Email, trình duyệt web an toàn</li>
                                        <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-500 mt-0.5" /> Quy tắc ứng xử và bảo vệ danh tính số</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold text-[#00008b] mb-6 flex items-center gap-2">
                            <BookOpen className="text-[#cc0022]" /> Con Đạt Được Gì?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Chứng chỉ chuẩn quốc tế do Certiport (Hoa Kỳ) cấp",
                                "Tư duy logic và giải quyết vấn đề",
                                "Kỹ năng gõ phím 10 ngón chuẩn xác",
                                "Tự tin sử dụng Office để làm bài tập",
                                "Nhận biết và phòng tránh nguy hiểm trên mạng",
                                "Bước đệm vững chắc để học lập trình sau này"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-6 pt-10 lg:pt-0">
                    <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-[#cc0022] sticky top-[150px]">
                        <h3 className="text-xl font-bold text-[#00008b] mb-1">Đăng kỹ tư vấn</h3>
                        <p className="text-gray-500 text-sm mb-6">Trải nghiệm lớp học tiêu chuẩn quốc tế</p>
                        <div className="space-y-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-800 font-bold mb-1">🎁 Ưu đãi đặc biệt:</p>
                                <p className="text-xs text-blue-600">Kiểm tra năng lực đầu vào miễn phí và tư vấn lộ trình cá nhân hóa.</p>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Độ tuổi:</span>
                                <span className="font-bold text-[#00008b]">6 - 11 tuổi</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Hình thức:</span>
                                <span className="font-bold text-gray-800">Offline / Online</span>
                            </div>
                        </div>
                        <button className="w-full py-3.5 bg-[#cc0022] text-white font-bold rounded-lg hover:bg-red-700 transition-transform active:scale-95 uppercase shadow-lg shadow-red-200 flex items-center justify-center gap-2">
                            <MousePointer2 size={18} /> Đăng Ký Ngay
                        </button>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-teal-500">
                        <div className="flex items-center gap-2 mb-2">
                            <ImageIcon className="text-teal-600" size={20} />
                            <h3 className="text-lg font-bold">Hình ảnh thực tế</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 text-justify">
                            Trải nghiệm không gian học tập chuẩn quốc tế và các hoạt động ngoại khóa thú vị.
                        </p>
                        <ImageGallery images={galleryImages} autoPlayTime={5000} />
                    </div>
                </div>
            </div>
        </div>
    );
}
