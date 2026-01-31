"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
    History,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    AlertCircle,
    RefreshCcw
} from "lucide-react"
import { crawlerApi, CrawlHistoryItem } from "@/services/crawler.api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Badge } from "@/components/admin/ui/badge"
import { Button } from "@/components/admin/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/admin/ui/select"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function CrawlHistoryPage() {
    const [page, setPage] = React.useState(1)
    const limit = 20

    // 1. Fetch History
    const { data: historyData, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['crawler', 'history', page],
        queryFn: () => crawlerApi.getHistory(page, limit),
    })

    const history = historyData?.items || []
    const total = historyData?.total || 0
    const totalPages = Math.ceil(total / limit)

    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary uppercase mb-2">Lịch sử cào tin</h1>
                    <p className="text-muted-foreground">Theo dõi toàn bộ quá trình thu thập dữ liệu từ các nguồn.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => refetch()}
                    disabled={isRefetching}
                    className="h-11 px-4"
                >
                    <RefreshCcw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                    Làm mới
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm kiếm URL..." className="pl-10" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Select defaultValue="ALL">
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Tất cả</SelectItem>
                                    <SelectItem value="SUCCESS">Thành công</SelectItem>
                                    <SelectItem value="FAILED">Thất bại</SelectItem>
                                    <SelectItem value="PENDING">Đang chờ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4 py-8">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-12 w-full bg-muted animate-pulse rounded-md" />
                            ))}
                        </div>
                    ) : history.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl gap-4 bg-muted/5">
                            <Clock className="h-10 w-10 opacity-10" />
                            <p>Chưa có dữ liệu lịch sử cào tin.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="overflow-hidden border rounded-lg">
                                <Table>
                                    <TableHeader className="bg-muted/50 text-[11px] uppercase tracking-wider font-bold">
                                        <TableRow>
                                            <TableHead className="w-[55%]">Thông tin bài viết / URL</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead className="text-right">Thời gian</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {history.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell>
                                                    <div className="flex flex-col gap-1 pr-4">
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 group truncate max-w-full"
                                                        >
                                                            {item.url}
                                                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </a>
                                                        {item.errorMessage && (
                                                            <div className="flex items-center gap-1 text-[10px] text-destructive bg-red-50 p-1 rounded border border-red-100 mt-1">
                                                                <AlertCircle className="h-3 w-3 shrink-0" />
                                                                <span className="truncate" title={item.errorMessage}>{item.errorMessage}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={item.status} />
                                                </TableCell>
                                                <TableCell className="text-right text-[11px] text-muted-foreground italic whitespace-nowrap">
                                                    {format(new Date(item.crawledAt), 'HH:mm:ss, dd/MM/yyyy', { locale: vi })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-2 py-2">
                                <p className="text-xs text-muted-foreground">
                                    Hiển thị <b>{(page - 1) * limit + 1}</b> - <b>{Math.min(page * limit, total)}</b> trong tổng số <b>{total}</b> bản ghi
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="h-8 px-2"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" /> Trước
                                    </Button>
                                    <div className="flex items-center gap-1.5 mx-2">
                                        <Badge variant="secondary" className="h-8 w-8 flex items-center justify-center p-0 rounded-md bg-primary text-white border-none">{page}</Badge>
                                        <span className="text-xs text-muted-foreground">/</span>
                                        <span className="text-xs font-medium">{totalPages}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="h-8 px-2"
                                    >
                                        Sau <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'SUCCESS':
            return (
                <Badge className="bg-green-500 hover:bg-green-600 text-white border-none flex items-center gap-1 px-2 h-6 shadow-sm">
                    <CheckCircle2 className="h-3 w-3" /> Thành công
                </Badge>
            )
        case 'FAILED':
            return (
                <Badge variant="destructive" className="flex items-center gap-1 px-2 h-6 shadow-sm">
                    <XCircle className="h-3 w-3" /> Thất bại
                </Badge>
            )
        default:
            return (
                <Badge variant="secondary" className="flex items-center gap-1 px-2 h-6 shadow-sm">
                    <Clock className="h-3 w-3" /> Đang chờ
                </Badge>
            )
    }
}
