"use client"

import * as React from "react"
import { Progress } from "@/components/admin/ui/progress"
import { Button } from "@/components/admin/ui/button"
import {
    CopyCheck,
    Link as LinkIcon,
    Loader2,
    History,
    Sparkles,
} from "lucide-react"
import {
    LineChart,
    Line,
    ResponsiveContainer,
    YAxis
} from 'recharts'
import { cn } from "@/lib/utils"

interface SeoScoreCardProps {
    overallScore: number
    scoreHistory?: { score: number }[]
    isCheckingDuplicate?: boolean
    isApplyingLinks?: boolean
    onCheckDuplicate?: () => void
    onApplyLinks?: () => void
}

export function SeoScoreCard({
    overallScore,
    scoreHistory,
    isCheckingDuplicate,
    isApplyingLinks,
    onCheckDuplicate,
    onApplyLinks,
}: SeoScoreCardProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500"
        if (score >= 50) return "text-amber-500"
        return "text-red-500"
    }

    const getScoreMessage = (score: number) => {
        if (score >= 80) return "Tuyệt vời! Bài viết của bạn đã tối ưu SEO cực tốt."
        if (score >= 50) return "Khá tốt, nhưng vẫn cần cải thiện thêm một vài điểm."
        return "Cảnh báo! Bài viết này chưa đạt chuẩn SEO tối thiểu."
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border shadow-sm space-y-4">
            {/* Score header */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-tight">SEO Score</span>
                <span className={cn("text-2xl font-black", getScoreColor(overallScore))}>
                    {overallScore}/100
                </span>
            </div>

            {/* Progress bar */}
            <Progress value={overallScore} className="h-2.5" />

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                    variant="outline" size="sm"
                    className="text-[10px] h-8"
                    onClick={onCheckDuplicate}
                    disabled={isCheckingDuplicate}
                >
                    {isCheckingDuplicate ? <Loader2 className="w-3 h-3 animate-spin" /> : <CopyCheck className="w-3 h-3 mr-1" />}
                    Check Duplicate
                </Button>
                <Button
                    variant="outline" size="sm"
                    className="text-[10px] h-8"
                    onClick={onApplyLinks}
                    disabled={isApplyingLinks}
                >
                    {isApplyingLinks ? <Loader2 className="w-3 h-3 animate-spin" /> : <LinkIcon className="w-3 h-3 mr-1" />}
                    Auto Link
                </Button>
            </div>

            {/* Score history sparkline */}
            {scoreHistory && scoreHistory.length > 1 && (
                <div className="pt-2 border-t mt-2">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                        <span className="flex items-center gap-1"><History className="w-3 h-3" /> Lịch sử điểm số</span>
                        <span>{scoreHistory.length} lần sửa</span>
                    </div>
                    <div className="h-10 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={scoreHistory}>
                                <YAxis domain={[0, 100]} hide />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#4f46e5"
                                    strokeWidth={2}
                                    dot={false}
                                    animationDuration={1000}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Score message */}
            <p className="text-[11px] text-muted-foreground italic">
                {getScoreMessage(overallScore)}
            </p>
        </div>
    )
}
