"use client";

import { CheckCircle2, Clock, XCircle, RefreshCw, ChevronRight, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";
import { Progress } from "@/components/admin/ui/progress";
import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils";

export type PipelineStep = 'DISCOVER' | 'SCRAPE' | 'PROCESS' | 'SEO' | 'PUBLISH';

export interface PipelineStatusProps {
    jobId?: string; // Phase 4.5: SSE job ID for unique keying
    url: string;
    source: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    currentStep: PipelineStep;
    progress: number;
    timeStarted: string;
    message?: string;
    qualityScore?: number; // NEW: 0-100 quality score assigned after completion
    onRetry?: () => void;
}

const STEPS: PipelineStep[] = ['DISCOVER', 'SCRAPE', 'PROCESS', 'SEO', 'PUBLISH'];

const STEP_LABELS: Record<PipelineStep, string> = {
    DISCOVER: 'Tìm kiếm',
    SCRAPE: 'Cào dữ liệu',
    PROCESS: 'Xử lý nội dung',
    SEO: 'Tối ưu SEO',
    PUBLISH: 'Đăng tải',
};

export function PipelineStatus({ url, source, status, currentStep, progress, timeStarted, message, qualityScore, onRetry }: PipelineStatusProps) {

    const getCurrentStepIndex = () => {
        if (status === 'COMPLETED') return STEPS.length;
        if (status === 'PENDING') return -1;
        return STEPS.indexOf(currentStep);
    };

    const currentIndex = getCurrentStepIndex();

    return (
        <Card className={`overflow-hidden border-l-4 ${status === 'FAILED' ? 'border-l-red-500' : (status === 'COMPLETED' ? 'border-l-green-500' : 'border-l-blue-500')} shadow-sm`}>
            <div className="bg-slate-50/50 p-3 border-b flex justify-between items-start">
                <div className="flex-1 overflow-hidden pr-4">
                    <a href={url} target="_blank" rel="noreferrer" className="text-sm font-semibold truncate block hover:text-blue-600 hover:underline">
                        {url}
                    </a>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] h-4 py-0 leading-none">{source}</Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center">
                            <Clock className="w-3 h-3 mr-1 inline" /> {timeStarted}
                        </span>
                    </div>
                </div>

                {status === 'PROCESSING' && <Badge variant="secondary" className="bg-blue-100 text-blue-800 animate-pulse border-blue-200 shadow-none"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> ĐANG Chạy</Badge>}
                {status === 'FAILED' && <Badge variant="destructive" className="shadow-none flex gap-1"><AlertCircle className="w-3 h-3" /> LỖI</Badge>}
                {status === 'COMPLETED' && <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 shadow-none flex gap-1"><CheckCircle2 className="w-3 h-3" /> THÀNH CÔNG</Badge>}
                {status === 'PENDING' && <Badge variant="outline" className="shadow-none">ĐANG CHỜ</Badge>}
            </div>

            <CardContent className="p-4">
                {/* Stepper Header */}
                <div className="flex items-center justify-between mb-4 relative">
                    {/* Background Line */}
                    <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 -z-10" />

                    {/* Active Line */}
                    <div
                        className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 -z-10 transition-all duration-500"
                        style={{ width: `${currentIndex > 0 ? (Math.min(currentIndex, STEPS.length - 1) / (STEPS.length - 1)) * 80 : 0}%` }}
                    />

                    {STEPS.map((step, index) => {
                        const isCompleted = index < currentIndex || status === 'COMPLETED';
                        const isCurrent = index === currentIndex && status !== 'COMPLETED';
                        const isFailed = isCurrent && status === 'FAILED';

                        return (
                            <div key={step} className="flex flex-col items-center gap-1.5 w-1/5 bg-white z-0">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                                    ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' :
                                        isCurrent && !isFailed ? 'bg-white border-blue-600 text-blue-600 shadow-[0_0_0_3px_rgba(59,130,246,0.2)]' :
                                            isFailed ? 'bg-red-500 border-red-500 text-white' :
                                                'bg-white border-slate-200 text-slate-400'}`}
                                >
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> :
                                        isFailed ? <XCircle className="w-4 h-4" /> :
                                            isCurrent ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> :
                                                (index + 1)}
                                </div>
                                <span className={`text-[9px] font-medium uppercase tracking-wider hidden sm:block text-center
                                    ${isCompleted || isCurrent ? 'text-slate-800' : 'text-slate-400'}
                                    ${isFailed ? 'text-red-600' : ''}
                                `}>
                                    {STEP_LABELS[step]}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* Status Message & Progress */}
                {(status === 'PROCESSING' || status === 'PENDING') && (
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-slate-700 font-mono flex items-center gap-2">
                                <ChevronRight className="w-3 h-3" />
                                {message || `Đang thực thi: ${STEP_LABELS[currentStep] || 'Vui lòng chờ'}...`}
                            </span>
                            <span className="text-xs font-bold text-blue-600">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                    </div>
                )}

                {/* Error & Retry */}
                {status === 'FAILED' && (
                    <div className="bg-red-50 rounded-lg p-3 border border-red-100 flex items-start justify-between">
                        <div className="flex gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-red-800">Tiến trình đã lỗi tại bước {STEP_LABELS[currentStep]}</h4>
                                <p className="text-xs text-red-600 mt-1 line-clamp-2">{message || "Có lỗi không xác định đã xảy ra trong quá trình thực thi."}</p>
                            </div>
                        </div>
                        {onRetry && (
                            <Button size="sm" variant="outline" className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-100 shrink-0" onClick={onRetry}>
                                Thử lại
                            </Button>
                        )}
                    </div>
                )}

                {/* Success State */}
                {status === 'COMPLETED' && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100 flex items-center justify-between gap-3">
                        <div className="flex gap-2 items-center min-w-0">
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            <span className="text-sm font-medium text-green-800">Bài viết đã được đăng tải thành công!</span>
                            {qualityScore !== undefined && (
                                <Badge
                                    className={cn(
                                        "shrink-0 shadow-none",
                                        qualityScore >= 85
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : qualityScore >= 70
                                            ? "bg-amber-100 text-amber-800 border-amber-200"
                                            : "bg-red-100 text-red-800 border-red-200"
                                    )}
                                >
                                    📊 Quality: {qualityScore}/100
                                </Badge>
                            )}
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs border-green-200 text-green-700 hover:bg-green-100 shadow-none shrink-0">
                            Xem bài viết
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
