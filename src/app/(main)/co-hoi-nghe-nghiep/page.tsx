'use client';

import React, { useState } from 'react';
import {
  Briefcase, CheckCircle, Users, Award, Heart,
  FileText, UserCheck, MessageSquare,
  FileSignature, FolderCheck, ArrowRight, Lightbulb, Zap
} from 'lucide-react';

// --- DATA ---

// 1. Dữ liệu Đào tạo (Content từ file DOCX Edurise)
const trainingPrograms = [
  {
    title: 'Đào tạo Tân binh',
    desc: '100% nhân viên mới được tham gia khóa học định hướng, làm quen văn hóa Edurise Global và quy trình làm việc.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop'
  },
  {
    title: 'Nâng cao năng lực Công nghệ',
    desc: 'Cập nhật kiến thức CNTT mới, hỗ trợ thi các chứng chỉ quốc tế (IC3, MOS, IC3 Spark) để phục vụ giảng dạy.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop'
  },
  {
    title: 'Kỹ năng Sư phạm & Quản lý',
    desc: 'Bồi dưỡng phương pháp truyền đạt dễ hiểu, kỹ năng quản lý lớp học và tạo động lực học tập cho học sinh[cite: 53, 54].',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop'
  },
  {
    title: 'Đội ngũ Kế cận',
    desc: 'Ưu tiên nguồn lực nội bộ để đào tạo thành cán bộ quản lý, tổ trưởng chuyên môn hoặc chuyên gia nòng cốt.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop'
  }
];

