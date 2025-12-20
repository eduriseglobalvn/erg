'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Award, BookOpen, GraduationCap, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import RoadmapSection from '@/components/tinhocquocgia/RoadmapSection'; // Lưu ý: Bạn cần sửa nội dung bên trong component này cho phù hợp với lộ trình QG

// --- COMPONENT CAROUSEL CHO BANNER (Đã sửa: Ảnh vừa khung, không viền, không chữ) ---
const NationalCertificateCarousel = () => {
  const images = [
    { src: "/util/cnttcb.jpg", label: "Chứng chỉ CNTT Cơ Bản" },
    { src: "/util/cnttnc.jpg", label: "Chứng chỉ CNTT Nâng Cao" },
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

        {/* LỚP 1: Khung giả lập làm nền dự phòng (Hiện khi ảnh đang tải hoặc lỗi) */}
        <div className="absolute inset-0 bg-[#fdfbf7] flex items-center justify-center border-[10px] border-[#8B0000]/10">
          <div className="text-center text-gray-500 p-8">
            <div className="mb-4 flex justify-center">
              <Award size={64} className="text-[#DAA520]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#8B0000] uppercase mb-2">Chứng chỉ Quốc gia</h3>
            <p className="font-semibold text-gray-700">{images[current].label}</p>
            <p className="text-xs mt-4 text-gray-400 italic">(Phôi bằng do Bộ GD&ĐT quy định)</p>
          </div>
        </div>

        {/* LỚP 2: HIỂN THỊ ẢNH THẬT (Đè lên trên lớp dự phòng) */}
        <div className="absolute inset-0 w-full h-full bg-white transition-opacity duration-500">
          <img
              src={images[current].src}
              alt={images[current].label}
              // SỬA Ở ĐÂY: Dùng object-cover và bỏ p-2 để ảnh tràn viền
              className="w-full h-full object-cover"
              onError={(e) => {
                // Nếu ảnh lỗi (sai đường dẫn), ẩn thẻ img này đi để hiện lớp dự phòng bên dưới
                (e.target as HTMLImageElement).style.opacity = '0';
              }}
          />
        </div>

        {/* ĐÃ XÓA PHẦN LABEL TÊN CHỨNG CHỈ Ở ĐÂY */}

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, idx) => (
              <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'w-6 bg-[var(--erg-red)]' : 'bg-gray-300'}`}
              />
          ))}
        </div>
      </div>
  );
};

export default function NationalITPage() {
  return (
      <main className="min-h-screen">

        {/* 1. HERO SECTION */}
        <section className="relative bg-[var(--erg-blue)] text-white py-20 lg:py-28 overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-full h-full bg-[url('/pattern-grid.png')] opacity-5"></div>
          <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-yellow-500 opacity-10 blur-3xl"></div>

          <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
                <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/20 border border-yellow-400/30 text-sm font-semibold backdrop-blur-sm text-yellow-300">
                  ★ Chuẩn kỹ năng sử dụng CNTT theo Thông tư 03
                </span>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                CHUẨN HÓA KỸ NĂNG <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                    CÔNG NGHỆ THÔNG TIN
                  </span>
              </h1>
              <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                Đào tạo và cấp chứng chỉ Ứng dụng CNTT Cơ bản & Nâng cao. Điều kiện tiên quyết để tốt nghiệp Đại học và thi tuyển công chức, viên chức.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/lo-trinh" className="px-8 py-3.5 bg-[var(--erg-red)] hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20 flex items-center gap-2">
                  Xem Lộ Trình <ArrowRight size={18} />
                </Link>
                <Link href="/khoa-hoc" className="px-8 py-3.5 bg-white text-[var(--erg-blue)] hover:bg-blue-50 font-bold rounded-lg transition-all">
                  Khám Phá Khóa học
                </Link>
              </div>
            </div>

            {/* Carousel Ảnh Chứng Chỉ */}
            <div className="md:w-1/2 flex justify-center w-full">
              <NationalCertificateCarousel />
            </div>
          </div>
        </section>

        {/* 2. WHY CHOOSE US (Dựa trên bối cảnh Đại học/Trung tâm tin học) */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Award className="w-10 h-10 text-[var(--erg-red)]" />,
                  title: "Chứng Chỉ Quốc Gia",
                  desc: "Phôi bằng chuẩn của Bộ Giáo dục & Đào tạo, có giá trị vô thời hạn trên toàn quốc."
                },
                {
                  icon: <BookOpen className="w-10 h-10 text-[var(--erg-red)]" />,
                  title: "Giáo Trình Thực Tế",
                  desc: "Bám sát các mô đun (IU) quy định: Word, Excel, PowerPoint, Xử lý văn bản hành chính."
                },
                {
                  icon: <GraduationCap className="w-10 h-10 text-[var(--erg-red)]" />,
                  title: "Hỗ Trợ Tận Tình",
                  desc: "Ôn tập sát đề thi, hỗ trợ học viên từ khi đăng ký đến khi nhận chứng chỉ."
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

        {/* 3. ROADMAP SECTION */}
        {/* Component này nên hiển thị lộ trình: Chưa biết gì -> CNTT Cơ bản -> CNTT Nâng cao */}
        <RoadmapSection />

        {/* 4. MAIN COURSES (Dựa trên ảnh chụp màn hình) */}
        <section id="khoa-hoc" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-[var(--erg-blue)]">Chương Trình Đào Tạo</h2>
                <p className="text-gray-600 mt-2">Đáp ứng đầy đủ chuẩn đầu ra Tin học cho sinh viên và người đi làm</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* KHÓA HỌC 1: CNTT CƠ BẢN (Dựa trên ảnh 1 & 2) */}
              <div className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-500 flex flex-col h-full">
                <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  <div className="text-center text-white p-4">
                    <span className="block text-3xl font-bold mb-1">CƠ BẢN</span>
                    <span className="text-sm opacity-90">Basic IT Skills</span>
                  </div>
                  <div className="absolute bottom-0 right-0 p-4 opacity-20">
                    <FileText size={80} color="white" />
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">Mã lớp: THCB</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--erg-blue)] mb-2">Kỹ năng sử dụng CNTT Cơ Bản</h3>
                  <p className="text-gray-600 mb-4 text-sm">Dành cho người mới bắt đầu, trang bị kiến thức nền tảng về máy tính và tin học văn phòng.</p>

                  <div className="space-y-3 mb-6 border-t border-gray-100 pt-4 flex-1">
                    <p className="font-semibold text-sm text-gray-700">Nội dung (Mô đun IU01 - IU06):</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/>
                        <span><strong>Windows:</strong> Quản lý tập tin, thư mục (Explorer).</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/>
                        <span><strong>MS Word (IU03):</strong> Soạn thảo, định dạng văn bản, bảng biểu.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/>
                        <span><strong>MS Excel (IU04):</strong> Hàm chuỗi, ngày tháng, tính toán cơ bản.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/>
                        <span><strong>MS PowerPoint (IU05):</strong> Thiết kế slide, hiệu ứng trình chiếu.</span>
                      </li>
                    </ul>
                  </div>

                  <Link href="/cntt-co-ban" className="block w-full py-3 text-center rounded-lg border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all mt-auto">
                    Chi Tiết & Đăng Ký
                  </Link>
                </div>
              </div>

              {/* KHÓA HỌC 2: CNTT NÂNG CAO (Dựa trên ảnh 3, 4 & 5) */}
              <div className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-500 flex flex-col h-full">
                <div className="h-48 bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  <div className="text-center text-white p-4">
                    <span className="block text-3xl font-bold mb-1">NÂNG CAO</span>
                    <span className="text-sm opacity-90">Advanced IT Skills</span>
                  </div>
                  <div className="absolute bottom-0 right-0 p-4 opacity-20">
                    <Award size={80} color="white" />
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider">Mã lớp: THNC</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--erg-blue)] mb-2">Kỹ năng sử dụng CNTT Nâng Cao</h3>
                  <p className="text-gray-600 mb-4 text-sm">Chuyên sâu về văn phòng, xử lý dữ liệu phức tạp. Yêu cầu đã có kiến thức cơ bản.</p>

                  <div className="space-y-3 mb-6 border-t border-gray-100 pt-4 flex-1">
                    <p className="font-semibold text-sm text-gray-700">Nội dung (Mô đun IU07 - IU09):</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-purple-500 mt-0.5 flex-shrink-0"/>
                        <span><strong>Word Nâng cao (IU07):</strong> Trộn thư (Mail Merge), Mục lục tự động, Section break.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-purple-500 mt-0.5 flex-shrink-0"/>
                        <span><strong>Excel Nâng cao (IU08):</strong> PivotTable, VLOOKUP nâng cao, Công thức mảng, Bảo mật.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-purple-500 mt-0.5 flex-shrink-0"/>
                        <span><strong>PPT Nâng cao (IU09):</strong> Slide Master, Trigger, Chèn đa phương tiện.</span>
                      </li>
                    </ul>
                  </div>

                  <Link href="/cntt-nang-cao" className="block w-full py-3 text-center rounded-lg border-2 border-purple-600 text-purple-600 font-bold hover:bg-purple-600 hover:text-white transition-all mt-auto">
                    Chi Tiết & Đăng Ký
                  </Link>
                </div>
              </div>

              {/* KHÓA HỌC 3: LUYỆN THI CẤP TỐC / COMBO (Bổ sung cho đầy layout) */}
              <div className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-500 flex flex-col h-full">
                <div className="h-48 bg-gradient-to-br from-orange-500 to-red-400 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  <div className="text-center text-white p-4">
                    <span className="block text-3xl font-bold mb-1">LUYỆN THI</span>
                    <span className="text-sm opacity-90">Exam Preparation</span>
                  </div>
                  <div className="absolute bottom-0 right-0 p-4 opacity-20">
                    <CheckCircle2 size={80} color="white" />
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider">Cấp tốc</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--erg-blue)] mb-2">Ôn Thi & Cấp Chứng Chỉ</h3>
                  <p className="text-gray-600 mb-4 text-sm">Dành cho đối tượng đã có kiến thức, cần hệ thống hóa để thi lấy bằng nhanh chóng.</p>

                  <div className="space-y-3 mb-6 border-t border-gray-100 pt-4 flex-1">
                    <p className="font-semibold text-sm text-gray-700">Quyền lợi:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-orange-500 mt-0.5 flex-shrink-0"/>
                        <span>Làm quen với phần mềm thi trắc nghiệm & thực hành.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-orange-500 mt-0.5 flex-shrink-0"/>
                        <span>Giải đề thi mẫu các năm gần nhất.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-orange-500 mt-0.5 flex-shrink-0"/>
                        <span>Tỷ lệ đậu cao. Hỗ trợ đăng ký thi ngay tại trung tâm.</span>
                      </li>
                    </ul>
                  </div>

                  <Link href="/luyen-thi" className="block w-full py-3 text-center rounded-lg border-2 border-orange-500 text-orange-600 font-bold hover:bg-orange-500 hover:text-white transition-all mt-auto">
                    Đăng Ký Ôn Thi
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. CTA SECTION */}
        <section className="py-20 bg-[var(--erg-blue)] text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Bạn chưa biết nên bắt đầu từ đâu?</h2>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Đừng lo lắng! Hãy để lại thông tin, chúng tôi sẽ tư vấn lộ trình học và thi chứng chỉ phù hợp nhất với nhu cầu công việc của bạn.
            </p>
            <Link href="/lien-he" className="inline-block px-12 py-4 bg-[var(--erg-red)] text-white font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-red-900/30">
              Nhận Tư Vấn Miễn Phí
            </Link>
          </div>
        </section>
      </main>
  );
}