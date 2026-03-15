'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { recruitmentApi } from '@/services/recruitment.api';
import { Candidate, CandidateStatus } from '@/types/recruitment';
import {
    Search, MapPin, Clock, Calendar, CheckCircle2,
    AlertCircle, FileText, Loader2, ArrowLeft,
    Zap, Sparkles, Info
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function TrackingContent() {
    const searchParams = useSearchParams();
    const [code, setCode] = useState(searchParams.get('code') || '');
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (searchCode: string) => {
        if (!searchCode.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await recruitmentApi.trackCandidate(searchCode.trim());
            if (res.data) {
                setCandidate(res.data);
            } else {
                setError('Không tìm thấy thông tin hồ sơ với mã này. Vui lòng kiểm tra lại.');
                setCandidate(null);
            }
        } catch (err: any) {
            console.error('Tracking error:', err);
            setError('Đã xảy ra lỗi khi tra cứu. Vui lòng thử lại sau.');
            setCandidate(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initialCode = searchParams.get('code');
        if (initialCode) {
            handleSearch(initialCode);
        }
    }, [searchParams]);

    const statusMap = {
        [CandidateStatus.PENDING]: {
            label: 'Đã nhận hồ sơ',
            description: 'Chúng tôi đã nhận được hồ sơ của bạn và đang chuẩn bị xem xét.',
            color: 'bg-blue-100 text-blue-700',
            icon: <Clock size={20} />,
            step: 1
        },
        [CandidateStatus.REVIEWING]: {
            label: 'Đang xét duyệt',
            description: 'HR đang đánh giá hồ sơ của bạn với các tiêu chí tuyển dụng.',
            color: 'bg-orange-100 text-orange-700',
            icon: <FileText size={20} />,
            step: 2
        },
        [CandidateStatus.INTERVIEW]: {
            label: 'Mời phỏng vấn',
            description: 'Chúc mừng! Bạn đã vượt qua vòng hồ sơ. HR sẽ liên hệ để xếp lịch phỏng vấn.',
            color: 'bg-purple-100 text-purple-700',
            icon: <Calendar size={20} />,
            step: 3
        },
        [CandidateStatus.OFFER]: {
            label: 'Đề xuất nhận việc',
            description: 'Chúng tôi rất muốn bạn gia nhập ERG. Vui lòng check email nhận Offer.',
            color: 'bg-green-100 text-green-700',
            icon: <CheckCircle2 size={20} />,
            step: 4
        },
        [CandidateStatus.HIRED]: {
            label: 'Đã tuyển dụng',
            description: 'Chào mừng bạn chính thức trở thành thành viên của ERG!',
            color: 'bg-green-600 text-white',
            icon: <CheckCircle2 size={20} />,
            step: 5
        },
        [CandidateStatus.REJECTED]: {
            label: 'Chưa phù hợp',
            description: 'Cảm ơn bạn đã quan tâm. Hồ sơ của bạn sẽ được lưu giữ cho các đợt tuyển dụng sau.',
            color: 'bg-gray-100 text-gray-700',
            icon: <AlertCircle size={20} />,
            step: 0
        }
    };

    const currentStatus = candidate ? statusMap[candidate.status] : null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center animate-fade-in">
                <h1 className="text-3xl md:text-5xl font-black text-[#00008b] mb-4 tracking-tight">Tra cứu trạng thái hồ sơ</h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                    Cập nhật tiến độ ứng tuyển của bạn nhanh chóng và minh bạch.
                </p>
            </div>

            {/* Search Box */}
            <div className="bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 mb-12 ring-1 ring-black/5">
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch(code)}
                            placeholder="Nhập mã tra cứu (VD: REF-123456)"
                            className="w-full pl-14 pr-4 py-5 rounded-xl border-none focus:ring-0 outline-none text-xl font-bold text-[#00008b] placeholder:text-gray-300"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={28} />
                    </div>
                    <button
                        onClick={() => handleSearch(code)}
                        disabled={isLoading || !code.trim()}
                        className="bg-[#cc0022] hover:bg-red-700 text-white px-12 py-5 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-red-900/20"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Search size={22} />}
                        TRA CỨU NGAY
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-4 animate-shake shadow-sm">
                    <AlertCircle size={24} />
                    <p className="font-bold">{error}</p>
                </div>
            )}

            {candidate && currentStatus && (
                <div className="space-y-8 animate-fade-in-up">
                    {/* Status Summary Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
                        <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Hồ sơ trực tuyến</span>
                            </div>
                            <span className="text-xs font-mono bg-white px-3 py-1 rounded-full border text-gray-400 font-bold shadow-sm">MÃ: {candidate.trackingCode}</span>
                        </div>
                        <div className="p-8 md:p-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Vị trí ứng tuyển</p>
                                        <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                            {candidate.jobTitle || candidate.job?.title || 'Ứng tuyển chung'}
                                        </h2>
                                    </div>
                                    <div className="flex flex-wrap gap-6 text-sm">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-600 font-medium">
                                            <Calendar size={16} className="text-blue-500" />
                                            Nộp ngày: {new Date(candidate.submittedAt).toLocaleDateString('vi-VN')}
                                        </div>
                                        {candidate.applyType && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-600 font-medium lowercase first-letter:uppercase">
                                                <Zap size={16} className="text-yellow-500" />
                                                Ứng tuyển qua: {candidate.applyType}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center md:items-end gap-3">
                                    <div className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg shadow-lg ${currentStatus.color}`}>
                                        {currentStatus.icon}
                                        {currentStatus.label}
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium italic">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>

                            {/* Status Description (Wowed) */}
                            <div className="mt-10 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-4">
                                <Sparkles className="text-blue-500 shrink-0" size={24} />
                                <div className="space-y-1">
                                    <p className="font-bold text-blue-900">Thông tin chi tiết:</p>
                                    <p className="text-blue-800 leading-relaxed font-medium">{currentStatus.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HR Public Note Section */}
                    {candidate.publicNote && (
                        <div className="bg-[#00008b] text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                                    <Info size={32} className="text-yellow-400" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-wide">
                                        Ghi chú từ HR
                                    </h3>
                                    <div className="text-blue-100 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                                        {candidate.publicNote}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline / Progress */}
                    {candidate.status !== CandidateStatus.REJECTED && (
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 ring-1 ring-black/5">
                            <h3 className="font-black text-xl text-gray-900 mb-10 uppercase tracking-wider text-center">Tiến trình phản hồi</h3>
                            <div className="flex flex-col md:flex-row justify-between relative gap-10 md:gap-0">
                                {/* Desktop Progress Line */}
                                <div className="hidden md:block absolute top-[26px] left-[10%] w-[80%] h-1 bg-gray-100 -z-0">
                                    <div
                                        className="h-full bg-[#cc0022] transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(204,0,34,0.3)]"
                                        style={{ width: `${Math.min(100, (Math.max(0, currentStatus.step - 1) / 3) * 100)}%` }}
                                    ></div>
                                </div>

                                {[
                                    { s: CandidateStatus.PENDING, label: 'Đã nhận' },
                                    { s: CandidateStatus.REVIEWING, label: 'Xét duyệt' },
                                    { s: CandidateStatus.INTERVIEW, label: 'Phỏng vấn' },
                                    { s: CandidateStatus.OFFER, label: 'Đề nghị' },
                                ].map((item, idx) => {
                                    const stepInfo = statusMap[item.s];
                                    const isCompleted = currentStatus.step > idx + 1;
                                    const isCurrent = currentStatus.step === idx + 1;

                                    return (
                                        <div key={idx} className="flex md:flex-col items-center gap-5 md:gap-4 relative z-10 flex-1">
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-700 ${isCompleted ? 'bg-[#cc0022] border-red-100 text-white shadow-lg' :
                                                isCurrent ? 'bg-white border-[#cc0022] text-[#cc0022] scale-125 shadow-2xl ring-4 ring-red-50' :
                                                    'bg-white border-gray-100 text-gray-300'
                                                }`}>
                                                {isCompleted ? <CheckCircle2 size={28} /> : <span className="text-xl font-black">{idx + 1}</span>}
                                            </div>
                                            <span className={`text-base font-black uppercase tracking-tighter ${isCurrent ? 'text-[#cc0022]' : 'text-gray-400'}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {candidate.status === CandidateStatus.REJECTED && (
                        <div className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-200 text-center">
                            <p className="text-gray-600 italic">
                                &quot;{currentStatus.description}&quot;
                            </p>
                        </div>
                    )}
                </div>
            )}

            {!candidate && !isLoading && !error && (
                <div className="mt-20 text-center animate-pulse">
                    <Image src="/images/searching.svg" alt="Search" width={224} height={224} className="mx-auto opacity-10 hidden md:block grayscale" />
                    <p className="text-gray-400 mt-6 text-lg font-medium">Đang đợi bạn nhập mã tra cứu hồ sơ...</p>
                </div>
            )}
        </div>
    );
}

export default function TrackingPage() {
    return (
        <main className="min-h-screen bg-gray-50 pt-[70px] lg:pt-[135px] pb-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-8">
                    <Link
                        href="/tuyen-dung"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#00008b] font-bold transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Quay lại danh sách việc làm
                    </Link>
                </div>

                <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#00008b]" size={40} /></div>}>
                    <TrackingContent />
                </Suspense>
            </div>
        </main>
    );
}
