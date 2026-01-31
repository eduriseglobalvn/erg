"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
    Globe,
    CheckCircle2,
    XCircle,
    Activity,
    Clock,
    Database,
    Zap,
    ExternalLink
} from "lucide-react"
import { crawlerApi, CrawlerStats, CrawlHistoryItem } from "@/services/crawler.api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Progress } from "@/components/admin/ui/progress"
import { Skeleton } from "@/components/admin/ui/skeleton"
import { Badge } from "@/components/admin/ui/badge"
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

export default function CrawlerDashboardPage() {
    // 1. Fetch Stats
    const { data: stats, isLoading: isLoadingStats } = useQuery<CrawlerStats>({
        queryKey: ['crawler', 'stats'],
        queryFn: () => crawlerApi.getStats()
    })

    // 2. Fetch Recent History
    const { data: historyData, isLoading: isLoadingHistory } = useQuery({
        queryKey: ['crawler', 'history', 'recent'],
        queryFn: () => crawlerApi.getHistory(1, 10)
    })

    const history = historyData?.items || []

    return (
        <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary uppercase mb-2">Crawler Dashboard</h1>
                <p className="text-muted-foreground">
                    Theo dõi tình trạng cào dữ liệu tự động từ các nguồn RSS và Website.
                </p>
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
                            <div className="text-2xl font-bold">{stats?.totalHistory ? Math.round((stats.successCrawl / stats.totalHistory) * 100) : 0}%</div>
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

            {/* Bottom Section: History & Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                        {history.map((item) => (
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
                </div>
            </div>
        </div>
    )
}
