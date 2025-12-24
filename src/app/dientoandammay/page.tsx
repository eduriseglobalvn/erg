'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Server,
  Database,
  Globe,
  Cpu,
  ShieldCheck,
  Container,
  TrendingUp,
  DollarSign,
  Briefcase,
  Terminal
} from 'lucide-react';

// Đảm bảo bạn đã tạo file CloudRoadmap.tsx ở đường dẫn này
import CloudRoadmap from '@/components/dientoandammay/RoadmapSection';

// --- SUB-COMPONENT: CAROUSEL BANNER ---
const CloudCarousel = () => {
  const images = [
    { label: "Amazon Web Services (AWS)", sub: "Global Leader", icon: <Cloud size={64} className="text-orange-400"/>, color: "border-orange-500" },
    { label: "Microsoft Azure", sub: "Enterprise Grade", icon: <Server size={64} className="text-blue-400"/>, color: "border-blue-500" },
    { label: "DevOps Ecosystem", sub: "Docker & K8s", icon: <Container size={64} className="text-purple-400"/>, color: "border-purple-500" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
      <div className={`relative w-full max-w-md aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden border-4 border-white/10 bg-[#1e293b] group transition-colors duration-500 ${images[current].color}`}>
        {/* Nền giả lập Tech */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
          <div className="mb-6 p-6 rounded-full bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(56,189,248,0.2)] backdrop-blur-sm animate-pulse-slow">
            {images[current].icon}
          </div>
          <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">{images[current].label}</h3>
          <p className="text-slate-400 font-mono text-sm">{images[current].sub}</p>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_, idx) => (
              <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${current === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-600'}`}
              />
          ))}
        </div>
      </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function CloudComputingPage() {
  return (
      <main className="min-h-screen bg-white">

        {/* 1. HERO SECTION */}
        <section className="relative bg-[#0b1120] text-white py-24 lg:py-32 overflow-hidden">
          {/* Background Cyberpunk Effects */}
          <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-900/20 to-transparent pointer-events-none"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[url('/grid-pattern.png')] opacity-5 pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-16">

            {/* Cột trái: Nội dung Text */}
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-sm font-semibold text-cyan-400 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                Đào tạo thực chiến AWS & DevOps
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                Làm Chủ Hạ Tầng <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                    Điện Toán Đám Mây
                  </span>
              </h1>

              <p className="text-lg text-slate-400 max-w-xl leading-relaxed mx-auto lg:mx-0">
                Lộ trình từ <strong>Zero đến Hero</strong>. Trang bị kỹ năng triển khai, vận hành và bảo mật hệ thống trên nền tảng Cloud hàng đầu thế giới.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="#khoa-hoc" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:-translate-y-1">
                  Khám Phá Khóa Học <ArrowRight size={20} />
                </Link>
                <Link href="/tu-van" className="px-8 py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold rounded-xl transition-all backdrop-blur-sm">
                  Tư Vấn Lộ Trình
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Lab thực hành 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Chứng chỉ Quốc tế</span>
                </div>
              </div>
            </div>

            {/* Cột phải: Carousel Minh họa */}
            <div className="lg:w-1/2 flex justify-center w-full relative">
              <CloudCarousel />
              {/* Decor elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-3xl rounded-full"></div>
            </div>
          </div>
        </section>

        {/* 2. MARKET STATS SECTION */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                  <TrendingUp size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">35%</h4>
                  <p className="text-sm text-slate-500 font-medium">Tăng trưởng tuyển dụng/năm</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-green-50 rounded-lg text-green-600">
                  <DollarSign size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">$1,000+</h4>
                  <p className="text-sm text-slate-500 font-medium">Mức lương khởi điểm hấp dẫn</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                  <Briefcase size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">Top 3</h4>
                  <p className="text-sm text-slate-500 font-medium">Vị trí IT "hot" nhất 2024</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ROADMAP SECTION (Component tách riêng) */}
        <CloudRoadmap />

        {/* 4. MAIN COURSES */}
        <section id="khoa-hoc" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm bg-blue-50 px-3 py-1 rounded-full">Chương Trình Đào Tạo</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-4">
                Hệ Thống Khóa Học <span className="text-blue-600">Chuyên Sâu</span>
              </h2>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
                Thiết kế bài bản từ nền tảng đến chuyên gia, tập trung vào thực hành và giải quyết bài toán thực tế của doanh nghiệp.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Course 1: Cloud Foundation */}
              <div className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-orange-400 flex flex-col h-full">
                {/* Header Gradient thay vì ảnh để tránh lỗi */}
                <div className="h-56 bg-gradient-to-br from-orange-400 to-amber-500 relative flex items-center justify-center overflow-hidden flex-shrink-0">
                  <div className="text-center z-10">
                    <Cloud size={64} className="text-white mx-auto mb-2 drop-shadow-md" />
                    <span className="text-2xl font-black text-white tracking-widest uppercase">AWS / Azure</span>
                  </div>
                  <Cloud size={180} className="text-white opacity-10 absolute -bottom-10 -right-10 rotate-12" />
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Foundation
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-orange-500 transition-colors">Cloud Administrator</h3>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">Nhập môn điện toán đám mây. Vận hành máy chủ ảo (EC2), mạng VPC và quản trị người dùng IAM trên AWS/Azure.</p>

                  <div className="space-y-3 mb-8 pt-6 border-t border-slate-100 flex-1">
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="p-1.5 bg-orange-100 rounded text-orange-600"><Cloud size={14}/></div>
                      <span>Dịch vụ Core: EC2, S3, RDS</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="p-1.5 bg-orange-100 rounded text-orange-600"><ShieldCheck size={14}/></div>
                      <span>Bảo mật & Phân quyền IAM</span>
                    </div>
                  </div>

                  <Link href="/khoa-hoc/cloud-admin" className="block w-full py-3.5 text-center rounded-lg border-2 border-orange-500 text-orange-600 font-bold hover:bg-orange-500 hover:text-white transition-all mt-auto uppercase text-sm tracking-wide">
                    Xem Chi Tiết
                  </Link>
                </div>
              </div>

              {/* Course 2: DevOps Pro */}
              <div className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-500 flex flex-col h-full">
                <div className="h-56 bg-gradient-to-br from-blue-600 to-cyan-500 relative flex items-center justify-center overflow-hidden flex-shrink-0">
                  <div className="text-center z-10">
                    <Container size={64} className="text-white mx-auto mb-2 drop-shadow-md" />
                    <span className="text-2xl font-black text-white tracking-widest uppercase">DevOps</span>
                  </div>
                  <Container size={180} className="text-white opacity-10 absolute -bottom-10 -right-10 rotate-12" />
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Professional
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">DevOps Engineer</h3>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">Làm chủ công nghệ Container và quy trình phát triển phần mềm hiện đại CI/CD tự động hóa.</p>

                  <div className="space-y-3 mb-8 pt-6 border-t border-slate-100 flex-1">
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="p-1.5 bg-blue-100 rounded text-blue-600"><Container size={14}/></div>
                      <span>Docker & Kubernetes (K8s)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="p-1.5 bg-blue-100 rounded text-blue-600"><Cpu size={14}/></div>
                      <span>Jenkins, GitLab CI Pipeline</span>
                    </div>
                  </div>

                  <Link href="/khoa-hoc/devops-engineer" className="block w-full py-3.5 text-center rounded-lg border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all mt-auto uppercase text-sm tracking-wide">
                    Xem Chi Tiết
                  </Link>
                </div>
              </div>

              {/* Course 3: Solutions Architect */}
              <div className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-purple-500 flex flex-col h-full">
                <div className="h-56 bg-gradient-to-br from-purple-600 to-fuchsia-500 relative flex items-center justify-center overflow-hidden flex-shrink-0">
                  <div className="text-center z-10">
                    <Server size={64} className="text-white mx-auto mb-2 drop-shadow-md" />
                    <span className="text-2xl font-black text-white tracking-widest uppercase">Architect</span>
                  </div>
                  <Server size={180} className="text-white opacity-10 absolute -bottom-10 -right-10 rotate-12" />
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Expert
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors">Solutions Architect</h3>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">Tư duy thiết kế hệ thống phân tán, chịu tải cao (High Availability) và tối ưu chi phí hạ tầng doanh nghiệp.</p>

                  <div className="space-y-3 mb-8 pt-6 border-t border-slate-100 flex-1">
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="p-1.5 bg-purple-100 rounded text-purple-600"><Server size={14}/></div>
                      <span>Microservices Design Patterns</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="p-1.5 bg-purple-100 rounded text-purple-600"><Globe size={14}/></div>
                      <span>Terraform (IaC) & Security</span>
                    </div>
                  </div>

                  <Link href="/khoa-hoc/cloud-architect" className="block w-full py-3.5 text-center rounded-lg border-2 border-purple-500 text-purple-600 font-bold hover:bg-purple-500 hover:text-white transition-all mt-auto uppercase text-sm tracking-wide">
                    Xem Chi Tiết
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. CTA SECTION */}
        <section className="py-24 bg-[#0b1120] text-white text-center relative overflow-hidden">
          {/* Background decor */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Sẵn Sàng Triển Khai Sự Nghiệp?
            </h2>
            <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto">
              Thị trường đang khát nhân lực Cloud & DevOps chất lượng cao. <br className="hidden md:block"/>
              Đăng ký ngay hôm nay để nhận lộ trình học tập được cá nhân hóa và ưu đãi học phí.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/lien-he" className="px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1">
                Đăng Ký Tư Vấn Ngay
              </Link>
              <Link href="/lich-khai-giang" className="px-10 py-4 bg-transparent border border-slate-600 text-white font-bold text-lg rounded-xl hover:bg-white/5 transition-all">
                Xem Lịch Khai Giảng
              </Link>
            </div>
          </div>
        </section>
      </main>
  );
}