'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Bot, // Icon Robot cho AI
  BrainCircuit, // Icon não bộ/mạch điện
  BookOpen, // Icon sách
  Sparkles,
  Zap,
  Check,
  Cpu,
  GraduationCap
} from 'lucide-react';

// --- COMPONENT CAROUSEL CHO BANNER (Giữ nguyên hoặc thay ảnh AI nếu có) ---
const AiCarousel = () => {
  const images = [
    { src: "/util/ai-banner-1.jpg", label: "Khám phá thế giới AI" },
    { src: "/util/ai-banner-2.jpg", label: "Lập trình & Robot" },
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
        <div className="absolute inset-0 bg-[#fdfbf7] flex items-center justify-center border-[10px] border-indigo-900/10">
          <div className="text-center text-gray-500 p-8">
            <div className="mb-4 flex justify-center">
              <Bot size={64} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-serif font-bold text-indigo-900 uppercase mb-2">Học Cùng AI</h3>
            <p className="font-semibold text-gray-700">Kỷ nguyên trí tuệ nhân tạo</p>
          </div>
        </div>

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

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, idx) => (
              <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'w-6 bg-indigo-600' : 'bg-gray-300'}`}
              />
          ))}
        </div>
      </div>
  );
};

export default function AiLearningPage() {
  return (
      <main className="min-h-screen bg-gray-50">

        {/* 1. HERO SECTION */}
        <section className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 text-white py-20 lg:py-28 overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('/pattern-grid.png')] opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
                <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-sm font-semibold backdrop-blur-sm text-indigo-200">
                  <Sparkles size={14} className="text-yellow-300" /> Chương trình giáo dục tương lai
                </span>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                HỌC CÙNG AI <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                    KỸ NĂNG CỦA THỜI ĐẠI MỚI
                  </span>
              </h1>
              <p className="text-lg text-indigo-100 max-w-lg leading-relaxed">
                Trang bị kiến thức Trí tuệ nhân tạo (AI) bài bản cho học sinh phổ thông. Phát triển tư duy máy tính và kỹ năng số thông qua bộ sách chuẩn từ Lớp 1 đến Lớp 12.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="#chuong-trinh" className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-900/40 flex items-center gap-2">
                  Khám Phá Ngay <ArrowRight size={18} />
                </Link>
                <Link href="/tu-van" className="px-8 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-bold rounded-lg transition-all">
                  Tư Vấn Lộ Trình
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center w-full">
              <AiCarousel />
            </div>
          </div>
        </section>

        {/* 2. WHY CHOOSE AI */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">Tại Sao Nên Cho Trẻ Học AI Sớm?</h2>
              <p className="text-gray-600 mt-2">AI không chỉ là công nghệ, đó là tư duy giải quyết vấn đề mới</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BrainCircuit className="w-10 h-10 text-purple-600" />,
                  title: "Tư Duy Máy Tính",
                  desc: "Hiểu cách máy móc học và xử lý thông tin. Rèn luyện logic và khả năng phân tích dữ liệu từ nhỏ."
                },
                {
                  icon: <Bot className="w-10 h-10 text-indigo-600" />,
                  title: "Làm Chủ Công Nghệ",
                  desc: "Không chỉ là người sử dụng thụ động, trẻ trở thành người kiến tạo, biết cách điều khiển và tương tác với AI."
                },
                {
                  icon: <GraduationCap className="w-10 h-10 text-blue-600" />,
                  title: "Lộ Trình Xuyên Suốt",
                  desc: "Chương trình bài bản từ Lớp 1 đến Lớp 12, đảm bảo kiến thức liền mạch và phù hợp tâm lý lứa tuổi."
                }
              ].map((item, i) => (
                  <div key={i} className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white group">
                    <div className="mb-4 bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. CHƯƠNG TRÌNH ĐÀO TẠO (SINGLE PROGRAM) */}
        <section id="chuong-trinh" className="py-20 bg-indigo-50/50 overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Header Title */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                CHƯƠNG TRÌNH ĐÀO TẠO
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Chúng tôi tiên phong mang đến chương trình giáo dục AI toàn diện, sử dụng bộ sách giáo khoa chuẩn mực để đảm bảo chất lượng giảng dạy tốt nhất.
              </p>
            </div>

            {/* SINGLE FEATURED CARD */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-indigo-100 shadow-2xl shadow-indigo-100/50 relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-bl-full opacity-60 -z-0"></div>

                {/* Left Side: Info & Steps */}
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-indigo-600 text-white p-2.5 rounded-lg shadow-lg shadow-indigo-200">
                        <Bot size={28} />
                    </span>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-800">Học Cùng AI</h3>
                      <span className="text-indigo-600 font-bold text-sm tracking-wider uppercase">Bộ sách từ Lớp 1 - 12</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Chương trình đào tạo chính quy dựa trên bộ sách <strong>"Học cùng AI"</strong> (NXB Giáo dục Việt Nam). Giúp học sinh tiếp cận Trí tuệ nhân tạo một cách hệ thống, khoa học và đầy hứng thú.
                  </p>

                  {/* Feature List / Timeline */}
                  <div className="space-y-6">
                    {/* Feature 1 */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold border-2 border-indigo-200">1</div>
                        <div className="w-0.5 h-full bg-indigo-100 my-2"></div>
                      </div>
                      <div className="pb-2">
                        <h4 className="text-lg font-bold text-gray-800">Khởi động (Tiểu học)</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Làm quen với robot, nhận diện giọng nói, hình ảnh. Học qua các trò chơi tương tác thú vị cùng nhân vật mèo máy thông minh.
                        </p>
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold border-2 border-indigo-200">2</div>
                        <div className="w-0.5 h-full bg-indigo-100 my-2"></div>
                      </div>
                      <div className="pb-2">
                        <h4 className="text-lg font-bold text-gray-800">Tăng tốc (THCS)</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Hiểu các khái niệm cốt lõi: Dữ liệu lớn (Big Data), Máy học (Machine Learning). Bắt đầu lập trình các ứng dụng AI đơn giản.
                        </p>
                      </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg">3</div>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">Về đích (THPT)</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Chuyên sâu về thuật toán, Đạo đức AI và ứng dụng vào thực tế xã hội. Sẵn sàng cho bậc Đại học và nghề nghiệp tương lai.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <Link href="/khoa-hoc/hoc-cung-ai" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-xl shadow-indigo-600/30 hover:-translate-y-1">
                      Xem Chi Tiết Chương Trình <ArrowRight size={20} />
                    </Link>
                    <p className="mt-4 text-sm text-gray-500 italic">
                      * Chương trình được cập nhật liên tục theo xu hướng công nghệ mới nhất.
                    </p>
                  </div>
                </div>

                {/* Right Side: Image Visualization (Placeholder for Book Cover style) */}
                <div className="md:w-5/12 flex flex-col items-center justify-center relative">
                  {/* Background Blob */}
                  <div className="absolute w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-20 top-10"></div>

                  {/* Simulated Book/Card Look */}
                  <div className="relative w-full aspect-[3/4] max-w-sm bg-gradient-to-b from-blue-400 to-indigo-600 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center text-white border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="w-full flex justify-between items-center mb-8 opacity-80">
                      <Cpu size={24} />
                      <span className="text-xs font-bold uppercase border border-white/30 px-2 py-1 rounded">NXB Giáo Dục</span>
                    </div>

                    <h3 className="text-4xl font-extrabold mb-2 font-serif tracking-tight drop-shadow-md">
                      HỌC CÙNG <span className="text-yellow-300 text-5xl">AI</span>
                    </h3>
                    <div className="my-6">
                      {/* Icon thay thế cho hình ảnh con mèo/robot trong bìa sách */}
                      <Bot size={120} className="text-white drop-shadow-lg" />
                    </div>

                    <div className="mt-auto w-full">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <p className="font-bold text-sm">Dành cho học sinh phổ thông</p>
                        <div className="flex justify-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                              <div key={i} className="w-2 h-2 rounded-full bg-yellow-400"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Note footer */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 text-indigo-800 bg-indigo-50 px-6 py-3 rounded-full border border-indigo-100 shadow-sm text-sm font-medium">
                <Check size={18} className="text-green-500" />
                <span>Chương trình duy nhất kết hợp giữa <strong>Công nghệ</strong> và <strong>Giáo dục Chính quy</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CTA SECTION */}
        <section className="py-20 bg-indigo-900 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Bạn muốn con mình làm chủ công nghệ tương lai?</h2>
            <p className="text-indigo-200 mb-8 text-lg max-w-2xl mx-auto">
              Đừng để trẻ tụt hậu trong kỷ nguyên số. Hãy đăng ký ngay để nhận tư vấn lộ trình học tập phù hợp nhất với độ tuổi của bé.
            </p>
            <Link href="/lien-he" className="inline-block px-12 py-4 bg-yellow-500 text-indigo-900 font-bold rounded-full text-lg hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg shadow-yellow-500/20">
              Đăng Ký Tư Vấn Ngay
            </Link>
          </div>
        </section>
      </main>
  );
}