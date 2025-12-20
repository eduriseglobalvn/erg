'use client';

import React from 'react';
import {
    Briefcase, Award, ShieldCheck, GraduationCap,
    TrendingUp, Coffee, Clock, DollarSign
} from 'lucide-react';

export default function HRPolicyPage() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans text-slate-800">

            {/* --- HERO SECTION --- */}
            <section className="bg-white pt-24 pb-12 border-b border-gray-200">
                <div className="container mx-auto px-4 text-center">
             <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-[#00008b] text-xs font-bold uppercase tracking-wider mb-4">
                Sự nghiệp vững chắc
            </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#00008b] mb-6">
                        Chính Sách & Phúc Lợi
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Edurise Global cam kết mang đến môi trường làm việc công bằng, minh bạch và chế độ đãi ngộ xứng đáng với năng lực của bạn.
                    </p>
                </div>
            </section>

            {/* --- PHÚC LỢI TOÀN DIỆN (Benefits) --- */}
            <section className="py-16 container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Box 1: Lương thưởng */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
                        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
                            <DollarSign size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Thu Nhập Cạnh Tranh</h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                                Lương thỏa thuận theo năng lực giảng dạy & bằng cấp (IC3, MOS).
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                                Thưởng hiệu quả công việc định kỳ.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                                Thưởng các dịp Lễ, Tết, lương tháng 13.
                            </li>
                        </ul>
                    </div>

                    {/* Box 2: Bảo hiểm & Sức khỏe */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
                        <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-[#cc0022] mb-6">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">An Tâm Công Tác</h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-[#cc0022] rounded-full mt-2"></span>
                                Đóng BHXH, BHYT, BHTN đầy đủ theo quy định Nhà nước.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-[#cc0022] rounded-full mt-2"></span>
                                Chế độ nghỉ phép năm theo luật Lao động.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-[#cc0022] rounded-full mt-2"></span>
                                Khám sức khỏe định kỳ hàng năm.
                            </li>
                        </ul>
                    </div>

                    {/* Box 3: Môi trường làm việc */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
                        <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 mb-6">
                            <Coffee size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Môi Trường Hiện Đại</h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></span>
                                Làm việc tại trụ sở Q1 hoặc chi nhánh Bình Phú hiện đại.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></span>
                                Trang bị đầy đủ thiết bị, phần mềm bản quyền phục vụ giảng dạy.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></span>
                                Tham gia Team Building.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* --- ĐÀO TẠO & PHÁT TRIỂN (Learning & Development) --- */}
            <section className="bg-[#00008b] text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/2">
                            <h2 className="text-3xl font-bold mb-6">Đào tạo & Phát triển chuyên môn</h2>
                            <p className="text-blue-100 mb-8 leading-relaxed">
                                Tại ERG, việc học không bao giờ dừng lại. Chúng tôi coi trọng việc nâng cao năng lực giáo viên để đáp ứng các tiêu chuẩn quốc tế mới nhất.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="shrink-0 bg-white/10 p-3 rounded-lg">
                                        <GraduationCap size={24} className="text-yellow-400"/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Tập huấn nghiệp vụ</h4>
                                        <p className="text-sm text-blue-200 mt-1">
                                            Tham gia các buổi họp chuyên môn, tập huấn phương pháp giảng dạy STEM, IC3, MOS định kỳ.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="shrink-0 bg-white/10 p-3 rounded-lg">
                                        <Award size={24} className="text-yellow-400"/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Cập nhật công nghệ</h4>
                                        <p className="text-sm text-blue-200 mt-1">
                                            Tiếp cận các công nghệ mới nhất (AI, Lập trình) để ứng dụng vào bài giảng sinh động.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 bg-white/5 rounded-2xl p-8 border border-white/10">
                            <h3 className="text-xl font-bold mb-6 text-center border-b border-white/10 pb-4">Lộ Trình Thăng Tiến</h3>

                            <div className="space-y-8 relative">
                                {/* Line connector */}
                                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-white/20"></div>

                                {/* Step 1 */}
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-[#cc0022] flex items-center justify-center font-bold text-sm">01</div>
                                    <div className="bg-white text-[#00008b] p-4 rounded-lg flex-1 shadow-lg">
                                        <h5 className="font-bold">Giáo viên / Nhân viên</h5>
                                        <p className="text-xs text-gray-500">Thực hiện công tác chuyên môn</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-sm">02</div>
                                    <div className="bg-white/90 text-[#00008b] p-4 rounded-lg flex-1">
                                        <h5 className="font-bold">Giáo viên nòng cốt / Leader</h5>
                                        <p className="text-xs text-gray-500">Phụ trách nhóm, hỗ trợ chuyên môn</p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-sm text-[#00008b]">03</div>
                                    <div className="bg-white/80 text-[#00008b] p-4 rounded-lg flex-1">
                                        <h5 className="font-bold">Tổ trưởng Chuyên môn</h5>
                                        <p className="text-xs text-gray-500">Quản lý chương trình, đào tạo nhân sự</p>
                                    </div>
                                </div>
                                {/* Step 4 */}
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-sm">04</div>
                                    <div className="bg-white/70 text-[#00008b] p-4 rounded-lg flex-1">
                                        <h5 className="font-bold">Quản lý / Ban Giám đốc</h5>
                                        <p className="text-xs text-gray-500">Hoạch định chiến lược</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- QUY ĐỊNH CHUNG (Tóm tắt từ JD) --- */}
            <section className="py-16 container mx-auto px-4">
                <div className="bg-white border-l-4 border-[#00008b] p-8 rounded-r-xl shadow-sm">
                    <h2 className="text-2xl font-bold text-[#00008b] mb-4">Trách nhiệm & Quy định chung</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600">
                        <ul className="list-disc list-inside space-y-2">
                            <li>Tuân thủ các quy định và chính sách của tổ chức.</li>
                            <li>Tham gia đầy đủ các buổi họp chuyên môn, sự kiện của Công ty.</li>
                            <li>Soạn thảo giáo án, kế hoạch giảng dạy đúng tiến độ.</li>
                        </ul>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Đảm bảo kỷ luật và môi trường học tập tích cực cho học sinh.</li>
                            <li>Bảo quản tốt các thiết bị, tài sản của Công ty và đối tác.</li>
                            <li>Hỗ trợ đồng nghiệp và tham gia các hoạt động ngoại khóa.</li>
                        </ul>
                    </div>
                </div>
            </section>

        </main>
    );
}