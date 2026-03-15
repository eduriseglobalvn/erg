"use client"

import * as React from "react"
import { useSeoAnalysis } from "@/hooks/use-seo"
import { useQuery } from "@tanstack/react-query"
import { seoApi } from "@/services/seo.api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Progress } from "@/components/admin/ui/progress"
import { Badge } from "@/components/admin/ui/badge"
import { ScrollArea } from "@/components/admin/ui/scroll-area"
import {
    CopyCheck,
    Link as LinkIcon,
    Loader2,
    Sparkles,
    ChevronDown,
    ChevronUp,
    History,
    Search,
    FileText,
    Settings,
    Lightbulb,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    XCircle
} from "lucide-react"
import {
    LineChart,
    Line,
    ResponsiveContainer,
    YAxis
} from 'recharts'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/admin/ui/collapsible"
import { aiApi } from "@/services/ai.api"
import { cn } from "@/lib/utils"

import { localSeoAnalyzer } from "@/utils/local-seo"
import { Button } from "@/components/admin/ui/button"
import { toast } from "sonner"
import { useCheckSeoDuplicate, useApplySeoAutolinks } from "@/hooks/use-seo"

interface SeoAnalysisPanelProps {
    postId: string
    className?: string
    liveData?: {
        title: string
        content: string
        metaDescription: string
        keyword?: string
        slug?: string
    }
}

