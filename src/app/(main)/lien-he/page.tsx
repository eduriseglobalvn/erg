'use client';

import React from 'react';
import { MapPin, Send } from 'lucide-react';

const ERG_BLUE = '#00008b';
const ERG_RED = '#cc0022';

const INTEREST_TOPICS = [
    "Tin học Quốc tế",
    "Tin học Quốc gia",
    "Tin học Thiếu nhi",
    "Giáo dục kỹ năng công dân số",
    "Điện toán đám mây",
    "Trí tuệ nhân tạo (AI)"
];

export default function ContactPage() {
    return (
        // [LAYOUT FIX]
        // 1. Dùng min-h-screen: Đảm bảo trang luôn cao ít nhất bằng màn hình
        // 2. flex-row: Để 2 cột (Form và Map) tự động cao bằng nhau
        <div className="font-sans text-slate-800 bg-white min-h-screen flex flex-col lg:flex-row">

            {/* --- 1. LEFT SIDE: CONTENT & FORM --- */}
            {/* lg:w-1/2: Chiếm 50% chiều rộng */}
            <div className="lg:w-1/2 w-full p-6 lg:p-12 xl:p-20 flex flex-col justify-center bg-white order-2 lg:order-1">
                <div className="max-w-lg mx-auto w-full">

                    {/* Header */}
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight" style={{ color: ERG_BLUE }}>
                        Liên hệ tư vấn
                    </h1>
                    <div
                        className="w-34 h-1.5 rounded-full mb-4"
                        style={{ backgroundColor: ERG_RED }}
                    >
                    </div>
                    <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                        Để lại thông tin bên dưới, chuyên viên tư vấn của ERG sẽ liên hệ hỗ trợ bạn lộ trình học tập phù hợp nhất trong vòng 24h.
                    </p>

                    {/* Form */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            // Handle submit logic
                        }}
                        className="space-y-6"
                    >
                        {/* Row: Họ & Tên */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Họ</label>
                                <input
                                    type="text"
                                    placeholder="Nguyễn"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#00008b] focus:ring-4 focus:ring-[#00008b]/10 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Tên</label>
                                <input
                                    type="text"
                                    placeholder="Văn A"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#00008b] focus:ring-4 focus:ring-[#00008b]/10 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Email</label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#00008b] focus:ring-4 focus:ring-[#00008b]/10 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
                            <input
                                type="tel"
                                placeholder="0912 345 678"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#00008b] focus:ring-4 focus:ring-[#00008b]/10 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* Checkbox Section */}
                        <div className="space-y-3 pt-2">
                            <label className="text-sm font-bold text-gray-900">Chủ đề quan tâm</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {INTEREST_TOPICS.map((item, idx) => (
                                    <label key={idx} className="flex items-start gap-3 cursor-pointer group p-2 rounded-md hover:bg-gray-50 transition-colors -ml-2">
                                        <div className="relative flex items-center pt-0.5">
                                            <input
                                                type="checkbox"
                                                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all checked:border-[#00008b] checked:bg-[#00008b] hover:border-[#00008b]"
                                            />
                                            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="text-gray-600 text-sm font-medium group-hover:text-[#00008b] transition-colors">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Lời nhắn</label>
                            <textarea
                                rows={3}
                                placeholder="Để lại lời nhắn cho chúng tôi..."
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#00008b] focus:ring-4 focus:ring-[#00008b]/10 outline-none transition-all resize-none placeholder:text-gray-400"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            style={{ backgroundColor: ERG_BLUE }}
                        >
                            <Send size={18} />
                            Gửi tin nhắn
                        </button>
                    </form>
                </div>
            </div>

            {/* --- 2. RIGHT SIDE: FULL MAP (FIXED) --- */}
            {/* - lg:w-1/2: Chiếm 50%
               - relative: Để iframe absolute bám theo
               - lg:min-h-screen: Trên desktop, chiều cao tối thiểu là 1 màn hình
               - h-[450px]: Trên mobile, chiều cao cố định 450px
            */}
            <div className="lg:w-1/2 w-full relative bg-gray-100 lg:min-h-screen h-[450px] order-1 lg:order-2 border-l border-gray-200">
                {/* [QUAN TRỌNG] absolute inset-0: Giúp iframe chiếm trọn vẹn khối cha
                    Bất kể khối cha co giãn thế nào, iframe cũng sẽ đi theo
                 */}
                <iframe
                    src="https://maps.google.com/maps?q=40-42%20B%C3%ACnh%20Ph%C3%BA%2C%20P%20B%C3%ACnh%20Ph%C3%BA%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=15&ie=UTF8&iwloc=&output=embed" // Map link
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ERG Global Location"
                    className="absolute inset-0 grayscale-[10%] hover:grayscale-0 transition-all duration-700 w-full h-full object-cover"
                ></iframe>

                {/* Floating Map Card */}
                <div className="absolute top-6 right-6 left-6 md:left-auto md:w-80 bg-white p-5 rounded-2xl shadow-xl animate-fade-in border border-gray-100/50">
                    <div className="flex items-start gap-3">
                        <div className="bg-red-50 p-2.5 rounded-xl shrink-0">
                            <MapPin size={24} color={ERG_RED} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-gray-900 mb-1">Trung tâm Tin học ERG</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Số 40-42 Bình Phú, P. Bình Phú, TP. Hồ Chí Minh
                            </p>
                            <a
                                href="https://maps.app.goo.gl/..."
                                target="_blank"
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#00008b] mt-3 hover:underline"
                            >
                                Xem trên Google Maps
                                <Send size={10} className="-rotate-45" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}