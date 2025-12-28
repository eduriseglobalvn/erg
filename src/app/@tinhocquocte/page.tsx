'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Award, Users, Globe, ShieldCheck } from 'lucide-react';
import RoadmapSection from '@/components/tinhocquocte/RoadmapSection'; // Đảm bảo đường dẫn đúng

// --- COMPONENT CAROUSEL CHO BANNER (Đã sửa: Ảnh tràn khung, sạch sẽ) ---
const CertificateCarousel = () => {
  const images = [
    { src: "/util/mos.jpg", label: "Chứng chỉ MOS - Microsoft" },
    { src: "/util/ic3.jpg", label: "Chứng chỉ IC3 - Certiport" },
    { src: "/util/spark.jpg", label: "Chứng chỉ IC3 Spark" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
      <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden border-4 border-white/20 bg-white group">

        {/* Lớp dự phòng (Hiện khi ảnh đang tải hoặc lỗi) */}
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400 p-8">
            <Award size={60} className="mx-auto mb-2 opacity-50"/>
            <p className="font-bold text-xs uppercase tracking-widest">{images[current].label}</p>
          </div>
        </div>

        {/* HIỂN THỊ ẢNH THẬT (Tràn khung, không viền, không chữ) */}
        <div className="absolute inset-0 w-full h-full transition-opacity duration-500">
          <img
              src={images[current].src}
              alt={images[current].label}
              className="w-full h-full object-cover" // Đảm bảo ảnh lấp đầy khung 4/3
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = '0';
              }}
          />
        </div>

        {/* Navigation Dots (Làm mờ hơn để không che ảnh) */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, idx) => (
              <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'w-6 bg-[var(--erg-red)]' : 'bg-white/50'}`}
              />
          ))}
        </div>
      </div>
  );
};

export default function HomePage() {
  return (
      <main className="min-h-screen">

        {/* 1. HERO SECTION */}
        <section className="relative bg-[var(--erg-blue)] text-white py-20 lg:py-28 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-5"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-[var(--erg-red)] opacity-10"></div>

          <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
                <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-sm font-semibold backdrop-blur-sm text-[var(--erg-red)] bg-white">
                  #1 Đào tạo tin học chuẩn quốc tế
                </span>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                LEARN TODAY, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                    LEAD TOMORROW
                  </span>
              </h1>
              <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                Trang bị kiến thức và kỹ năng sử dụng công nghệ theo tiêu chuẩn toàn cầu IC3 & MOS. Mở rộng cánh cửa tương lai cho thế hệ trẻ Việt Nam.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/lo-trinh" className="px-8 py-3.5 bg-[var(--erg-red)] hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20 flex items-center gap-2">
                  Xem Lộ Trình <ArrowRight size={18} />
                </Link>
                <Link href="/khoa-hoc" className="px-8 py-3.5 bg-white text-[var(--erg-blue)] hover:bg-blue-50 font-bold rounded-lg transition-all">
                  Khám Phá Khóa Học
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center w-full">
              <CertificateCarousel />
            </div>
          </div>
        </section>

        {/* 2. WHY CHOOSE US */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Globe className="w-10 h-10 text-[var(--erg-red)]" />,
                  title: "Chuẩn Quốc Tế",
                  desc: "Giáo trình và chứng chỉ được công nhận toàn cầu bởi Microsoft & Certiport."
                },
                {
                  icon: <Users className="w-10 h-10 text-[var(--erg-red)]" />,
                  title: "Đội Ngũ Tâm Huyết",
                  desc: "Giáo viên giàu kinh nghiệm, phương pháp giảng dạy hiện đại, tận tâm, sát sao từng học viên."
                },
                {
                  icon: <ShieldCheck className="w-10 h-10 text-[var(--erg-red)]" />,
                  title: "Cam Kết Chất Lượng",
                  desc: "Lộ trình học tập rõ ràng, cam kết hỗ trợ học viên đạt kết quả cao nhất trong các kỳ thi."
                }
              ].map((item, i) => (
                  <div key={i} className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white group">
                    <div className="mb-4 bg-red-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--erg-blue)] mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <RoadmapSection />

        {/* 4. FEATURED COURSES */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-[var(--erg-blue)]">Các Chương Trình Đào Tạo</h2>
                <p className="text-gray-600 mt-2">Được thiết kế phù hợp cho từng độ tuổi và nhu cầu</p>
              </div>
              <Link href="/khoa-hoc" className="flex items-center gap-2 text-[var(--erg-red)] font-bold hover:gap-3 transition-all">
                Xem tất cả <ArrowRight size={18}/>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Course Card 1: IC3 Spark */}
              <div className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 flex flex-col h-full">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  <span className="text-5xl font-black text-white/20 select-none group-hover:scale-110 transition-transform duration-500">SPARK</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">Tiểu học</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--erg-blue)] mb-2 group-hover:text-blue-600 transition-colors">IC3 Spark GS6</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">Học máy tính từ bước đầu tiên, nâng cao nhận thức và kỹ năng số.</p>
                  <ul className="space-y-2 mb-6 border-t border-gray-100 pt-4 flex-1">
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-blue-500"/> Level 1: Các khái niệm cơ bản</li>
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-blue-500"/> Level 2: Kỹ năng thực hành</li>
                  </ul>
                  <Link href="/ic3-gs6-spark" className="block w-full py-3 text-center rounded-lg border-2 border-blue-500 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all mt-auto">
                    Xem Chi Tiết
                  </Link>
                </div>
              </div>

              {/* Course Card 2: IC3 GS6 */}
              <div className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-teal-300 flex flex-col h-full">
                <div className="h-48 bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  <span className="text-5xl font-black text-white/20 select-none group-hover:scale-110 transition-transform duration-500">GS6</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold uppercase tracking-wider">THCS</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--erg-blue)] mb-2 group-hover:text-teal-600 transition-colors">IC3 GS6</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">Chuẩn đánh giá năng lực CNTT theo tiêu chuẩn toàn cầu mới nhất.</p>
                  <ul className="space-y-2 mb-6 border-t border-gray-100 pt-4 flex-1">
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-teal-500"/> 3 Cấp độ năng lực</li>
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-teal-500"/> 7 Chuyên đề trọng tâm</li>
                  </ul>
                  <Link href="/ic3-gs6" className="block w-full py-3 text-center rounded-lg border-2 border-teal-500 text-teal-600 font-bold hover:bg-teal-500 hover:text-white transition-all mt-auto">
                    Xem Chi Tiết
                  </Link>
                </div>
              </div>

              {/* Course Card 3: MOS */}
              <div className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-300 flex flex-col h-full">
                <div className="h-48 bg-gradient-to-br from-[#F25022] to-orange-500 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  <span className="text-5xl font-black text-white/20 select-none group-hover:scale-110 transition-transform duration-500">MOS</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-orange-50 text-[#F25022] text-xs font-bold uppercase tracking-wider">THPT & Đại học</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--erg-blue)] mb-2 group-hover:text-[#F25022] transition-colors">Microsoft Office (MOS)</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">Chứng chỉ tin học văn phòng quốc tế do Microsoft cấp.</p>
                  <ul className="space-y-2 mb-6 border-t border-gray-100 pt-4 flex-1">
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-orange-500"/> Word, Excel, PowerPoint...</li>
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-orange-500"/> Cấp độ: Specialist, Expert</li>
                  </ul>
                  <Link href="/mos" className="block w-full py-3 text-center rounded-lg border-2 border-[#F25022] text-[#F25022] font-bold hover:bg-[#F25022] hover:text-white transition-all mt-auto">
                    Xem Chi Tiết
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CTA SECTION */}
        <section className="py-20 bg-[var(--erg-blue)] text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng cho kỷ nguyên số?</h2>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">Đăng ký tư vấn ngay hôm nay để nhận lộ trình học tập chi tiết phù hợp nhất với năng lực của bạn.</p>
            <Link href="/lien-he" className="inline-block px-12 py-4 bg-[var(--erg-red)] text-white font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-red-900/30">
              Đăng Ký Tư Vấn Ngay
            </Link>
          </div>
        </section>
      </main>
  );
}