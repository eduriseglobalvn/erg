import React from 'react';
import Link from 'next/link';
import { BookOpen, MapPin, Phone, Mail, Facebook, Youtube, Instagram, ChevronRight } from 'lucide-react';
import Image from 'next/image';


const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* THAY ĐỔI CHÍNH: Chia thành 3 cột trên màn hình LG trở lên */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* CỘT 1: Brand & Intro */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white text-white p-1.5 rounded-lg">
                  <Image src="/erg.webp" alt="Logo" width={80} height={36} />
              </div>
              <span className="text-xl font-bold text-white">Edurise Global</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Hệ thống giáo dục hàng đầu, cam kết mang lại chất lượng đào tạo tốt nhất cho thế hệ trẻ Việt Nam. Khơi dậy tiềm năng, kiến tạo tương lai.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/eduriseerg" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-red-600 transition-colors" aria-label="Youtube">
                <Youtube size={18} />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* CỘT 2: Thông tin liên hệ */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Thông tin liên hệ</h3>
            <ul className="space-y-4">
              <div className="flex items-start gap-3">
                    <div className="text-blue-500 shrink-0 mt-1">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <p className="text-blue-100">Trụ sở chính: 83B, Hoàng Sa, Phường Tân Định, TP.Hồ Chí Minh</p>
                    </div>
                </div>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-blue-500 shrink-0" />
                <a href="tel:0766144888" className="hover:text-white transition-colors">0766.144.888</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-blue-500 shrink-0" />
                <a href="mailto:info.eduerg@gmail.com" className="hover:text-white transition-colors">info.eduerg@gmail.com</a>
              </li>
            </ul>
          </div>
          
          {/* CỘT 3: Thông tin liên hệ chi nhánh */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Chi nhánh</h3>
            <ul className="space-y-4">
              <div className="flex items-start gap-3">
                    <div className="text-blue-500 shrink-0 mt-1">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <p className="text-blue-100">Trung tâm Tin học ERG, Số 40-42 Bình Phú, P Bình Phú, TP. Hồ Chí Minh</p>
                    </div>
                </div>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-blue-500 shrink-0" />
                <a href="tel:0967689259" className="hover:text-white transition-colors">0967.689.259</a>
              </li>

                <li className="flex items-center gap-3">
                    <Mail size={20} className="text-blue-500 shrink-0" />
                    <a href="mailto:info.eduerg@gmail.com" className="hover:text-white transition-colors">ic3.erg@gmail.com</a>
                </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          <p>© 2025 Edurise Global. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;