export function SeoAnalysisPanel({ postId, className, liveData }: SeoAnalysisPanelProps) {
    // 1. Fetch API Data (Lấy dữ liệu gốc/lịch sử)
    const { data: serverAnalysis, isLoading, isError } = useSeoAnalysis(postId)

    // 2. Fetch Score History
    const { data: scoreHistory } = useQuery({
        queryKey: ['seoTrends', postId],
        queryFn: () => seoApi.getTrends(postId),
        enabled: !!postId
    })

    // 2. Tính toán Local Data (Nếu có liveData)
    const analysis = React.useMemo(() => {
        if (liveData) {
            // Thực hiện phân tích ngay lập tức
            const localResult = localSeoAnalyzer(
                liveData.content || "",
                liveData.title || "",
                liveData.metaDescription || "",
                liveData.keyword || "",
                liveData.slug || ""
            );

            // Merge với serverAnalysis (đối với các trường khó tính ở client như Schema, Backlinks...)
            if (serverAnalysis) {
                return {
                    ...serverAnalysis,
                    ...localResult, // Ghi đè các chỉ số content bằng tính toán mới nhất
                    overallScore: localResult.overallScore, // Ưu tiên điểm số realtime
                    suggestions: [...localResult.suggestions, ...(serverAnalysis.suggestions || [])].slice(0, 10)
                };
            }
            return localResult;
        }
        return serverAnalysis;
    }, [liveData, serverAnalysis]);

    if (isLoading && !analysis) { // Chỉ hiện loading nếu chưa có cả data cũ lẫn mới
        return (
            <div className="p-4 space-y-4 animate-pulse">
                <div className="h-20 bg-muted rounded-lg" />
                <div className="h-40 bg-muted rounded-lg" />
            </div>
        )
    }

    if (isError && !analysis) {
        return (
            <div className="p-4 text-center">
                <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Không thể tải dữ liệu phân tích SEO</p>
            </div>
        )
    }

    const {
        overallScore = 0,
        suggestions = [],
        titleAnalysis = { length: 0, hasKeyword: false, suggestions: [] },
        metaAnalysis = { length: 0, hasKeyword: false, suggestions: [] },
        contentAnalysis = {
            wordCount: 0,
            keywordDensity: 0,
            readabilityScore: 0,
            headingStructure: { h1: 0, h2: 0, h3: 0, valid: false },
            paragraphCount: 0
        },
        technicalAnalysis = {
            hasCanonical: false,
            hasSchema: false,
            imageAltTags: { total: 0, withAlt: 0 },
            internalLinks: 0,
            externalLinks: 0
        }
    } = analysis || {}

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500"
        if (score >= 50) return "text-amber-500"
        return "text-red-500"
    }

    // [NEW] Hooks for Actions
    const { mutate: checkDuplicate, isPending: isCheckingDuplicate } = useCheckSeoDuplicate()
    const { mutate: applyAutolinks, isPending: isApplyingLinks } = useApplySeoAutolinks()

    const handleCheckDuplicate = () => {
        if (!liveData?.content) return;
        checkDuplicate({ content: liveData.content, currentPostId: postId }, {
            onSuccess: (data) => {
                if (data.similarity > 0.5) {
                    toast.warning(`Phát hiện trùng lặp ${Math.round(data.similarity * 100)}% với bài viết: ${data.duplicatePosts[0].title}`)
                } else {
                    toast.success("Nội dung Unique! Không phát hiện trùng lặp đáng kể.")
                }
            }
        })
    }

    const handleApplyLinks = () => {
        applyAutolinks(postId, {
            onSuccess: () => {
                toast.success("Đã tự động gắn link nội bộ thành công! Vui lòng reload để thấy thay đổi.")
            }
        })
    }

    const [isAIOptimizing, setIsAIOptimizing] = React.useState(false)

    const handleAIOptimize = async (instruction: string) => {
        if (!liveData?.content) return;
        setIsAIOptimizing(true);
        try {
            await aiApi.refine({
                text: instruction === 'content' ? liveData.content :
                    instruction === 'title' ? liveData.title : liveData.metaDescription,
                instruction: `Tối ưu SEO cho ${instruction}: Chứa từ khóa chính "${liveData.keyword}", hấp dẫn, chuẩn kỹ thuật.`
            });
            toast.info("AI đã tạo gợi ý tối ưu. Hãy kiểm tra nội dung bài viết.");
        } catch (e) {
            toast.error("Không thể tối ưu bằng AI.");
        } finally {
            setIsAIOptimizing(false);
        }
    }

    return (
        <div className={cn("flex flex-col h-full bg-transparent", className)}>
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {/* Overall Score Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-tight">SEO Score</span>
                            <span className={cn("text-2xl font-black", getScoreColor(overallScore))}>
                                {overallScore}/100
                            </span>
                        </div>
                        <Progress value={overallScore} className="h-2.5" />

                        {/* [NEW] Quick Actions */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <Button
                                variant="outline" size="sm"
                                className="text-[10px] h-8"
                                onClick={handleCheckDuplicate}
                                disabled={isCheckingDuplicate}
                            >
                                {isCheckingDuplicate ? <Loader2 className="w-3 h-3 animate-spin" /> : <CopyCheck className="w-3 h-3 mr-1" />}
                                Check Duplicate
                            </Button>
                            <Button
                                variant="outline" size="sm"
                                className="text-[10px] h-8"
                                onClick={handleApplyLinks}
                                disabled={isApplyingLinks}
                            >
                                {isApplyingLinks ? <Loader2 className="w-3 h-3 animate-spin" /> : <LinkIcon className="w-3 h-3 mr-1" />}
                                Auto Link
                            </Button>
                        </div>

                        {/* [NEW] Score History Sparkline */}
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

                        <p className="text-[11px] text-muted-foreground italic">
                            {overallScore >= 80
                                ? "✨ Tuyệt vời! Bài viết của bạn đã tối ưu SEO cực tốt."
                                : overallScore >= 50
                                    ? "⚠️ Khá tốt, nhưng vẫn cần cải thiện thêm một vài điểm."
                                    : "❌ Cảnh báo! Bài viết này chưa đạt chuẩn SEO tối thiểu."}
                        </p>
                    </div>

                    {/* Analysis Categories */}
                    <div className="space-y-4">
                        {/* ... Existing categories ... */}
                        {/* 1. Metadata Analysis */}
                        <AnalysisCategory
                            title="Metadata & Headings"
                            icon={<Search className="w-4 h-4" />}
                            defaultOpen={true}
                            action={<Button variant="ghost" size="icon" className="h-6 w-6" title="AI Optimize Title" onClick={() => handleAIOptimize('title')} disabled={isAIOptimizing}><Sparkles className="w-3 h-3 text-indigo-500" /></Button>}
                        >
                            <CheckItem
                                label="Tiêu đề (Title)"
                                status={titleAnalysis.length >= 40 && titleAnalysis.length <= 60 ? 'success' : 'warning'}
                                message={`${titleAnalysis.length} ký tự (Tối ưu: 40-60)`}
                                suggestions={titleAnalysis.suggestions}
                            />
                            <CheckItem
                                label="Mô tả (Meta Description)"
                                status={metaAnalysis.length >= 120 && metaAnalysis.length <= 160 ? 'success' : 'warning'}
                                message={`${metaAnalysis.length} ký tự (Tối ưu: 120-160)`}
                                suggestions={metaAnalysis.suggestions}
                            />
                            <CheckItem
                                label="Cấu trúc Headings"
                                status={contentAnalysis.headingStructure.valid ? 'success' : 'error'}
                                message={contentAnalysis.headingStructure.valid
                                    ? "Cấu trúc tiêu đề đúng chuẩn"
                                    : "Thiếu H1 hoặc cấu trúc H1->H2 lộn xộn"}
                            />
                        </AnalysisCategory>

                        {/* 2. Content Analysis */}
                        <AnalysisCategory
                            title="Phân tích nội dung"
                            icon={<FileText className="w-4 h-4" />}
                            action={<Button variant="ghost" size="icon" className="h-6 w-6" title="AI Optimize Content" onClick={() => handleAIOptimize('content')} disabled={isAIOptimizing}><Sparkles className="w-3 h-3 text-indigo-500" /></Button>}
                        >
                            <CheckItem
                                label="Độ dài bài viết"
                                status={contentAnalysis.wordCount >= 600 ? 'success' : 'warning'}
                                message={`${contentAnalysis.wordCount} từ (Mục tiêu: >600)`}
                            />
                            <CheckItem
                                label="Mật độ từ khóa"
                                status={contentAnalysis.keywordDensity >= 0.5 && contentAnalysis.keywordDensity <= 2.5 ? 'success' : 'warning'}
                                message={`${contentAnalysis.keywordDensity.toFixed(1)}% (Tối ưu: 0.5-2.5%)`}
                            />
                            <CheckItem
                                label="Chỉ số dễ đọc"
                                status={contentAnalysis.readabilityScore >= 60 ? 'success' : 'warning'}
                                message={`${contentAnalysis.readabilityScore.toFixed(0)}/100 (Càng cao càng tốt)`}
                            />
                        </AnalysisCategory>

                        {/* 3. Technical SEO */}
                        <AnalysisCategory
                            title="Kỹ thuật & Liên kết"
                            icon={<Settings className="w-4 h-4" />}
                        >
                            <CheckItem
                                label="Ảnh (Alt tags)"
                                status={technicalAnalysis.imageAltTags.withAlt === technicalAnalysis.imageAltTags.total ? 'success' : 'error'}
                                message={`${technicalAnalysis.imageAltTags.withAlt}/${technicalAnalysis.imageAltTags.total} ảnh đã có alt tag`}
                            />
                            <CheckItem
                                label="Liên kết nội bộ"
                                status={technicalAnalysis.internalLinks > 0 ? 'success' : 'warning'}
                                message={`Đã thêm ${technicalAnalysis.internalLinks} link nội bộ`}
                            />
                            <CheckItem
                                label="Schema Markup"
                                status={technicalAnalysis.hasSchema ? 'success' : 'error'}
                                message={technicalAnalysis.hasSchema ? "Đã cấu hình Schema" : "Chưa có JSON-LD Schema"}
                            />
                        </AnalysisCategory>
                    </div>

                    {/* Suggestions Section */}
                    {/* ... Existing suggestions ... */}
                    <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-purple-600" />
                            <h3 className="text-sm font-bold text-purple-900 dark:text-purple-300 uppercase tracking-tight">Gợi ý hành động</h3>
                        </div>
                        <ul className="space-y-3">
                            {suggestions.map((suggestion, index) => (
                                <li key={index} className="flex gap-2 text-xs text-purple-800 dark:text-purple-400 leading-relaxed font-medium">
                                    <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" />
                                    {suggestion}
                                </li>
                            ))}
                            {suggestions.length === 0 && (
                                <li className="text-xs text-muted-foreground text-center py-2 italic">
                                    Không có gợi ý nào thêm. Bài viết của bạn đã rất tốt!
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

function AnalysisCategory({ title, icon, children, defaultOpen = false, action }: { title: string, icon: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean, action?: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{icon}</span>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 group-hover:text-foreground transition-colors">{title}</h3>
                        {isOpen ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                    </div>
                </CollapsibleTrigger>
                {action}
            </div>
            <CollapsibleContent>
                <div className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-border">
                        {children}
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}

function CheckItem({ label, status, message, suggestions }: { label: string, status: 'success' | 'warning' | 'error', message: string, suggestions?: string[] }) {
    const Icon = status === 'success' ? CheckCircle2 : status === 'warning' ? AlertCircle : XCircle
    const colorClass = status === 'success' ? 'text-green-500' : status === 'warning' ? 'text-amber-500' : 'text-red-500'
    const [showSuggestions, setShowSuggestions] = React.useState(false)

    return (
        <div className="p-3 flex flex-col transition-colors hover:bg-gray-50/50 dark:hover:bg-white/5">
            <div className="flex items-start gap-3">
                <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", colorClass)} />
                <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-foreground">{label}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{message}</p>
                </div>
                {suggestions && suggestions.length > 0 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                    >
                        <Lightbulb className={cn("w-3.5 h-3.5", showSuggestions ? "text-amber-500" : "text-slate-400")} />
                    </Button>
                )}
            </div>
            {showSuggestions && suggestions && (
                <div className="mt-2 ml-7 p-2 bg-amber-50/50 rounded border border-amber-100 text-[10px] text-amber-900 border-dashed">
                    <p className="font-bold mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Gợi ý tối ưu:</p>
                    <ul className="list-disc list-inside space-y-1">
                        {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            )}
        </div>
    )
}
