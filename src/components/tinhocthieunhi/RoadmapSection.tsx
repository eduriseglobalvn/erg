'use client';

import React from 'react';
import { Palette, Gamepad2, Terminal, Code2, ArrowRight, Check, Sparkles, Zap } from 'lucide-react';

const RoadmapSection = () => {
    return (
        <section className="py-20 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header Title */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)] mb-4">
                        Lựa Chọn Khóa Học Phù Hợp
                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                        Hai hướng tiếp cận công nghệ hoàn toàn độc lập dành cho học sinh Tiểu học & THCS.
                        Tùy thuộc vào sở thích của bé (thích vẽ/sáng tạo hay thích toán/logic), ba mẹ hãy chọn lộ trình phù hợp nhất.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                    {/* --- TRACK 1: SCRATCH (SÁNG TẠO) --- */}
                    <div className="bg-white rounded-3xl p-8 border-2 border-orange-100 shadow-xl shadow-orange-100/50 hover:border-orange-300 transition-all duration-300 relative overflow-hidden group">

                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full opacity-50 -z-0"></div>

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
                        <div className="space-y-6 relative z-10">
                            {/* Step 1 */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-200">1</div>
                                    <div className="w-0.5 h-full bg-orange-200 my-2"></div>
                                </div>
                                <div className="pb-6">
                                    <h4 className="text-lg font-bold text-orange-700">Học tư duy Kéo - Thả</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Làm quen với các khối lệnh màu sắc. Bé không cần gõ phím, chỉ cần lắp ghép ý tưởng như chơi Lego.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-orange-500 text-orange-500 flex items-center justify-center font-bold">2</div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-orange-700">Tự làm Game & Phim</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Kết quả: Bé tự tạo được trò chơi, thiệp điện tử, phim hoạt hình để khoe với gia đình và bạn bè.
                                    </p>
                                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                                        <Sparkles size={14} /> Phát triển trí tưởng tượng
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-8 pt-6 border-t border-orange-100 text-center">
                            <button className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors flex items-center justify-center gap-2">
                                Chọn Lộ Trình Scratch <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* --- TRACK 2: PYTHON (LOGIC) --- */}
                    <div className="bg-white rounded-3xl p-8 border-2 border-blue-100 shadow-xl shadow-blue-100/50 hover:border-blue-300 transition-all duration-300 relative overflow-hidden group">

                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-50 -z-0"></div>

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
                        <div className="space-y-6 relative z-10">
                            {/* Step 1 */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200">1</div>
                                    <div className="w-0.5 h-full bg-blue-200 my-2"></div>
                                </div>
                                <div className="pb-6">
                                    <h4 className="text-lg font-bold text-blue-700">Lập trình dòng lệnh</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Tiếp cận ngôn ngữ lập trình thực tế số 1 thế giới. Học cú pháp, biến, vòng lặp chuẩn kỹ sư công nghệ.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-600 text-blue-600 flex items-center justify-center font-bold">2</div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-blue-700">Giải quyết vấn đề</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Kết quả: Viết chương trình giải toán, xử lý dữ liệu, làm game trí tuệ. Nền tảng cho AI và Khoa học dữ liệu.
                                    </p>
                                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                                        <Zap size={14} /> Phát triển tư duy Logic
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-8 pt-6 border-t border-blue-100 text-center">
                            <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors flex items-center justify-center gap-2">
                                Chọn Lộ Trình Python <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Note footer */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-500 bg-white px-6 py-2 rounded-full border border-gray-200 shadow-sm text-sm">
                        <Check size={16} className="text-green-500" />
                        <span>Cả hai lộ trình đều được thiết kế chuẩn sư phạm cho học sinh <strong>Tiểu học & THCS</strong></span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoadmapSection;