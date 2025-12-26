'use client';

import React from 'react';
import { BookOpen, TrendingUp, Globe, Lightbulb, Heart, Rocket, Quote } from 'lucide-react';

export default function ErgStoryPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">

            {/* --- HERO SECTION --- */}
            <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
                {/* Background with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&auto=format&fit=crop"
                        alt="Technology and Education"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#00008b]/80 mix-blend-multiply"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
                    <div className="inline-block bg-[#cc0022] px-4 py-1 rounded-full text-sm font-bold tracking-widest mb-4 uppercase">
                        Về chúng tôi
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        CÂU CHUYỆN CỦA ERG
                    </h1>
                    <p className="text-xl md:text-2xl font-light italic opacity-90">
                        "Khơi nguồn trí tuệ – Dẫn lối tương lai"
                    </p>
                </div>
            </section>

            {/* --- PHẦN 1: BỐI CẢNH RA ĐỜI --- */}
            <section className="py-20 container mx-auto px-4 relative overflow-hidden">
                {/* Dot Grid Pattern cho nền trắng */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#00008b 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                ></div>

                <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">

                    {/* Cột Trái: Text */}
                    <div className="lg:w-1/2 space-y-6">
                        <h2 className="text-3xl font-bold text-[#00008b] relative pb-4">
                            Khát vọng trong kỷ nguyên số
                            <span className="absolute bottom-0 left-0 w-20 h-1 bg-[#cc0022]"></span>
                        </h2>

                        {/* Nội dung giữ nguyên từ ảnh */}
                        <p className="text-lg text-gray-700 leading-relaxed text-justify">
                            Giữa làn sóng chuyển đổi số mạnh mẽ, khi giáo dục toàn cầu đối mặt với yêu cầu đổi mới để bắt nhịp thời đại, ERG (EduRise Global) ra đời với một khát vọng lớn: biến công nghệ trở thành chiếc cầu nối bền vững giữa tri thức và con người.
                        </p>

                        <div className="bg-white/80 backdrop-blur-sm border-l-4 border-[#00008b] p-6 italic text-gray-600 rounded-r-lg shadow-sm">
                            "Chúng tôi không chỉ dạy công nghệ, chúng tôi dùng công nghệ để khai phóng tiềm năng con người."
                        </div>
                    </div>

                    {/* Cột Phải: Hình ảnh minh họa */}
                    <div className="lg:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 group">
                            <img
                                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"
                                alt="Digital Transformation in Education"
                                className="w-full h-auto object-cover"
                            />
                            {/* Decorative Elements */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#cc0022] rounded-full z-[-1] group-hover:scale-110 transition-transform"></div>
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#00008b]/20 rounded-full z-[-1]"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PHẦN 2: GIẢI MÃ TÊN GỌI --- */}
            <section className="py-20 bg-gray-50 relative overflow-hidden">
                {/* Dot Grid Pattern (Mờ hơn chút trên nền xám) */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#00008b 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <Quote className="w-12 h-12 text-[#cc0022] mx-auto mb-4 opacity-50" />

                        {/* Nội dung giữ nguyên từ ảnh */}
                        <h3 className="text-2xl md:text-3xl font-bold text-[#00008b] leading-relaxed mb-6">
                            "Edu + Rise + Global" – ERG mang trong mình sứ mệnh khai phóng tiềm năng trí tuệ thông qua các giải pháp giáo dục thông minh và toàn diện.
                        </h3>

                        <p className="text-gray-600 text-lg leading-relaxed">
                            Được sáng lập bởi những nhà giáo dục tâm huyết cùng đội ngũ chuyên gia công nghệ sâu sắc, ERG là sự giao thoa giữa tư duy giáo dục tiến bộ và năng lực sáng tạo đột phá trong kỷ nguyên số.
                        </p>
                    </div>

                    {/* Visual Breakdown của tên thương hiệu */}
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        {/* Card 1: Edu */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#00008b] hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <BookOpen className="w-8 h-8 text-[#00008b]" />
                            </div>
                            <h4 className="text-2xl font-bold text-center text-[#00008b] mb-2">Edu</h4>
                            <p className="text-center text-sm font-bold text-[#cc0022] uppercase tracking-wide mb-4">Education - Giáo dục</p>
                            <p className="text-gray-600 text-center">
                                Nền tảng cốt lõi, nơi tri thức được truyền tải bằng sự tận tâm và phương pháp sư phạm hiện đại.
                            </p>
                        </div>

                        {/* Card 2: Rise */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#cc0022] hover:-translate-y-2 transition-transform duration-300 scale-105 z-10 ring-4 ring-white">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <TrendingUp className="w-8 h-8 text-[#cc0022]" />
                            </div>
                            <h4 className="text-2xl font-bold text-center text-[#cc0022] mb-2">Rise</h4>
                            <p className="text-center text-sm font-bold text-[#00008b] uppercase tracking-wide mb-4">Rise - Vươn tầm</p>
                            <p className="text-gray-600 text-center">
                                Sự phát triển không ngừng, khát vọng vươn lên và đổi mới sáng tạo để thích ứng với thế giới biến động.
                            </p>
                        </div>

                        {/* Card 3: Global */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#00008b] hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <Globe className="w-8 h-8 text-[#00008b]" />
                            </div>
                            <h4 className="text-2xl font-bold text-center text-[#00008b] mb-2">Global</h4>
                            <p className="text-center text-sm font-bold text-[#cc0022] uppercase tracking-wide mb-4">Global - Toàn cầu</p>
                            <p className="text-gray-600 text-center">
                                Tầm nhìn quốc tế, đưa tiêu chuẩn giáo dục toàn cầu đến với người học Việt Nam.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PHẦN 3: GIÁ TRỊ CỐT LÕI (Nền xanh đậm - Không dùng Dot Grid, dùng Shape) --- */}
            <section className="py-20 bg-[#00008b] text-white relative overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#cc0022] opacity-20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        {/* Tăng từ text-3xl lên text-4xl hoặc 5xl */}
                        <h2 className="text-5xl md:text-5xl font-extrabold mb-6">Điều Gì Tạo Nên ERG?</h2>
                        <div className="w-24 h-1.5 bg-[#cc0022] mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {/* Item 1 */}
                        <div className="flex flex-col items-center text-center p-8 border border-blue-400/30 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <Lightbulb className="w-14 h-14 text-[#ffcc00] mb-6" />
                            {/* Tiêu đề mục: Tăng từ text-xl lên text-2xl */}
                            <h3 className="text-3xl font-bold mb-3">Tiên Phong</h3>
                            {/* Nội dung: Tăng từ text-sm lên text-base hoặc text-lg */}
                            <p className="text-blue-100 text-base md:text-xl leading-relaxed">
                                Luôn đi đầu trong việc áp dụng các công nghệ phương pháp giáo dục mới vào giảng dạy.
                            </p>
                        </div>

                        {/* Item 2 */}
                        <div className="flex flex-col items-center text-center p-8 border border-blue-400/30 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <Heart className="w-14 h-14 text-[#cc0022] mb-6" />
                            <h3 className="text-3xl font-bold mb-3">Tâm Huyết</h3>
                            <p className="text-blue-100 text-base md:text-xl leading-relaxed">
                                Đội ngũ giáo viên không chỉ là người truyền đạt kiến thức mà còn là người truyền lửa đam mê.
                            </p>
                        </div>

                        {/* Item 3 */}
                        <div className="flex flex-col items-center text-center p-8 border border-blue-400/30 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <Rocket className="w-14 h-14 text-blue-300 mb-6" />
                            <h3 className="text-3xl font-bold mb-3">Đột Phá</h3>
                            <p className="text-blue-100 text-base md:text-xl leading-relaxed">
                                Tạo ra những bước nhảy vọt về năng lực số cho học viên, mở ra cánh cửa sự nghiệp tương lai.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* --- CTA / KẾT THÚC --- */}
            <section className="py-16 text-center relative overflow-hidden">
                {/* Dot Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#00008b 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                ></div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    {/* Tiêu đề: Tăng size, tăng khoảng cách chữ và thêm font-extrabold để tạo sức nặng */}
                    <h2 className="text-5xl md:text-6xl font-extrabold text-[#00008b] mb-14 tracking-tight leading-tight">
                        Hãy cùng chúng tôi <br className="hidden md:block" /> viết tiếp câu chuyện này
                    </h2>

                    {/* Nút bấm: Điều chỉnh padding, bo góc lớn hơn (xl) và shadow tinh tế hơn */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                        <a
                            href="https://tuyendung.erg.edu.vn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative bg-[#cc0022] hover:bg-[#b3001e] text-white font-bold py-6 px-12 rounded-2xl text-2xl shadow-2xl shadow-red-900/20 transition-all duration-300 hover:-translate-y-2 active:scale-95"
                        >
                            Gia nhập đội ngũ ERG
                        </a>

                        <a
                            href="/lien-he"
                            className="bg-white border-[3px] border-[#00008b] text-[#00008b] hover:bg-[#00008b] hover:text-white font-bold py-6 px-12 rounded-2xl text-2xl shadow-xl shadow-blue-900/10 transition-all duration-300 hover:-translate-y-2 active:scale-95"
                        >
                            Liên hệ hợp tác
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}