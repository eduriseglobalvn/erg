'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { recruitmentApi } from '@/services/recruitment.api';
import { Job } from '@/types/recruitment';
import { Upload, Send, CheckCircle2, AlertCircle, FileText, ArrowLeft, Copy, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const formSchema = z.object({
    fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
    coverLetter: z.string().optional(),
    file: z.any()
        .refine((files) => files?.length === 1, "Vui lòng chọn file CV.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Kích thước file tối đa 2MB.`)
        .refine(
            (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
            "Chỉ chấp nhận định dạng PDF, Doc, Docx."
        ),
});

type FormValues = z.infer<typeof formSchema>;

interface ApplyFormProps {
    job: Job;
}

export default function ApplyForm({ job }: ApplyFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<{ trackingCode: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const t = useTranslations('recruitment.Card'); // Reusing some keys

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const selectedFile = watch('file');

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('fullName', values.fullName);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            if (values.coverLetter) formData.append('coverLetter', values.coverLetter);
            formData.append('jobId', job.id);

            // Critical requirement: domain from env
            const domain = process.env.NEXT_PUBLIC_RECRUITMENT_DOMAIN || 'http://tuyendung.erg.edu.local:3000';
            formData.append('trackingUrl', `${domain}/tuyen-dung/theo-doi`);

            // Critical requirement: field name must be "file"
            formData.append('file', values.file[0]);

            const res = await recruitmentApi.applyJob(formData);

            if (res.statusCode === 201 || res.statusCode === 200) {
                const trackingCode = res.data.trackingCode;
                // Show success screen with tracking code instead of immediate redirect
                setSuccessData({ trackingCode });
            } else {
                throw new Error(res.message || 'Có lỗi xảy ra khi nộp hồ sơ');
            }
        } catch (err: any) {
            console.error('Apply Error:', err);
            setError(err.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyTrackingCode = async () => {
        if (!successData) return;
        try {
            await navigator.clipboard.writeText(successData.trackingCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback for older browsers
            const el = document.getElementById('tracking-code-display');
            if (el) { window.getSelection()?.selectAllChildren(el); }
        }
    };

    // --- SUCCESS SCREEN ---
    if (successData) {
        return (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-once">
                        <CheckCircle2 size={44} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Nộp hồ sơ thành công! 🎉</h2>
                    <p className="text-green-50 text-sm">Chúng tôi đã nhận được hồ sơ của bạn cho vị trí <strong>{job.title}</strong></p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                        <p className="text-sm text-gray-600 mb-2 font-medium">Mã tra cứu hồ sơ của bạn:</p>
                        <div className="flex items-center justify-center gap-3">
                            <span
                                id="tracking-code-display"
                                className="text-3xl font-black text-[#00008b] tracking-widest select-all"
                            >
                                {successData.trackingCode}
                            </span>
                            <button
                                onClick={copyTrackingCode}
                                className="p-2 rounded-lg bg-white border border-blue-200 hover:bg-blue-100 transition-colors"
                                title="Copy mã"
                            >
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-500" />}
                            </button>
                        </div>
                        {copied && <p className="text-xs text-green-600 mt-2 font-medium">Đã copy mã!</p>}
                        <p className="text-xs text-gray-500 mt-3">Lưu lại mã này để tra cứu tiến độ xét duyệt hồ sơ</p>
                    </div>

                    <div className="text-sm text-gray-600 bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                        <p className="font-bold text-yellow-800 mb-1">📋 Các bước tiếp theo:</p>
                        <ol className="list-decimal list-inside space-y-1 text-yellow-700">
                            <li>HR sẽ xem xét hồ sơ trong vòng 3-5 ngày làm việc</li>
                            <li>Chúng tôi sẽ liên hệ qua email hoặc điện thoại nếu phù hợp</li>
                            <li>Dùng mã trên để theo dõi trạng thái hồ sơ bất cứ lúc nào</li>
                        </ol>
                    </div>

                    <Link
                        href={`/tuyen-dung/theo-doi?code=${successData.trackingCode}`}
                        className="flex items-center justify-center gap-2 w-full bg-[#00008b] hover:bg-blue-900 text-white py-4 rounded-xl font-bold transition-all"
                    >
                        <ExternalLink size={18} />
                        Theo dõi trạng thái hồ sơ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-[#00008b] p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Ứng tuyển ngay</h2>
                <p className="text-blue-100 text-sm opacity-90">
                    {job.title}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-3 text-sm animate-shake">
                        <AlertCircle className="shrink-0" size={18} />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Họ và tên *</label>
                        <input
                            {...register('fullName')}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#00008b]'} outline-none transition-all`}
                            placeholder="Nguyễn Văn A"
                        />
                        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Số điện thoại *</label>
                        <input
                            {...register('phone')}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#00008b]'} outline-none transition-all`}
                            placeholder="09xx xxx xxx"
                        />
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email *</label>
                    <input
                        {...register('email')}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#00008b]'} outline-none transition-all`}
                        placeholder="example@gmail.com"
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Tải hồ sơ (CV) *</label>
                    <div className={`relative group border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center cursor-pointer ${errors.file ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-[#00008b] hover:bg-blue-50'
                        }`}>
                        <input
                            type="file"
                            {...register('file')}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            accept=".pdf,.doc,.docx"
                        />
                        <div className="bg-blue-100 p-4 rounded-full mb-4 text-[#00008b] group-hover:scale-110 transition-transform">
                            <Upload size={32} />
                        </div>
                        <p className="text-sm font-bold text-gray-700 mb-1">
                            {selectedFile?.[0] ? selectedFile[0].name : 'Kéo thả hoặc Click để tải lên'}
                        </p>
                        <p className="text-xs text-gray-500">Hỗ trợ PDF, Word (Max 2MB)</p>
                    </div>
                    {errors.file && <p className="text-xs text-red-500">{errors.file.message as string}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Thư ngỏ (Cover Letter)</label>
                    <textarea
                        {...register('coverLetter')}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00008b] outline-none transition-all resize-none"
                        placeholder="Giới thiệu ngắn về bản thân..."
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-100">
                    <Link
                        href={`/tuyen-dung/${job.slug}`}
                        className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#00008b] transition-colors order-2 sm:order-1"
                    >
                        <ArrowLeft size={18} />
                        Quay lại
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:flex-1 bg-[#cc0022] hover:bg-red-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-red-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none order-1 sm:order-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                Gửi hồ sơ ứng tuyển
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
