'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Gamepad2,
  Monitor,
  Smile,
  Palette,
  Terminal,
  Sparkles,
  Zap,
  Check
} from 'lucide-react';

// --- COMPONENT CAROUSEL CHO BANNER ---
const KidsCodingCarousel = () => {
  const images = [
    { src: "/util/scratch-banner.jpg", label: "Lập trình Scratch (Tiểu học)" },
    { src: "/util/python-banner.jpg", label: "Lập trình Python (THCS)" },
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
        {/* LỚP 1: Khung giả lập làm nền dự phòng */}
        <div className="absolute inset-0 bg-[#fdfbf7] flex items-center justify-center border-[10px] border-[#8B0000]/10">
          <div className="text-center text-gray-500 p-8">
            <div className="mb-4 flex justify-center">
              <Gamepad2 size={64} className="text-[#DAA520]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#8B0000] uppercase mb-2">Lập trình Thiếu Nhi</h3>
            <p className="font-semibold text-gray-700">{images[current].label}</p>
          </div>
        </div>

        {/* LỚP 2: HIỂN THỊ ẢNH THẬT */}
        <div className="absolute inset-0 w-full h-full bg-white transition-opacity duration-500">
          <img
              src={images[current].src}
              alt={images[current].label}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = '0';
              }}
          />
        </div>

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

