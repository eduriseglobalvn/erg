'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  Search, MapPin, DollarSign, Clock,
  ArrowRight, Heart, Zap, GraduationCap, Building,
  ChevronLeft, ChevronRight, CheckCircle2,
  Users, FileText, MonitorPlay, Trophy,
  Flame, Sparkles, Handshake, FileSearch
} from 'lucide-react';
import { JOB_LISTINGS } from '@/mocks/jobs.mock';
import { JobStatusType } from '@/mocks/types'; // Import type nếu cần, hoặc dùng string

// --- CẤU HÌNH GIAO DIỆN THEO TRẠNG THÁI ---
// Hàm này chỉ lo việc hiển thị (Màu sắc, Icon) dựa trên status có sẵn
const getStatusConfig = (status: JobStatusType) => {
  switch (status) {
    case 'hot':
      return {
        color: 'bg-red-50 text-red-600 border border-red-100',
        icon: <Flame size={18} fill="currentColor" />,
        label: 'Đang rất Hot'
      };
    case 'new':
      return {
        color: 'bg-green-50 text-green-600 border border-green-100',
        icon: <Sparkles size={18} />,
        label: 'Mới cập nhật'
      };
    case 'urgent':
      return {
        color: 'bg-blue-50 text-blue-600 border border-blue-100',
        icon: <Zap size={18} fill="currentColor"/>,
        label: 'Tuyển gấp'
      };
    case 'expired':
      return {
        color: 'bg-gray-100 text-gray-400 border border-gray-200',
        icon: <Clock size={18} />,
        label: 'Đã hết hạn'
      };
    default:
      // Fallback cho trạng thái 'normal' hoặc undefined
      return {
        color: 'bg-gray-50 text-gray-500 border border-gray-100',
        icon: <Building size={18} />,
        label: 'Đang tuyển'
      };
  }
};

