import React from 'react';
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram } from 'lucide-react';
import Image from 'next/image';

const FooterWaveFix = () => {
    return (
        <footer className="bg-[#F5F7FA] pt-16 text-[#00008b] font-sans relative">

            {/* 1. Thanh Gradient trên cùng */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#cc0022] via-[#00008b] to-[#cc0022]"></div>

            {/* === 2. PHẦN NỘI DUNG CHÍNH ===
         FIX: Thay đổi `pb-2` thành `pb-28` hoặc `pb-32`.
         Điều này tạo ra khoảng trống lớn ở dưới cùng, đẩy chữ lên trên để sóng không che mất.
      */}
            <div className="container mx-auto px-4 md:px-6 pb-28 md:pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

                    {/* CỘT 1: Brand & Intro */}
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-1">
                                <Image src="/erg.png" alt="Edurise Global Logo" width={100} height={45} className="object-contain" />
                            </div>
                            <span className="text-xl font-extrabold text-[#00008b] tracking-tight">Edurise Global</span>
                        </div>
                        <p className="text-slate-600 mb-8 leading-relaxed pr-4 text-justify font-medium">
                            Hệ thống giáo dục hàng đầu, cam kết mang lại chất lượng đào tạo tốt nhất cho thế hệ trẻ Việt Nam. Khơi dậy tiềm năng, kiến tạo tương lai.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/eduriseerg" className="group bg-white p-3 rounded-full shadow-sm border border-slate-100 hover:bg-[#00008b] transition-all duration-300">
                                <Facebook size={20} className="text-[#00008b] group-hover:text-white transition-colors" />
                            </a>
                            <a href="#" className="group bg-white p-3 rounded-full shadow-sm border border-slate-100 hover:bg-[#cc0022] transition-all duration-300">
                                <Youtube size={20} className="text-[#00008b] group-hover:text-white transition-colors" />
                            </a>
                            <a href="#" className="group bg-white p-3 rounded-full shadow-sm border border-slate-100 hover:bg-pink-600 transition-all duration-300">
                                <Instagram size={20} className="text-[#00008b] group-hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* CỘT 2: Thông tin liên hệ */}
                    <div>
                        <h3 className="font-bold text-lg mb-8 uppercase tracking-wide text-[#00008b] relative inline-block">
                            Thông tin liên hệ
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#cc0022] rounded-full"></span>
                        </h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="bg-white p-2.5 rounded-full shadow-sm text-[#cc0022] shrink-0 mt-1 border border-slate-50">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Trụ sở chính</span>
                                    <p className="text-[#00008b] font-semibold leading-tight block">83B, Hoàng Sa, Phường Tân Định, TP.Hồ Chí Minh</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="bg-white p-2.5 rounded-full shadow-sm text-[#cc0022] shrink-0 border border-slate-50 group-hover:bg-[#cc0022] group-hover:text-white transition-all">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Hotline</span>
                                    <a href="tel:0766144888" className="text-[#00008b] font-bold text-lg hover:text-[#cc0022] transition-colors">0766.144.888</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="bg-white p-2.5 rounded-full shadow-sm text-[#cc0022] shrink-0 border border-slate-50 group-hover:bg-[#cc0022] group-hover:text-white transition-all">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Email</span>
                                    <a href="mailto:info.eduerg@gmail.com" className="text-[#00008b] font-medium hover:text-[#cc0022] transition-colors">info.eduerg@gmail.com</a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* CỘT 3: Chi nhánh */}
                    <div>
                        <h3 className="font-bold text-lg mb-8 uppercase tracking-wide text-[#00008b] relative inline-block">
                            Chi nhánh
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#cc0022] rounded-full"></span>
                        </h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="bg-white p-2.5 rounded-full shadow-sm text-[#cc0022] shrink-0 mt-1 border border-slate-50">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Địa chỉ</span>
                                    <p className="text-[#00008b] font-semibold leading-tight block">Trung tâm Tin học ERG, Số 40-42 Bình Phú, Phường Bình Phú, TP. Hồ Chí Minh</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="bg-white p-2.5 rounded-full shadow-sm text-[#cc0022] shrink-0 border border-slate-50 group-hover:bg-[#cc0022] group-hover:text-white transition-all">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Hotline</span>
                                    <a href="tel:0967689259" className="text-[#00008b] font-bold text-lg hover:text-[#cc0022] transition-colors">0967.689.259</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="bg-white p-2.5 rounded-full shadow-sm text-[#cc0022] shrink-0 border border-slate-50 group-hover:bg-[#cc0022] group-hover:text-white transition-all">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Email</span>
                                    <a href="mailto:ic3.erg@gmail.com" className="text-[#00008b] font-medium hover:text-[#cc0022] transition-colors">ic3.erg@gmail.com</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* === 3. PHẦN LƯỢN SÓNG & COPYRIGHT ===
         Phần này được đặt trong một khối relative riêng biệt ở cuối.
      */}
            <div className="relative w-full">

                {/* Lớp SVG Lượn sóng: Nằm đè lên trên khoảng trống padding đã tạo ở trên */}
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-[99%] z-10">
                    <svg
                        className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]" // Tăng độ cao sóng lên 100px cho mềm mại
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                            className="fill-[#00008b]"
                        ></path>
                    </svg>
                </div>

                {/* Khối nền xanh chứa nội dung bản quyền */}
                <div className="bg-[#00008b] pb-6 pt-2 relative z-20">
                    <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-sm text-blue-200/80">
                        <p className="hover:text-white transition-colors cursor-default text-center md:text-left">
                            © 2025 Edurise Global. All rights reserved.
                        </p>

                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition relative group">
                                Điều khoản sử dụng
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#cc0022] transition-all group-hover:w-full"></span>
                            </a>
                            <span className="text-blue-500/50">|</span>
                            <a href="#" className="hover:text-white transition relative group">
                                Chính sách bảo mật
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#cc0022] transition-all group-hover:w-full"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterWaveFix;