"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import {
    Globe,
    CheckCircle2,
    XCircle,
    Activity,
    Clock,
    Database,
    Zap,
    ExternalLink,
    PlayCircle,
    PlusCircle,
    Settings,
    Brain,
    TrendingUp,
    AlertTriangle,
} from "lucide-react"
import { crawlerApi, CrawlerStats, CrawlHistoryItem, AiQuotaResponse, QualityStats, DedupStats } from "@/services/crawler.api"
import { trendingApi, TrendingStats } from "@/services/trending.api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Progress } from "@/components/admin/ui/progress"
import { Skeleton } from "@/components/admin/ui/skeleton"
import { Badge } from "@/components/admin/ui/badge"
import { PipelineStatus } from "@/components/admin/crawler/pipeline-status"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"

// --- AI Quota Key Breakdown (collapsible) ---
interface AiQuotaKeyItem {
    label: string;
    status: string;
    todayUsage: number;
    maxDaily: number;
}

function AIQuotaKeyList({ keys }: { keys: AiQuotaKeyItem[] }) {
    const [expanded, setExpanded] = useState(false)

    const visibleKeys = expanded ? keys : keys.slice(0, 2)
    const usagePercent = (k: AiQuotaKeyItem) => Math.round((k.todayUsage / k.maxDaily) * 100)

    return (
        <div className="pt-1 border-t border-muted/50">
            <button
                onClick={() => setExpanded(e => !e)}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors mb-1.5"
                aria-label={expanded ? "Thu gọn danh sách key" : "Mở rộng danh sách key"}
            >
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                <span>Chi tiết từng key ({keys.length})</span>
            </button>
            <div className="space-y-1.5">
                {visibleKeys.map((key, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                key.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-300'
                            )} />
                            <span className="text-[10px] font-medium text-muted-foreground truncate">{key.label}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all",
                                        usagePercent(key) < 60 ? "bg-green-500" :
                                        usagePercent(key) < 85 ? "bg-amber-500" : "bg-red-500"
                                    )}
                                    style={{ width: `${Math.min(100, usagePercent(key))}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground w-16 text-right">
                                {key.todayUsage}/{key.maxDaily}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function CrawlerDashboardPage() {
    // 1. Fetch Stats
    const { data: statsData, isLoading: isLoadingStats } = useQuery({
        queryKey: ['crawler', 'stats'],
        queryFn: () => crawlerApi.getStats(),
        refetchInterval: 30000 // Poll stats every 30s
    })

    const stats = statsData;

    // 2. Fetch Recent History
    const { data: historyData, isLoading: isLoadingHistory } = useQuery({
        queryKey: ['crawler', 'history', 'recent'],
        queryFn: () => crawlerApi.getHistory(1, 10),
        refetchInterval: 15000 // Poll history every 15s
    })

    const history = historyData?.items || []

    // 3. Fetch Active Pipelines (fallback only — primary source is SSE via ssePipelines state)
    // Set to 60s so the page still shows data if SSE connection is unavailable
    const { data: fallbackPipelines, isLoading: isLoadingPipelines } = useQuery({
        queryKey: ['crawler', 'pipelines', 'active'],
        queryFn: () => crawlerApi.getActivePipelines(),
        refetchInterval: 60_000, // 60s fallback when SSE is unavailable
    })

    // ─── [Phase 4.5] SSE: Real-time Pipeline Updates ─────────────────────────────────
    // Local state for SSE-derived pipeline data (replaces polling refetchInterval: 3000)
    const [ssePipelines, setSsePipelines] = useState<any[]>([]);
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Build SSE URL — points to the Next.js API route that proxies to the NestJS backend
        // In dev/prod this goes through Next.js, so the path matches the mounted route
        const sseUrl = '/api/crawler/stream';

        const connect = () => {
            // Close any existing connection
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            const es = new EventSource(sseUrl);
            eventSourceRef.current = es;

            // ── Initial snapshot (sent once when client first connects) ──
            es.addEventListener('crawl-initial', (e) => {
                try {
                    const initial: any[] = JSON.parse(e.data);
                    setSsePipelines(initial);
                } catch {
                    // ignore parse errors
                }
            });

            // ── Progress update ────────────────────────────────────────────
            es.addEventListener('crawl-progress', (e) => {
                try {
                    const data = JSON.parse(e.data);
                    setSsePipelines(prev => {
                        // Replace the entry for this jobId, or append if new
                        const without = prev.filter(p => p.jobId !== data.jobId);
                        return [...without, data];
                    });
                } catch {
                    // ignore parse errors
                }
            });

            // ── Job completed ──────────────────────────────────────────────
            es.addEventListener('crawl-complete', (e) => {
                try {
                    const data = JSON.parse(e.data);
                    // Remove from active pipelines (it's done)
                    setSsePipelines(prev => prev.filter(p => p.jobId !== data.jobId));
                } catch {
                    // ignore
                }
            });

            // ── Job failed ─────────────────────────────────────────────────
            es.addEventListener('crawl-error', (e) => {
                try {
                    const data = JSON.parse(e.data);
                    setSsePipelines(prev => {
                        const without = prev.filter(p => p.jobId !== data.jobId);
                        return [...without, data]; // keep it visible with FAILED badge
                    });
                } catch {
                    // ignore
                }
            });

            // ── Connection drop → reconnect after 3 seconds ────────────────
            es.onerror = () => {
                es.close();
                if (!reconnectTimerRef.current) {
                    reconnectTimerRef.current = setTimeout(() => {
                        reconnectTimerRef.current = null;
                        connect();
                    }, 3000);
                }
            };
        };

        connect();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
        };
    }, []);

    // Primary source: SSE-driven state; fallback: REST polling snapshot
    const pipelines = ssePipelines.length > 0 ? ssePipelines : (fallbackPipelines || [])

    // 4. Fetch AI Quota
    const { data: aiQuotaData, isLoading: isLoadingAiQuota } = useQuery<AiQuotaResponse>({
        queryKey: ['crawler', 'ai-quota'],
        queryFn: () => crawlerApi.getAiQuota(),
        refetchInterval: 60000, // Refresh every 1 minute
    })

    const aiQuota = aiQuotaData

    // 5. Fetch Quality Stats
    const { data: qualityStatsData, isLoading: isLoadingQualityStats } = useQuery<QualityStats>({
        queryKey: ['crawler', 'quality-stats'],
        queryFn: () => crawlerApi.getQualityStats(),
        refetchInterval: 30000, // Refresh every 30s
    })

    const qualityStats = qualityStatsData

    // 6. Fetch Dedup Stats (Phase 2.1)
    const { data: dedupStatsData, isLoading: isLoadingDedupStats } = useQuery<DedupStats>({
        queryKey: ['crawler', 'dedup-stats'],
        queryFn: () => crawlerApi.getDedupStats(),
        refetchInterval: 30000, // Refresh every 30s
    })

    const dedupStats = dedupStatsData

    // 7. Fetch Trending Stats (Phase 2.2)
    const { data: trendingStatsData } = useQuery<TrendingStats>({
        queryKey: ['trending', 'stats'],
        queryFn: () => trendingApi.getStats(),
        refetchInterval: 300000, // Refresh every 5 minutes
    })

    const trendingStats = trendingStatsData

    return (
        <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary uppercase mb-2">Crawler Dashboard</h1>
                    <p className="text-muted-foreground">
                        Theo dõi tình trạng cào dữ liệu tự động từ các nguồn RSS và Website.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/crawler/rss/wizard">
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                            <PlusCircle className="mr-2 h-4 w-4" /> Thêm RSS (Wizard)
                        </Button>
                    </Link>
                    <Link href="/admin/crawler/rss">
                        <Button variant="outline">
                            <Settings className="mr-2 h-4 w-4" /> Quản lý Nguồn tin
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-primary shadow-sm">
                    <CardHeader className="py-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tổng nguồn tin</CardTitle>
                        <Globe className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingStats ? <Skeleton className="h-8 w-20" /> : (
                            <div className="text-2xl font-bold">{stats?.totalRss || 0}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1 text-nowrap">Nguồn RSS đang hoạt động</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-sky-500 shadow-sm">
                    <CardHeader className="py-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tổng bài viết</CardTitle>
                        <Database className="h-4 w-4 text-sky-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingStats ? <Skeleton className="h-8 w-20" /> : (
                            <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Bài viết trong hệ thống</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 shadow-sm">
                    <CardHeader className="py-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Cấu hình Domain</CardTitle>
                        <Activity className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingStats ? <Skeleton className="h-8 w-20" /> : (
                            <div className="text-2xl font-bold">{stats?.totalConfigs || 0}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Selector riêng từng trang</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="py-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tổng lượt chạy</CardTitle>
                        <Zap className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingStats ? <Skeleton className="h-8 w-20" /> : (
                            <div className="text-2xl font-bold">{stats?.totalHistory || 0}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Lần thực thi cào tin</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="py-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tỷ lệ thành công</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {isLoadingStats ? <Skeleton className="h-8 w-20" /> : (
                            <div className="text-2xl font-bold">{stats?.totalHistory ? Math.round((stats.successCrawl / stats.totalHistory!) * 100) : 0}%</div>
                        )}
                        <Progress value={stats?.totalHistory ? Math.round((stats.successCrawl / stats.totalHistory) * 100) : 0} className="h-1.5" />
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardHeader className="py-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Lượt lỗi</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingStats ? <Skeleton className="h-8 w-20" /> : (
                            <div className="text-2xl font-bold">{stats?.failedCrawl || 0}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Lượt thất bại</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quality Gate Stats Card */}
            <Card className="shadow-sm border-l-4 border-l-violet-500">
                <CardHeader className="py-4 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Chất lượng hôm nay</CardTitle>
                            {isLoadingQualityStats ? (
                                <Skeleton className="h-8 w-20 mt-1" />
                            ) : (
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-2xl font-bold text-violet-700">{qualityStats?.passRate ?? 0}%</span>
                                    <span className="text-xs text-muted-foreground">tỷ lệ đạt chuẩn</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {qualityStats ? (
                            <Badge className={
                                qualityStats.passRate >= 80 ? 'bg-green-100 text-green-800 border-green-200 shadow-none' :
                                qualityStats.passRate >= 60 ? 'bg-amber-100 text-amber-800 border-amber-200 shadow-none' :
                                'bg-red-100 text-red-800 border-red-200 shadow-none'
                            }>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {qualityStats.passedCount}/{qualityStats.totalToday} bài đạt
                            </Badge>
                        ) : isLoadingQualityStats ? (
                            <Skeleton className="h-6 w-28" />
                        ) : null}
                        <Brain className="h-4 w-4 text-violet-500" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {isLoadingQualityStats ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-2 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ) : qualityStats ? (
                        <>
                            {/* Progress bar: passed (green) vs total */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Tiến độ chất lượng</span>
                                    <span className="font-medium">
                                        {qualityStats.passedCount}/{qualityStats.totalToday} bài
                                    </span>
                                </div>
                                <div className="relative h-2 w-full overflow-hidden rounded-full bg-red-200">
                                    <div
                                        className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
                                        style={{ width: `${qualityStats.passRate}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Đạt chuẩn
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Thất bại
                                    </span>
                                </div>
                            </div>

                            {/* Top reject reasons */}
                            {qualityStats.topRejectReasons && qualityStats.topRejectReasons.length > 0 && (
                                <div className="pt-1">
                                    <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">Lý do từ chối hàng đầu</p>
                                    <div className="space-y-1">
                                        {qualityStats.topRejectReasons.slice(0, 3).map((reason, index) => (
                                            <div key={index} className="flex items-center justify-between text-xs">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                                    <span className="text-muted-foreground font-mono text-[10px]">{reason.reason}</span>
                                                </span>
                                                <Badge variant="outline" className="h-5 text-[10px] px-1.5 py-0 border-red-200 text-red-600 bg-red-50 shadow-none font-medium">
                                                    {reason.count} bài
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-16 text-xs text-muted-foreground italic">
                            Chưa có dữ liệu chất lượng hôm nay
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Phase 2.1: Content Dedup Stats Card */}
            <Card className="shadow-sm border-l-4 border-l-orange-400">
                <CardHeader className="py-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Content Dedup</CardTitle>
                        {isLoadingDedupStats ? (
                            <div className="h-8 w-16 mt-1 bg-muted animate-pulse rounded" />
                        ) : (
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-2xl font-bold text-orange-700">
                                    {dedupStats?.totalFingerprints?.toLocaleString('vi-VN') ?? 0}
                                </span>
                                <span className="text-xs text-muted-foreground">fingerprints</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {dedupStats ? (
                            <Badge className={
                                dedupStats.dedupRate > 15
                                    ? 'bg-red-100 text-red-800 border-red-200 shadow-none'
                                    : 'bg-green-100 text-green-800 border-green-200 shadow-none'
                            }>
                                {dedupStats.dedupRate > 15 ? '⚠️ Cao' : '🟢 Ổn'}
                            </Badge>
                        ) : isLoadingDedupStats ? (
                            <Skeleton className="h-6 w-16" />
                        ) : null}
                        <span className="text-xs text-gray-400">Hôm nay</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {isLoadingDedupStats ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-2 w-full" />
                            <div className="grid grid-cols-2 gap-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    ) : dedupStats ? (
                        <>
                            {/* Dedup Rate Progress */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Tỷ lệ trùng lặp</span>
                                    <span className={`font-medium ${dedupStats.dedupRate > 15 ? 'text-red-500' : 'text-green-600'}`}>
                                        {dedupStats.dedupRate}%
                                    </span>
                                </div>
                                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                                            dedupStats.dedupRate > 15 ? 'bg-red-400' : 'bg-green-400'
                                        }`}
                                        style={{ width: `${Math.min(dedupStats.dedupRate * 4, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center rounded-lg bg-gray-50 p-2">
                                    <p className="text-lg font-bold text-gray-800">
                                        {dedupStats.totalFingerprints.toLocaleString('vi-VN')}
                                    </p>
                                    <p className="text-xs text-gray-400">Tổng fingerprints</p>
                                </div>
                                <div className="text-center rounded-lg bg-red-50 p-2">
                                    <p className="text-lg font-bold text-red-600">
                                        {dedupStats.duplicatesDetectedToday}
                                    </p>
                                    <p className="text-xs text-gray-400">Phát hiện trùng</p>
                                </div>
                            </div>

                            {/* Warning Alert */}
                            {dedupStats.dedupRate > 15 && (
                                <div className="flex items-start gap-1.5 text-xs text-orange-500 bg-orange-50 border border-orange-100 rounded p-2">
                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                    <span>Tỷ lệ trùng cao — kiểm tra nguồn tin</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-16 text-xs text-muted-foreground italic">
                            Chưa có dữ liệu dedup
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bottom Section: History & Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Active Pipelines Area */}
                <Card className="lg:col-span-2 shadow-sm border-transparent bg-transparent">
                    <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <PlayCircle className="h-5 w-5 text-blue-600" />
                                Pipeline đang xử lý
                            </CardTitle>
                            <CardDescription>Tiến trình tự động crawl dữ liệu trong thời gian thực</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-0 space-y-4">
                        {isLoadingPipelines ? (
                            <div className="space-y-2">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ) : pipelines.length === 0 ? (
                            <div className="h-32 flex items-center justify-center text-muted-foreground italic border border-dashed rounded-lg bg-white">
                                Không có pipeline nào đang chạy.
                            </div>
                        ) : (
                            pipelines.map((p: any) => (
                                <PipelineStatus
                                    key={p.jobId ?? p.id ?? p.url}
                                    jobId={p.jobId}
                                    url={p.url}
                                    source={p.source}
                                    status={p.status as any}
                                    currentStep={p.step as any}
                                    progress={p.progress}
                                    timeStarted={p.time}
                                    message={p.message}
                                    qualityScore={p.qualityScore}
                                />
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Recent History Table */}
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Lịch sử cào mới nhất</CardTitle>
                            <CardDescription>Danh sách 10 bài viết được xử lý gần đây</CardDescription>
                        </div>
                        <Database className="h-5 w-5 text-muted-foreground opacity-20" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingHistory ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-12 w-full" />
                                ))}
                            </div>
                        ) : history.length === 0 ? (
                            <div className="h-40 flex items-center justify-center text-muted-foreground italic border-2 border-dashed rounded-lg">
                                Chưa có dữ liệu lịch sử
                            </div>
                        ) : (
                            <div className="overflow-hidden border rounded-lg">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[50%]">Nội dung / URL</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead className="text-right">Thời gian</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {history.map((item: any) => (
                                            <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                                                <TableCell className="max-w-[300px]">
                                                    <div className="flex flex-col gap-1">
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-medium hover:text-primary flex items-center gap-1 group truncate"
                                                        >
                                                            {item.url}
                                                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                                        </a>
                                                        {item.errorMessage && (
                                                            <span className="text-[10px] text-destructive truncate italic" title={item.errorMessage}>
                                                                Error: {item.errorMessage}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {item.status === 'SUCCESS' ? (
                                                        <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 shadow-none">Thành công</Badge>
                                                    ) : item.status === 'FAILED' ? (
                                                        <Badge variant="destructive" className="shadow-none">Thất bại</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="shadow-none">Đang xử lý</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                                                    {format(new Date(item.crawledAt), 'HH:mm, dd/MM', { locale: vi })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* System Status / Quick Info */}
                <div className="flex flex-col gap-8">
                    {/* AI Quota Card */}
                    <Card className="shadow-sm border-l-4 border-l-purple-500">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Brain className="h-4 w-4 text-purple-500" />
                                AI Quota
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isLoadingAiQuota ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-2 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ) : aiQuota ? (
                                <>
                                    {/* Main usage display */}
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="text-2xl font-bold text-slate-800">
                                                {aiQuota.usedToday.toLocaleString('vi-VN')}
                                                <span className="text-sm font-normal text-muted-foreground mx-1">/</span>
                                                <span className="text-sm font-normal text-muted-foreground">{aiQuota.totalDaily.toLocaleString('vi-VN')}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">requests hôm nay</p>
                                        </div>
                                        <Badge className={
                                            aiQuota.status === 'OK' ? 'bg-green-100 text-green-800 border-green-200 shadow-none' :
                                            aiQuota.status === 'WARNING' ? 'bg-amber-100 text-amber-800 border-amber-200 shadow-none' :
                                            'bg-red-100 text-red-800 border-red-200 shadow-none'
                                        }>
                                            {aiQuota.status === 'OK' ? '🟢 OK' :
                                             aiQuota.status === 'WARNING' ? '⚠️ Warning' :
                                             '🚨 Critical'}
                                        </Badge>
                                    </div>

                                    {/* Progress bar with dynamic color */}
                                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className={cn(
                                                "absolute left-0 top-0 h-full transition-all duration-500 rounded-full",
                                                aiQuota.percentageUsed < 60 ? "bg-green-500" :
                                                aiQuota.percentageUsed < 85 ? "bg-amber-500" :
                                                "bg-red-500"
                                            )}
                                            style={{ width: `${Math.min(100, aiQuota.percentageUsed)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-muted-foreground">
                                        <span>{aiQuota.percentageUsed.toFixed(1)}% đã sử dụng</span>
                                        <span>{aiQuota.remaining.toLocaleString('vi-VN')} còn lại</span>
                                    </div>

                                    {/* Warning / Critical alert */}
                                    {aiQuota.status !== 'OK' && (
                                        <div className={cn(
                                            "flex items-start gap-2 text-xs p-2 rounded border",
                                            aiQuota.status === 'WARNING' ? "bg-amber-50 border-amber-100 text-amber-700" : "bg-red-50 border-red-100 text-red-700"
                                        )}>
                                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                            <span>
                                                {aiQuota.status === 'WARNING'
                                                    ? `Warning: chỉ còn ${aiQuota.remaining.toLocaleString('vi-VN')} requests hôm nay`
                                                    : `Critical: chỉ còn ${aiQuota.remaining.toLocaleString('vi-VN')} requests — cần kiểm tra ngay!`}
                                            </span>
                                        </div>
                                    )}

                                    {/* Per-key breakdown */}
                                    {aiQuota.keys && aiQuota.keys.length > 0 && (
                                        <AIQuotaKeyList keys={aiQuota.keys} />
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-16 text-xs text-muted-foreground italic">
                                    Chưa có dữ liệu AI quota
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Activity className="h-5 w-5 text-green-500" />
                                Trạng thái hệ thống
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Công cụ cào (Puppeteer):</span>
                                <Badge className="bg-green-500 hover:bg-green-600 text-white border-none py-0 h-5">ONLINE</Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Xử lý AI (Gemini):</span>
                                <Badge className="bg-green-500 hover:bg-green-600 text-white border-none py-0 h-5">STABLE</Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Lưu trữ ảnh (Cloudflare):</span>
                                <Badge className="bg-green-500 hover:bg-green-600 text-white border-none py-0 h-5">CONNECTED</Badge>
                            </div>
                            <hr className="my-2" />
                            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                                <Clock className="h-4 w-4 shrink-0" />
                                <span>Lượt quét RSS tiếp theo diễn ra sau 15 phút.</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold">Mẹo quản trị nội dung</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm space-y-3 list-disc pl-4 text-muted-foreground">
                                <li>Kiểm tra <b>Lịch sử</b> để phát hiện sớm các trang web đổi cấu trúc.</li>
                                <li>Sử dụng <b>Selector Tester</b> để tối ưu nội dung bóc tách.</li>
                                <li>Kích hoạt <b>Auto-Publish</b> cho các nguồn tin tin cậy.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Phase 2.2: Trending Panel */}
                    <Card className="shadow-sm border-l-4 border-l-red-500">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                🔥 Top Trending
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {trendingStats ? (
                                <>
                                    {trendingStats.topKeyword && (
                                        <div className="flex items-center justify-between rounded-lg bg-red-50 p-2">
                                            <div>
                                                <p className="text-xs text-gray-500">Hot nhất</p>
                                                <p className="text-sm font-semibold text-red-700">{trendingStats.topKeyword}</p>
                                            </div>
                                            <span className="rounded bg-red-200 px-2 py-0.5 text-xs font-medium text-red-800">
                                                {trendingStats.avgScore} điểm
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{trendingStats.activeTopics} đang hoạt động</span>
                                        <span>{trendingStats.discoveredToday} mới hôm nay</span>
                                    </div>
                                    <Link
                                        href="/admin/crawler/trending"
                                        className="block w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium py-1.5 border border-blue-200 rounded hover:bg-blue-50 transition-colors text-center"
                                    >
                                        Xem tất cả →
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-12 text-xs text-muted-foreground italic">
                                    Chưa có dữ liệu trending
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
