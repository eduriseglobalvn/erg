'use client';

import React, { use } from 'react';
import {
    MapPin,
    DollarSign,
    Users,
    Clock,
    Calendar,
    Building2,
    CheckCircle2,
    AlertCircle,
    Info,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// --- IMPORT DỮ LIỆU TỪ MOCK CHUNG ---
import { JobDetail } from '@/mocks/types';
import { getJobDetailBySlug, EMPLOYER_INFO } from '@/mocks/jobs.mock';

// --- TYPE PROPS ---
interface JobDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// --- COMPONENT CON: INFO ITEM ---
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex flex-col mb-4 md:mb-0">
        <div className="flex items-center text-gray-500 mb-1">
            <span className="mr-2 text-gray-400">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-gray-900 font-semibold pl-8 md:pl-0 block text-sm md:text-base">{value}</span>
    </div>
);

// --- COMPONENT CHÍNH ---
const JobDetailPage = ({ params }: JobDetailPageProps) => {
    // Sử dụng React.use() để giải nén params (Next.js 15)
    const { slug } = use(params);

    // Lấy dữ liệu công việc
    const job: JobDetail | undefined = getJobDetailBySlug(slug);

    // Xử lý khi không tìm thấy job
    if (!job) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-32 pb-20">
            <AlertCircle className="w-16 h-16 text-[#cc0022] mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy công việc này!</h1>
            <p className="text-gray-500 mb-6">Vui lòng kiểm tra lại đường dẫn hoặc công việc đã hết hạn.</p>
            <Link href="/tuyen-dung/tat-ca" className="text-[#00008b] hover:underline flex items-center gap-2">
                <ArrowLeft size={16} /> Quay lại danh sách
            </Link>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-20">

            {/* Header Background */}
            <div className="bg-[#00008b] h-64 w-full absolute top-0 left-0 z-0"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10 pt-32">

                {/* Breadcrumb / Back button */}
                <div className="mb-6">
                    <Link href="/tuyen-dung/tat-ca" className="text-blue-100 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors w-fit">
                        <ArrowLeft size={16} /> Quay lại danh sách việc làm
                    </Link>
                </div>

                {/* HEADER DẠNG CARD */}
                <div className="bg-white rounded-xl shadow-lg border-b-4 border-[#cc0022] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#00008b] uppercase leading-tight">
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap items-center text-gray-500 text-sm mt-4 gap-y-2">
                            <span className="flex items-center mr-6">
                                <MapPin size={18} className="mr-1.5 text-[#cc0022]" />
                                {job.location}
                            </span>
                            <span className="flex items-center">
                                <Clock size={18} className="mr-1.5 text-blue-500" />
                                {job.workType}
                            </span>
                        </div>
                    </div>

                    <a
                        href="http://zalo.me/0967689259"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#cc0022] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-red-900/20 transition-all whitespace-nowrap flex items-center transform hover:scale-105 cursor-pointer"
                    >
                        <CheckCircle2 className="mr-2 w-5 h-5" />
                        Nộp hồ sơ ngay
                    </a>
                </div>

                {/* BODY CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* === CỘT TRÁI (NỘI DUNG CHÍNH) === */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Box 1: Thông tin tóm tắt */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-lg font-bold text-[#00008b] mb-6 border-l-4 border-[#00008b] pl-3">
                                Thông tin chung
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                                <InfoItem icon={<Building2 size={20}/>} label="Đơn vị" value={EMPLOYER_INFO.name} />
                                <InfoItem icon={<Users size={20}/>} label="Số lượng tuyển" value={job.quantity} />
                                <InfoItem icon={<Clock size={20}/>} label="Hình thức" value={job.workType} />
                                <InfoItem icon={<DollarSign size={20}/>} label="Mức lương" value={job.salary} />
                                <InfoItem icon={<MapPin size={20}/>} label="Địa điểm" value={job.location} />
                                <InfoItem icon={<Calendar size={20}/>} label="Hạn nộp CV" value={job.deadline} />
                            </div>
                        </div>

                        {/* Box 2: Chi tiết công việc */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-lg font-bold text-[#00008b] mb-8 border-b pb-4 uppercase tracking-wider">
                                Chi tiết công việc
                            </h3>

                            <div className="space-y-10">
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-[#00008b]">1</div>
                                        Mô tả công việc
                                    </h4>
                                    <ul className="list-disc list-outside space-y-2 text-gray-600 pl-6 leading-relaxed">
                                        {job.jobDescription.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-[#00008b]">2</div>
                                        Yêu cầu ứng viên
                                    </h4>
                                    <ul className="list-disc list-outside space-y-2 text-gray-600 pl-6 leading-relaxed">
                                        {job.requirements.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-[#00008b]">3</div>
                                        Quyền lợi
                                    </h4>
                                    <ul className="list-disc list-outside space-y-2 text-gray-600 pl-6 leading-relaxed">
                                        {job.benefits.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === CỘT PHẢI (SIDEBAR) === */}
                    <div className="lg:col-span-1 space-y-8">

                        {/* Box 1: Nơi làm việc */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
                            <h3 className="text-lg font-bold text-[#00008b] mb-4 flex items-center">
                                <MapPin className="mr-2 text-[#cc0022]" size={20}/>
                                Địa điểm làm việc
                            </h3>
                            <p className="text-gray-700 text-sm font-medium mb-4 pl-1">
                                {job.location}
                            </p>
                            <div className="bg-orange-50 h-40 rounded-lg flex items-center justify-center border border-orange-200 relative overflow-hidden group cursor-pointer">
                                {/* Hiệu ứng hover giả lập */}
                                <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="text-center relative z-10">
                                    <MapPin size={40} className="mx-auto mb-2 text-orange-500 opacity-80" />
                                    <span className="text-xs text-orange-700 font-bold uppercase tracking-wide">Xem trên bản đồ</span>
                                </div>
                            </div>
                        </div>

                        {/* Box 2: THÔNG TIN CÔNG TY */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-[#00008b] mb-4 flex items-center border-b pb-3">
                                <Building2 className="mr-2 text-blue-500" size={20}/>
                                Thông tin công ty
                            </h3>

                            <div className="space-y-4 text-sm text-gray-600">
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">Tên tổ chức:</p>
                                    <p>{EMPLOYER_INFO.nameOfOrganization}</p>
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">Trụ sở chính:</p>
                                    <p>{EMPLOYER_INFO.mainAddress}</p>
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-900 mb-2 flex items-center">
                                        <Info size={14} className="mr-1 text-blue-500"/>
                                        Lĩnh vực hoạt động:
                                    </p>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-gray-500">
                                        {EMPLOYER_INFO.fieldOfActivity.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default JobDetailPage;