// 2. Dữ liệu Quy trình tuyển dụng (Giữ nguyên như bạn đã duyệt)
const recruitmentProcess = [
  {
    step: 1,
    title: "Ứng tuyển",
    desc: "Ứng viên tìm hiểu vị trí tuyển dụng và gửi hồ sơ (CV) bao gồm thông tin cá nhân, quá trình học tập, kinh nghiệm.",
    detail: "Gửi qua hệ thống hoặc email tuyển dụng chính thức.",
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop"
  },
  {
    step: 2,
    title: "Sàng lọc hồ sơ",
    desc: "Bộ phận Tuyển dụng chọn những ứng viên có thông tin gần với yêu cầu của vị trí cần tuyển.",
    detail: "Hồ sơ phù hợp sẽ được mời tham gia vòng kiểm tra.",
    img: "https://images.unsplash.com/photo-1554774853-719586f8c277?q=80&w=1000&auto=format&fit=crop"
  },
  {
    step: 3,
    title: "Kiểm tra năng lực",
    desc: "Đánh giá tư duy logic (IQ), khả năng sư phạm và kiến thức chuyên môn CNTT (Word, Excel, Code...)[cite: 27].",
    detail: "Hình thức: Online hoặc trực tiếp.",
    img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop"
  },
  {
    step: 4,
    title: "Phỏng vấn",
    desc: "Gặp gỡ trực tiếp để đánh giá mức độ phù hợp về văn hóa, thái độ và kỹ năng giải quyết vấn đề.",
    detail: "Kết quả thông báo trong vòng 10 ngày.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
  },
  {
    step: 5,
    title: "Thỏa thuận hợp đồng",
    desc: "Trao đổi chi tiết về loại hợp đồng, mức lương, phụ cấp và các chế độ phúc lợi khác[cite: 4].",
    detail: "Giải đáp mọi thắc mắc về quyền lợi.",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop"
  },
  {
    step: 6,
    title: "Hoàn thiện hồ sơ",
    desc: "Nộp các giấy tờ cần thiết (Sơ yếu lý lịch, Bằng cấp, Giấy khám sức khỏe...) để chính thức gia nhập.",
    detail: "Chào đón thành viên mới của Edurise Global.",
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function CareerPage() {
  const [activeTab, setActiveTab] = useState<'policy' | 'process'>('process');

  return (
      <div className="min-h-screen bg-white font-sans text-gray-800">

        {/* --- HERO SECTION --- */}
        <section className="relative h-[450px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop"
                alt="Edurise Background"
                className="w-full h-full object-cover brightness-[0.35]"
            />
          </div>

          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-wide">
              TUYỂN DỤNG EDURISE GLOBAL
            </h1>
            <p className="text-xl mb-10 font-light text-gray-200">
              "Kiến tạo tương lai - Dẫn dắt công nghệ"
            </p>

            {/* NÚT CTA DUY NHẤT (Theo yêu cầu) */}
            <a
                href="https://tuyendung.erg.edu.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center bg-[#cc0022] hover:bg-red-700 text-white text-lg font-bold py-4 px-12 rounded shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
            <span className="relative z-10 flex items-center">
              TÌM VIỆC LÀM TẠI EDURISE <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
              <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </a>
          </div>
        </section>

        {/* --- TAB NAVIGATION (Style giống FPT: Smooth & Clean) --- */}
        <section className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-10">
              <button
                  onClick={() => setActiveTab('policy')}
                  className={`relative py-5 text-lg font-medium transition-colors duration-300 ${
                      activeTab === 'policy' ? 'text-[#cc0022]' : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                Chính sách cho người lao động
                {/* Animated Underline */}
                <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#cc0022] transition-transform duration-300 origin-left ${
                    activeTab === 'policy' ? 'scale-x-100' : 'scale-x-0'
                }`}></span>
              </button>

              <button
                  onClick={() => setActiveTab('process')}
                  className={`relative py-5 text-lg font-medium transition-colors duration-300 ${
                      activeTab === 'process' ? 'text-[#cc0022]' : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                Quy trình tuyển dụng
                {/* Animated Underline */}
                <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#cc0022] transition-transform duration-300 origin-left ${
                    activeTab === 'process' ? 'scale-x-100' : 'scale-x-0'
                }`}></span>
              </button>
            </div>
          </div>
        </section>

        {/* --- CONTENT AREA --- */}
        <div className="min-h-[600px] bg-gray-50">

          {/* === TAB 1: CHÍNH SÁCH (Đã sửa theo yêu cầu) === */}
          {activeTab === 'policy' && (
              <div className="animate-fade-in space-y-20 py-16">

                {/* 1. Intro & Stats */}
                <div className="container mx-auto px-4">
                  <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="lg:w-1/2">
                      <h2 className="text-3xl font-bold text-[#00008b] mb-6 border-l-4 border-[#cc0022] pl-4">
                        Chính sách phát triển nhân viên
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                        Tại Edurise Global, chúng tôi cam kết tạo ra môi trường làm việc nơi mỗi cá nhân đều có cơ hội phát triển. Giáo viên không chỉ giảng dạy mà còn được định hướng lộ trình nghề nghiệp rõ ràng.
                      </p>
                      <p className="text-gray-600 mb-8 leading-relaxed">
                        Chúng tôi liên tục tổ chức các khóa đào tạo chuyên môn và kỹ năng mềm, đảm bảo nhân sự luôn bắt kịp xu hướng công nghệ giáo dục 4.0[cite: 23, 36].
                      </p>

                      {/* Stats Box */}
                      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 grid grid-cols-2 gap-6">
                        <div className="text-center border-r border-gray-200">
                          <span className="block text-4xl font-bold text-[#cc0022] mb-1">100%</span>
                          <span className="text-sm font-semibold text-[#00008b] uppercase">Giáo viên đạt chuẩn</span>
                        </div>
                        <div className="text-center">
                          <span className="block text-4xl font-bold text-[#cc0022] mb-1">100%</span>
                          <span className="text-sm font-semibold text-[#00008b] uppercase">Chứng chỉ Quốc tế</span>
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-1/2">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
                            alt="Edurise Culture"
                            className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#00008b]/60 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Các chương trình đào tạo (Grid Layout giống ảnh FPT) */}
                <div className="bg-white py-16">
                  <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold text-[#00008b]">Một số chương trình đào tạo</h2>
                      <div className="w-24 h-1 bg-[#cc0022] mx-auto mt-4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {trainingPrograms.map((item, idx) => (
                          <div key={idx} className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#cc0022]/30">
                            <div className="h-48 overflow-hidden">
                              <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-6">
                              <h3 className="text-lg font-bold text-[#00008b] mb-3 group-hover:text-[#cc0022] transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Chính sách đãi ngộ (Layout 2 cột giống ảnh FPT) */}
                <div className="container mx-auto px-4">
                  <div className="flex flex-col md:flex-row gap-10">
                    {/* Cột trái: Text giới thiệu */}
                    <div className="md:w-1/3 space-y-6">
                      <h2 className="text-3xl font-bold text-[#00008b]">Chính sách đãi ngộ</h2>
                      <p className="text-gray-600">
                        Hệ thống đãi ngộ của Edurise Global được xây dựng căn cứ trên các tiêu chí: Tương xứng với kết quả công việc, cạnh tranh theo thị trường và khuyến khích tăng kết quả[cite: 3].
                      </p>
                      <ul className="space-y-3">
                        {['Công bằng & Minh bạch', 'Cạnh tranh thị trường', 'Ghi nhận đóng góp'].map((txt, i) => (
                            <li key={i} className="flex items-center text-gray-700 font-medium">
                              <CheckCircle className="w-5 h-5 text-[#cc0022] mr-3" /> {txt}
                            </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cột phải: Grid 2x2 các đãi ngộ chính */}
                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#00008b] hover:bg-blue-50 transition-colors">
                        <div className="flex items-center mb-3">
                          <div className="bg-blue-100 p-2 rounded-full mr-3"><Briefcase className="w-6 h-6 text-[#00008b]" /></div>
                          <h4 className="font-bold text-gray-800">Lương & Thưởng</h4>
                        </div>
                        <p className="text-sm text-gray-600">Lương 12 tháng + Thưởng lương tháng 13 tùy theo tình hình kinh doanh của tập đoàn.</p>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#cc0022] hover:bg-red-50 transition-colors">
                        <div className="flex items-center mb-3">
                          <div className="bg-red-100 p-2 rounded-full mr-3"><Award className="w-6 h-6 text-[#cc0022]" /></div>
                          <h4 className="font-bold text-gray-800">Thưởng Hiệu Quả</h4>
                        </div>
                        <p className="text-sm text-gray-600">Thưởng theo hiệu quả kinh doanh và thành tích thực hiện dự án/công việc giảng dạy.</p>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#cc0022] hover:bg-red-50 transition-colors">
                        <div className="flex items-center mb-3">
                          <div className="bg-red-100 p-2 rounded-full mr-3"><Zap className="w-6 h-6 text-[#cc0022]" /></div>
                          <h4 className="font-bold text-gray-800">Phụ Cấp</h4>
                        </div>
                        <p className="text-sm text-gray-600">Hỗ trợ đi lại, cước điện thoại, phụ cấp kiêm nhiệm cho các vị trí đặc thù[cite: 14].</p>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#00008b] hover:bg-blue-50 transition-colors">
                        <div className="flex items-center mb-3">
                          <div className="bg-blue-100 p-2 rounded-full mr-3"><Heart className="w-6 h-6 text-[#00008b]" /></div>
                          <h4 className="font-bold text-gray-800">Phúc Lợi Xã Hội</h4>
                        </div>
                        <p className="text-sm text-gray-600">Đầy đủ Bảo hiểm xã hội, BHYT, BHTN theo luật định và chế độ thăm hỏi, du lịch[cite: 4].</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* === TAB 2: QUY TRÌNH TUYỂN DỤNG (Giữ nguyên) === */}
          {activeTab === 'process' && (
              <div className="animate-fade-in py-16 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-[#00008b] mb-4">Lộ trình gia nhập Edurise Global</h2>
                    <div className="w-20 h-1 bg-[#cc0022] mx-auto"></div>
                  </div>

                  <div className="space-y-20 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-gray-100 -z-10"></div>

                    {recruitmentProcess.map((step, index) => (
                        <div key={index} className={`flex flex-col lg:flex-row items-center gap-10 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>

                          {/* Image */}
                          <div className="w-full lg:w-1/2">
                            <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-white group">
                              <div className="absolute top-0 left-0 bg-[#cc0022] text-white font-bold py-1 px-4 z-10 rounded-br-lg">
                                Bước {step.step}
                              </div>
                              <img
                                  src={step.img}
                                  alt={step.title}
                                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          </div>

                          {/* Content */}
                          <div className={`w-full lg:w-1/2 ${index % 2 !== 0 ? 'lg:text-right' : ''}`}>
                            <h3 className="text-2xl font-bold text-[#00008b] mb-3 flex items-center gap-3 justify-start lg:justify-start">
                              {index % 2 !== 0 && <span className="hidden lg:block flex-grow"></span>}
                              {step.title}
                              {index % 2 === 0 && <span className="hidden lg:block flex-grow"></span>}
                            </h3>
                            <p className="text-gray-600 mb-4 text-lg">{step.desc}</p>
                            <div className={`inline-block bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-sm font-medium text-[#00008b]`}>
                              <span className="mr-2">💡</span> {step.detail}
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>

                  <div className="text-center mt-20">
                    <a href="https://tuyendung.erg.edu.vn" target="_blank" className="inline-block bg-[#00008b] hover:bg-blue-900 text-white font-bold py-3 px-8 rounded shadow-lg transition-colors">
                      NỘP HỒ SƠ ỨNG TUYỂN NGAY
                    </a>
                  </div>
                </div>
              </div>
          )}

        </div>

        {/*/!* Footer CTA Section *!/*/}
        {/*<section className="bg-[#00008b] py-12 text-center text-white">*/}
        {/*  <h2 className="text-2xl font-bold mb-4">Bạn chưa tìm thấy vị trí phù hợp?</h2>*/}
        {/*  <p className="mb-6 opacity-90">Gửi CV vào kho dữ liệu nhân tài, chúng tôi sẽ liên hệ khi có cơ hội.</p>*/}
        {/*  <button className="bg-white text-[#00008b] font-bold py-3 px-8 rounded hover:bg-[#cc0022] hover:text-white transition-all duration-300">*/}
        {/*    GỬI CV NGAY*/}
        {/*  </button>*/}
        {/*</section>*/}

      </div>
  );
}