export default function KidsCodingPage() {
  return (
      <main className="min-h-screen">

        {/* 1. HERO SECTION */}
        <section className="relative bg-[var(--erg-blue)] text-white py-20 lg:py-28 overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('/pattern-grid.png')] opacity-5"></div>
          <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-yellow-500 opacity-10 blur-3xl"></div>

          <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
                <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/20 border border-yellow-400/30 text-sm font-semibold backdrop-blur-sm text-yellow-300">
                  ★ Khóa học tiêu chuẩn cho trẻ 6 - 15 tuổi
                </span>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                KHƠI DẬY ĐAM MÊ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                    CÔNG NGHỆ TƯƠNG LAI
                  </span>
              </h1>
              <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                Trang bị tư duy máy tính, logic và kỹ năng giải quyết vấn đề thông qua Lập trình Scratch & Python. Bước đệm vững chắc để trở thành công dân số toàn cầu.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/khoa-hoc" className="px-8 py-3.5 bg-[var(--erg-red)] hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20 flex items-center gap-2">
                  Xem Chương Trình <ArrowRight size={18} />
                </Link>
                <Link href="/tu-van" className="px-8 py-3.5 bg-white text-[var(--erg-blue)] hover:bg-blue-50 font-bold rounded-lg transition-all">
                  Tư Vấn Miễn Phí
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center w-full">
              <KidsCodingCarousel />
            </div>
          </div>
        </section>

        {/* 2. WHY CHOOSE US */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[var(--erg-blue)]">Trẻ Em Sẽ Học Được Gì?</h2>
              <p className="text-gray-600 mt-2">Phát triển toàn diện từ tư duy đến kỹ năng mềm</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Monitor className="w-10 h-10 text-[var(--erg-red)]" />,
                  title: "Tư Duy Máy Tính",
                  desc: "Rèn luyện tính kiên trì, cẩn thận. Phát triển tư duy logic và cách diễn đạt ý tưởng chặt chẽ."
                },
                {
                  icon: <Award className="w-10 h-10 text-[var(--erg-red)]" />,
                  title: "Sáng Tạo & Độc Lập",
                  desc: "Tự do sáng tạo trò chơi riêng. Hình thành tính tự giác giải quyết công việc chưa hoàn thành."
                },
                {
                  icon: <Smile className="w-10 h-10 text-[var(--erg-red)]" />,
                  title: "Kỹ Năng Mềm",
                  desc: "Biết phân chia, phối hợp làm việc nhóm. Rèn luyện kỹ năng thuyết trình, giải thích mạch lạc."
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

        {/* 3. CHƯƠNG TRÌNH ĐÀO TẠO (Đã thay thế Roadmap bằng giao diện 2 cột) */}
        <section id="khoa-hoc" className="py-20 bg-gray-50 overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Header Title */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)] mb-4">
                CHƯƠNG TRÌNH ĐÀO TẠO
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Hai hướng tiếp cận công nghệ hoàn toàn độc lập dành cho học sinh Tiểu học & THCS.
                Tùy thuộc vào sở thích của bé (thích vẽ/sáng tạo hay thích toán/logic), ba mẹ hãy chọn chương trình phù hợp nhất.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

              {/* --- CỘT 1: SCRATCH (SÁNG TẠO) --- */}
              <div className="bg-white rounded-3xl p-8 border-2 border-orange-100 shadow-xl shadow-orange-100/50 hover:border-orange-300 transition-all duration-300 relative overflow-hidden group h-full flex flex-col">

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50 rounded-bl-full opacity-60 -z-0"></div>

                {/* Header Track */}
                <div className="relative z-10 mb-8">
                  <div className="flex items-center gap-3 mb-2">
                                <span className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                                    <Palette size={24} />
                                </span>
                    <h3 className="text-2xl font-bold text-gray-800">Lộ trình Sáng Tạo (Scratch)</h3>
                  </div>
                  <p className="text-gray-500 font-medium">Phù hợp với trẻ thích hình ảnh, âm thanh, vẽ tranh & kể chuyện.</p>
                </div>

                {/* Steps Container */}
                <div className="space-y-8 relative z-10 flex-grow">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-200 flex-shrink-0">1</div>
                      <div className="w-0.5 h-full bg-orange-200 my-2"></div>
                    </div>
                    <div className="pb-2">
                      <h4 className="text-lg font-bold text-orange-700">Học tư duy Kéo - Thả</h4>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        Làm quen với các khối lệnh màu sắc. Bé không cần gõ phím, chỉ cần lắp ghép ý tưởng như chơi Lego.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-orange-500 text-orange-500 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-orange-700">Tự làm Game & Phim</h4>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        Kết quả: Bé tự tạo được trò chơi, thiệp điện tử, phim hoạt hình để khoe với gia đình và bạn bè.
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                        <Sparkles size={14} /> Phát triển trí tưởng tượng
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-10 pt-6 border-t border-orange-100 text-center relative z-10">
                  <Link href="/khoa-hoc/lap-trinh-scratch" className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
                    Chi tiết chương trình Scratch <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              {/* --- CỘT 2: PYTHON (LOGIC) --- */}
              <div className="bg-white rounded-3xl p-8 border-2 border-blue-100 shadow-xl shadow-blue-100/50 hover:border-blue-300 transition-all duration-300 relative overflow-hidden group h-full flex flex-col">

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-full opacity-60 -z-0"></div>

                {/* Header Track */}
                <div className="relative z-10 mb-8">
                  <div className="flex items-center gap-3 mb-2">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                    <Terminal size={24} />
                                </span>
                    <h3 className="text-2xl font-bold text-gray-800">Lộ trình Tư Duy (Python)</h3>
                  </div>
                  <p className="text-gray-500 font-medium">Phù hợp với trẻ thích toán học, giải đố, tò mò về cách máy tính hoạt động.</p>
                </div>

                {/* Steps Container */}
                <div className="space-y-8 relative z-10 flex-grow">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200 flex-shrink-0">1</div>
                      <div className="w-0.5 h-full bg-blue-200 my-2"></div>
                    </div>
                    <div className="pb-2">
                      <h4 className="text-lg font-bold text-blue-700">Lập trình dòng lệnh</h4>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        Tiếp cận ngôn ngữ lập trình thực tế số 1 thế giới. Học cú pháp, biến, vòng lặp chuẩn kỹ sư công nghệ.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-600 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-blue-700">Giải quyết vấn đề</h4>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        Kết quả: Viết chương trình giải toán, xử lý dữ liệu, làm game trí tuệ. Nền tảng cho AI và Khoa học dữ liệu.
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                        <Zap size={14} /> Phát triển tư duy Logic
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-10 pt-6 border-t border-blue-100 text-center relative z-10">
                  <Link href="/khoa-hoc/lap-trinh-python-thieu-nhi" className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
                    Chi tiết chương trình Python <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

            </div>

            {/* Note footer */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 text-gray-600 bg-white px-6 py-3 rounded-full border border-gray-200 shadow-sm text-sm font-medium">
                <Check size={18} className="text-green-500" />
                <span>Cả hai chương trình đều được thiết kế chuẩn sư phạm cho học sinh <strong>Tiểu học & Trung học Cơ sở</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CTA SECTION */}
        <section className="py-20 bg-[var(--erg-blue)] text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Đầu tư cho tương lai của con ngay hôm nay</h2>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Để lại thông tin để được tư vấn lộ trình học lập trình phù hợp nhất với độ tuổi và năng lực của bé.
            </p>
            <Link href="/lien-he" className="inline-block px-12 py-4 bg-[var(--erg-red)] text-white font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-red-900/30">
              Đăng Ký Học Thử
            </Link>
          </div>
        </section>
      </main>
  );
}