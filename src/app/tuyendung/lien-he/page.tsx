'use client';

import React, { useState } from 'react';
import { MapPin, Send, UploadCloud, FileText, Mail, Phone } from 'lucide-react';

const ERG_BLUE = '#00008b';
const ERG_RED = '#cc0022';

// Danh sách các nhóm vị trí tuyển dụng
const JOB_CATEGORIES = [
    "Giáo viên Tin học (IC3/MOS)",
    "Trợ giảng (Part-time)",
    "Nhân viên Văn phòng / Giáo vụ",
    "IT Helpdesk / Quản trị mạng",
    "Kinh doanh / Tư vấn tuyển sinh",
    "Thực tập sinh (Internship)"
];

export default function RecruitmentContactPage() {
    const [fileName, setFileName] = useState<string | null>(null);

    // Xử lý giả lập chọn file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    return (
        <div className="font-sans text-slate-800 bg-white min-h-screen flex flex-col lg:flex-row">

            {/* --- 1. LEFT SIDE: RECRUITMENT FORM --- */}
            <div className="lg:w-1/2 w-full p-6 lg:p-12 xl:p-20 flex flex-col justify-center bg-white order-2 lg:order-1">
                <div className="max-w-xl mx-auto w-full">

                    {/* Header */}
                    <div className="mb-8">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-[#00008b] text-xs font-bold uppercase tracking-wider mb-3">
                            Join Our Team
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight" style={{ color: ERG_BLUE }}>
                            Ứng tuyển ngay
                        </h1>
                        <div
                            className="w-34 h-1.5 rounded-full mb-4"
                            style={{ backgroundColor: ERG_RED }}
                        >
                        </div>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Bạn chưa tìm thấy vị trí phù hợp trong danh sách? <br/>
                            Hãy để lại thông tin và CV, bộ phận Nhân sự (HR) sẽ liên hệ ngay khi có cơ hội dành cho bạn.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

                        {/* Row: Họ & Tên */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Họ và tên đệm <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="Nguyễn Văn" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#00008b] focus:ring-4 focus:ring-[#00008b]/10 outline-none transition-all placeholder:text-gray-400" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Tên <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="A" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#00008b] focus:ring-4 focus:ring-[#00008b]/10 outline-none transition-all placeholder:text-gray-400" required />
                            </div>
                        </div>

                        {/* Row: Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Email liên hệ <span className="text-red-500">*</span></label>
                                <input type="email" placeholder="ungvien@example.com" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#00008b] focus:ring-4 focus:ring-[#00008b]/10 outline-none transition-all placeholder:text-gray-400" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
                                <input type="tel" placeholder="09xx xxx xxx" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#00008b] focus:ring-4 focus:ring-[#00008b]/10 outline-none transition-all placeholder:text-gray-400" required />
                            </div>
                        </div>

                        {/* Vị trí quan tâm */}
                        <div className="space-y-3 pt-2">
                            <label className="text-sm font-bold text-gray-900">Vị trí bạn quan tâm</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {JOB_CATEGORIES.map((item, idx) => (
                                    <label key={idx} className="flex items-start gap-3 cursor-pointer group p-2 rounded-md hover:bg-gray-50 transition-colors -ml-2">
                                        <div className="relative flex items-center pt-0.5">
                                            <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all checked:border-[#00008b] checked:bg-[#00008b] hover:border-[#00008b]" />
                                            {/* Icon check */}
                                            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                            </div>
                                        </div>
                                        <span className="text-gray-600 text-sm font-medium group-hover:text-[#00008b] transition-colors">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* --- NEW: CV UPLOAD SECTION --- */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">CV / Hồ sơ năng lực <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="cv-upload"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="cv-upload"
                                    className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group ${fileName ? 'border-[#00008b] bg-blue-50/50' : 'border-gray-300 hover:border-[#00008b] hover:bg-gray-50'}`}
                                >
                                    {fileName ? (
                                        <>
                                            <FileText size={32} className="text-[#00008b] mb-2" />
                                            <span className="text-sm font-bold text-gray-900">{fileName}</span>
                                            <span className="text-xs text-blue-600 mt-1">Nhấn để thay đổi file</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                                                <UploadCloud size={24} className="text-gray-500 group-hover:text-[#00008b]" />
                                            </div>
                                            <p className="text-sm text-gray-600 font-medium">
                                                <span className="text-[#00008b] font-bold">Tải lên CV</span> hoặc kéo thả vào đây
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Hỗ trợ PDF, DOC, DOCX (Tối đa 5MB)</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Message / Cover Letter */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">Lời nhắn / Cover Letter</label>
                            <textarea
                                rows={3}
                                placeholder="Giới thiệu ngắn gọn về bản thân hoặc dán link Portfolio của bạn..."
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#00008b] focus:ring-4 focus:ring-[#00008b]/10 outline-none transition-all resize-none placeholder:text-gray-400"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                            style={{ backgroundColor: ERG_BLUE }}
                        >
                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                            Gửi hồ sơ ứng tuyển
                        </button>
                    </form>
                </div>
            </div>

            {/* --- 2. RIGHT SIDE: MAP & HR INFO --- */}
            <div className="lg:w-1/2 w-full relative bg-gray-100 lg:min-h-screen h-[500px] order-1 lg:order-2 border-l border-gray-200">
                <iframe
                    src="https://maps.google.com/maps?q=40-42%20B%C3%ACnh%20Ph%C3%BA%2C%20P%20B%C3%ACnh%20Ph%C3%BA%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ERG Global Location"
                    className="absolute inset-0 grayscale-[10%] hover:grayscale-0 transition-all duration-700 w-full h-full object-cover"
                ></iframe>

                {/* Floating Contact Card for HR */}
                <div className="absolute top-6 right-6 left-6 md:left-auto md:w-96 bg-white p-6 rounded-2xl shadow-xl animate-fade-in border border-gray-100/50">
                    <h4 className="font-bold text-lg text-[#00008b] mb-4 border-b border-gray-100 pb-2">Thông tin liên hệ HR</h4>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                                <MapPin size={20} color={ERG_RED} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Văn phòng chính</p>
                                <p className="text-sm text-gray-800 leading-snug">
                                    Tầng 6 Toà nhà 83B Hoàng Sa, P. Tân Định, TP. Hồ Chí Minh
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                                <Mail size={20} color={ERG_BLUE} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Email Tuyển dụng</p>
                                <a href="mailto:tuyendung@erg.edu.vn" className="text-sm font-bold text-gray-800 hover:text-[#cc0022] transition-colors">
                                    tuyendung@erg.edu.vn
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                                <Phone size={20} color={ERG_BLUE} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Hotline HR</p>
                                <a href="tel:0967689259" className="text-sm font-bold text-gray-800 hover:text-[#cc0022] transition-colors">
                                    0967 689 259 (Ms. Thư)
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <a
                            href="https://maps.google.com/maps?q=40-42%20B%C3%ACnh%20Ph%C3%BA%2C%20P%20B%C3%ACnh%20Ph%C3%BA%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            target="_blank"
                            className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-[#00008b] transition-all"
                        >
                            Chỉ đường đến phỏng vấn
                            <Send size={12} className="-rotate-45" />
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
}