export default function RecruitmentHomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
      <main className="min-h-screen bg-white pb-20 font-sans text-slate-800">

        {/* --- 1. HERO SECTION --- */}
        <section className="relative bg-[#00008b] text-white py-24 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#cc0022]/30 rounded-full -ml-10 -mb-10 blur-3xl"></div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block py-1 px-4 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-yellow-400 mb-6 backdrop-blur-sm animate-fade-in">
              Tuyển dụng Giáo dục & CNTT
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Kiến Tạo <span className="text-[#cc0022] bg-white px-3 rounded-lg inline-block transform -rotate-2">Tương Lai Số</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 font-light">
              Gia nhập ERG để cùng mang chuẩn Tin học Quốc tế đến hàng triệu học sinh Việt Nam.
            </p>

            <div className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-2xl flex items-center transform hover:scale-[1.02] transition-transform duration-300">
              <Search className="ml-5 text-gray-400 shrink-0" size={24}/>
              <input
                  type="text"
                  placeholder="Nhập vị trí (VD: Giáo viên tin học, IT...)"
                  className="flex-1 px-4 py-4 bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-lg"
              />
              <button className="bg-[#cc0022] hover:bg-red-700 text-white rounded-full px-10 py-4 font-bold transition-all shrink-0 hidden md:block shadow-lg shadow-red-200">
                Tìm kiếm
              </button>
            </div>
          </div>
        </section>

        {/* --- 2. STATS SECTION --- */}
        <section className="py-12 bg-blue-50 border-b border-blue-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-200/50">
              <div>
                <div className="text-4xl font-black text-[#00008b] mb-1">5+</div>
                <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Chi nhánh</div>
              </div>
              <div>
                <div className="text-4xl font-black text-[#00008b] mb-1">20.000+</div>
                <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Học viên</div>
              </div>
              <div>
                <div className="text-4xl font-black text-[#00008b] mb-1">50+</div>
                <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Đối tác trường học</div>
              </div>
              <div>
                <div className="text-4xl font-black text-[#00008b] mb-1">100%</div>
                <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Giáo viên đạt chuẩn</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. HORIZONTAL SCROLL JOBS --- */}
        {/* --- 3. HORIZONTAL SCROLL JOBS --- */}
        <section className="container mx-auto px-4 py-20 relative">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-1 bg-[#cc0022]"></span>
              <span className="text-[#cc0022] font-bold text-sm uppercase tracking-wider">Cơ hội nghề nghiệp</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#00008b]">Việc làm mới nhất</h2>
          </div>

          {/* Wrapper: relative để làm mốc cho nút bấm */}
          <div className="relative group">

            {/* --- NÚT PREV (TRÁI) --- */}
            {/* SỬA LỖI LỆCH: Thêm -mt-6 để bù cho pb-12, nút sẽ nằm chính giữa Card */}
            <button
                onClick={() => scroll('left')}
                className="absolute top-1/2 -translate-y-1/2 -mt-6 -left-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#00008b] hover:text-white hover:border-[#00008b] transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex"
            >
              <ChevronLeft size={24}/>
            </button>

            {/* --- NÚT NEXT (PHẢI) --- */}
            {/* SỬA LỖI LỆCH: Thêm -mt-6 */}
            <button
                onClick={() => scroll('right')}
                className="absolute top-1/2 -translate-y-1/2 -mt-6 -right-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#00008b] hover:text-white hover:border-[#00008b] transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex"
            >
              <ChevronRight size={24}/>
            </button>

            {/* --- CONTAINER DANH SÁCH --- */}
            <div ref={scrollContainerRef} className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scroll-smooth no-scrollbar p-2">
              {JOB_LISTINGS.map((job) => {
                const statusConfig = getStatusConfig(job.status);

                return (
                    <div key={job.id} className="min-w-[320px] md:min-w-[400px] bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-100 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-300 flex flex-col snap-start relative group/card">
                      <div className="flex justify-between items-start mb-6">
                        <span className="bg-blue-50 text-[#00008b] text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-100">
                           {job.slug.includes('it') ? 'Technical' : 'Education'}
                        </span>

                        {/* Status Icon */}
                        <div className={`group/icon relative`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-help transition-transform hover:scale-110 ${statusConfig.color}`}>
                            {statusConfig.icon}
                          </div>
                          <div className="absolute -top-10 right-0 z-50 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded shadow-lg whitespace-nowrap relative">
                              {statusConfig.label}
                              <div className="absolute -bottom-1 right-3 w-2 h-2 bg-slate-800 rotate-45"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 h-[3.5rem] group-hover/card:text-[#00008b] transition-colors">
                        {job.title}
                      </h3>

                      <div className="space-y-3 mb-8 border-t border-gray-50 pt-4">
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin size={18} className="text-gray-400 mr-3 shrink-0"/>
                          <span className="truncate font-medium">{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <DollarSign size={18} className="text-gray-400 mr-3 shrink-0"/>
                          <span className="font-medium">{job.salary}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock size={18} className="text-gray-400 mr-3 shrink-0"/>
                          <span className="font-medium text-[#cc0022]">Hạn: {job.deadline}</span>
                        </div>
                      </div>

                      <Link href={`/tuyen-dung/${job.slug}`} className="mt-auto w-full py-3.5 rounded-xl border-2 border-gray-100 text-gray-600 font-bold text-center group-hover/card:bg-[#00008b] group-hover/card:border-[#00008b] group-hover/card:text-white transition-all flex items-center justify-center gap-2">
                        Ứng tuyển ngay <ArrowRight size={18}/>
                      </Link>
                    </div>
                );
              })}

              {/* Card Xem tất cả */}
              <div className="min-w-[200px] flex items-center justify-center snap-start">
                <Link href="/tuyen-dung/tat-ca" className="group flex flex-col items-center text-gray-400 hover:text-[#cc0022] transition-colors">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 group-hover:border-[#cc0022] transition-colors bg-gray-50 hover:bg-white">
                    <ArrowRight size={32}/>
                  </div>
                  <span className="font-bold text-lg">Xem tất cả</span>
                </Link>
              </div>
            </div>

          </div>
        </section>
        {/* --- 4. HIRING PROCESS (ĐÚNG 6 BƯỚC) --- */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-[#cc0022] font-bold text-sm uppercase tracking-wider">Hành trình gia nhập</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#00008b] mt-2">Lộ trình gia nhập Edurise Global</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8">
              {[
                {
                  icon: <FileText size={28}/>, step: "Bước 1", title: "Ứng tuyển",
                  desc: "Ứng viên tìm hiểu vị trí tuyển dụng và gửi hồ sơ (CV) bao gồm thông tin cá nhân, quá trình học tập."
                },
                {
                  icon: <FileSearch size={28}/>, step: "Bước 2", title: "Sàng lọc hồ sơ",
                  desc: "Bộ phận Tuyển dụng chọn những ứng viên có thông tin gần với yêu cầu của vị trí cần tuyển."
                },
                {
                  icon: <MonitorPlay size={28}/>, step: "Bước 3", title: "Kiểm tra năng lực",
                  desc: "Đánh giá tư duy logic (IQ), khả năng sư phạm và kiến thức chuyên môn CNTT (Word, Excel...)."
                },
                {
                  icon: <Users size={28}/>, step: "Bước 4", title: "Phỏng vấn",
                  desc: "Gặp gỡ trực tiếp để đánh giá mức độ phù hợp về văn hóa, thái độ và kỹ năng giải quyết vấn đề."
                },
                {
                  icon: <Handshake size={28}/>, step: "Bước 5", title: "Thỏa thuận hợp đồng",
                  desc: "Trao đổi chi tiết về loại hợp đồng, mức lương, phụ cấp và các chế độ phúc lợi khác."
                },
                {
                  icon: <CheckCircle2 size={28}/>, step: "Bước 6", title: "Hoàn thiện hồ sơ",
                  desc: "Nộp các giấy tờ cần thiết (Sơ yếu lý lịch, Bằng cấp, Giấy khám sức khỏe...) để chính thức gia nhập."
                }
              ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <div className="shrink-0">
                      <div className="w-14 h-14 bg-blue-50 text-[#00008b] rounded-full flex items-center justify-center group-hover:bg-[#cc0022] group-hover:text-white transition-colors">
                        {item.icon}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#cc0022] uppercase mb-1 block">{item.step}</span>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 5. CULTURE & BENEFITS --- */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2">
                {/* Container ảnh */}
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4 items-center">
                    {/* Ảnh 1 */}
                    <div className="h-64 rounded-2xl w-full overflow-hidden shadow-lg transform translate-y-8">
                      <img
                          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                          alt="Lớp học ERG"
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    {/* Ảnh 2 */}
                    <div className="h-64 rounded-2xl w-full overflow-hidden shadow-lg transform -translate-y-8">
                      <img
                          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                          alt="Team ERG"
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>

                  {/* SỬA LỖI: Card Top Employer */}
                  {/* Chỉ giữ absolute top-1/2 left-1/2, việc căn giữa (-50%) giao cho animation lo */}
                  <div className="absolute top-1/2 left-1/2 z-20 w-max animate-bounce-slow">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 text-center">
                      <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-2"/>
                      <div className="font-bold text-gray-800">Top Employer</div>
                      <div className="text-xs text-gray-500">In Education Tech</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <span className="text-[#cc0022] font-bold text-sm uppercase tracking-wider">Tại sao chọn ERG?</span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#00008b] mt-2 mb-6">Môi trường tôn trọng & <br/>Phát triển không giới hạn</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Tại Edurise Global, chúng tôi không chỉ tìm kiếm nhân viên, chúng tôi tìm kiếm những người đồng hành cùng kiến tạo giá trị cho cộng đồng.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: <Heart className="text-[#cc0022]"/>, title: "Phúc Lợi Toàn Diện", sub: "BHXH, Thưởng lễ tết, Du lịch" },
                    { icon: <GraduationCap className="text-blue-500"/>, title: "Đào Tạo Chuyên Sâu", sub: "Tài trợ thi chứng chỉ Quốc tế" },
                    { icon: <Zap className="text-yellow-500"/>, title: "Văn Hóa Mở", sub: "Sếp lắng nghe, đồng nghiệp sẻ chia" },
                    { icon: <Building className="text-green-500"/>, title: "Tiện Nghi", sub: "Laptop, PC cấu hình cao" }
                  ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center shrink-0 text-xl">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{item.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{item.sub}</p>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 6. CTA FOOTER --- */}
        <div className="container mx-auto px-4 mt-8 mb-12">
          <div className="bg-[#00008b] rounded-3xl p-10 md:p-20 text-center text-white relative overflow-hidden group">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Bạn đã sẵn sàng?</h2>
              <p className="text-blue-100 mb-10 text-lg">
                Nếu bạn chưa tìm thấy vị trí phù hợp, đừng ngần ngại gửi CV cho chúng tôi để được lưu vào hồ sơ nhân tài.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="#" className="inline-block bg-[#cc0022] px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/50 transition-all">
                  Gửi CV Ngay
                </Link>
                <Link href="#" className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#00008b] transition-all">
                  Chat Zalo HR
                </Link>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes bounce-slow {
            0%, 100% { transform: translate(-50%, -50%); }
            50% { transform: translate(-50%, -60%); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite;
          }
        `}</style>
      </main>
  );
}