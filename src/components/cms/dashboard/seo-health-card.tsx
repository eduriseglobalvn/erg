"use client"

import { useSeoHealth } from "@/hooks/use-seo"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/cms/ui/card"
import { Skeleton } from "@/components/cms/ui/skeleton"
import { Search, CheckCircle2, AlertTriangle, Link as LinkIcon, Download, Zap, TrendingUp, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function SeoHealthCard() {
    const { data: health, isLoading, isError } = useSeoHealth()

    if (isLoading) {
        return (
            <Card className="h-full border-none shadow-sm bg-white/50 dark:bg-zinc-900/50">
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <div className="space-y-3 flex-1">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (isError || !health) return null

    // Ensure score is valid to prevent NaN
    const score = health.score || 0
    const totalPosts = health.totalPosts || 0
    const totalOptimized = health.totalPostsWithSeo || 0
    const issues = health.issuesCount || 0
    const internalLinks = health.totalInternalLinks || 0

    const getScoreColor = (s: number) => {
        if (s >= 90) return "text-emerald-500"
        if (s >= 70) return "text-blue-500"
        if (s >= 50) return "text-amber-500"
        return "text-rose-500"
    }

    const getScoreGradient = (s: number) => {
        if (s >= 90) return "text-emerald-500" // Simple color for now as gradient on stroke needs ID defs
        if (s >= 70) return "text-blue-500"
        if (s >= 50) return "text-amber-500"
        return "text-rose-500"
    }

    // Circular Progress Settings
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
        <Card className="h-full border-none shadow-lg bg-white dark:bg-zinc-900 relative overflow-hidden group">
            {/* Background Gradient Blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

            <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            SEO Health Index
                        </CardTitle>
                        <CardDescription className="text-zinc-500">
                            Chấm điểm tiêu chuẩn SEO toàn trang
                        </CardDescription>
                    </div>
                    {/* Status Badge */}
                    <div className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border",
                        score >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                        {score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs Work"}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative z-10">
                <div className="flex flex-col xl:flex-row items-center gap-8">

                    {/* LEFT: Circular Guage */}
                    <div className="relative shrink-0 w-40 h-40 flex items-center justify-center">
                        {/* Outer Ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-zinc-100 dark:border-zinc-800" />

                        <svg className="transform -rotate-90 w-36 h-36">
                            {/* Track */}
                            <circle
                                cx="72"
                                cy="72"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-zinc-100 dark:text-zinc-800"
                            />
                            {/* Progress */}
                            <circle
                                cx="72"
                                cy="72"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={isNaN(strokeDashoffset) ? circumference : strokeDashoffset}
                                strokeLinecap="round"
                                className={cn("transition-all duration-1000 ease-out drop-shadow-sm", getScoreGradient(score))}
                            />
                        </svg>

                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={cn("text-4xl font-black tracking-tighter", getScoreColor(score))}>
                                {score}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score</span>
                        </div>
                    </div>

                    {/* RIGHT: Modern Grid Layout */}
                    <div className="flex-1 w-full grid grid-cols-2 gap-3">

                        {/* Item 1: Optimized Posts */}
                        <div className="group/item flex flex-col p-3 rounded-2xl bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-zinc-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded-md bg-white dark:bg-black shadow-sm text-green-600">
                                    <CheckCircle2 size={14} />
                                </div>
                                <span className="text-xs font-semibold text-zinc-500 uppercase">Đã Tối Ưu</span>
                            </div>
                            <div className="mt-auto">
                                <span className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{totalOptimized}</span>
                                <span className="text-xs text-zinc-400 font-medium ml-1">/ {totalPosts}</span>
                            </div>
                            {/* Tiny progress bar */}
                            <div className="h-1 w-full bg-zinc-200 rounded-full mt-2 overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${totalPosts > 0 ? (totalOptimized / totalPosts) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Item 2: Issues */}
                        <div className="group/item flex flex-col p-3 rounded-2xl bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-zinc-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={cn("p-1.5 rounded-md bg-white dark:bg-black shadow-sm", issues > 0 ? "text-red-500" : "text-zinc-400")}>
                                    <AlertTriangle size={14} />
                                </div>
                                <span className="text-xs font-semibold text-zinc-500 uppercase">Cần Xử Lý</span>
                            </div>
                            <div className="mt-auto flex items-baseline gap-1">
                                <span className={cn("text-xl font-bold", issues > 0 ? "text-red-600" : "text-zinc-800")}>
                                    {issues}
                                </span>
                                <span className="text-xs text-zinc-400 font-medium">lỗi</span>
                            </div>
                            {/* Tiny progress bar (always full red if issues exist) */}
                            <div className="h-1 w-full bg-zinc-200 rounded-full mt-2 overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full", issues > 0 ? "bg-red-500" : "bg-zinc-300")}
                                    style={{ width: issues > 0 ? '60%' : '0%' }}
                                />
                            </div>
                        </div>

                        {/* Item 3: Internal Links */}
                        <div className="group/item flex flex-col p-3 rounded-2xl bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-zinc-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded-md bg-white dark:bg-black shadow-sm text-blue-500">
                                    <LinkIcon size={14} />
                                </div>
                                <span className="text-xs font-semibold text-zinc-500 uppercase">Liên kết trong</span>
                            </div>
                            <div className="mt-auto">
                                <span className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{internalLinks.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Item 4: GSC Sync Status */}
                        <div className="group/item flex flex-col p-3 rounded-2xl bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-zinc-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded-md bg-white dark:bg-black shadow-sm text-purple-500">
                                    <Download size={14} />
                                </div>
                                <span className="text-xs font-semibold text-zinc-500 uppercase">Đồng bộ GSC</span>
                            </div>
                            <div className="mt-auto">
                                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate block">
                                    {health.lastGscSync ? new Date(health.lastGscSync).toLocaleDateString('vi-VN') : 'Chưa Sync'}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
