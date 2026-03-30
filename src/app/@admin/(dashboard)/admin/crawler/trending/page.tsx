'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trendingApi, TrendingTopic, TrendingStats } from '@/services/trending.api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card'
import { Button } from '@/components/admin/ui/button'
import { Badge } from '@/components/admin/ui/badge'
import { Input } from '@/components/admin/ui/input'
import { Skeleton } from '@/components/admin/ui/skeleton'
import { AlertTriangle, RefreshCw, Trash2, Zap, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import Link from 'next/link'

function TrendScoreBadge({ score }: { score: number }) {
    const color = score >= 80 ? 'bg-red-100 text-red-700'
        : score >= 60 ? 'bg-orange-100 text-orange-700'
        : 'bg-yellow-100 text-yellow-700'
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
            {score >= 80 ? '🔥' : score >= 60 ? '📈' : '📊'} {score}/100
        </span>
    )
}

function SourceBadge({ source }: { source: string }) {
    const label = source === 'google_trends' ? 'Google Trends'
        : source === 'news_api' ? 'News API' : 'Manual'
    const color = source === 'google_trends' ? 'bg-blue-50 text-blue-700'
        : source === 'news_api' ? 'bg-purple-50 text-purple-700'
        : 'bg-gray-50 text-gray-600'
    return (
        <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${color}`}>
            {label}
        </span>
    )
}

function formatTimeAgo(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 60) return `${diffMin} phút trước`
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour} giờ trước`
    return `${Math.floor(diffHour / 24)} ngày trước`
}

export default function TrendingPage() {
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')

    const { data: topicsData, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['trending', 'topics', page],
        queryFn: () => trendingApi.getTopics(20, page),
    })

    const { data: stats } = useQuery<TrendingStats>({
        queryKey: ['trending', 'stats'],
        queryFn: () => trendingApi.getStats(),
        refetchInterval: 300000, // 5 minutes
    })

    useEffect(() => {
        if (topicsData) {
            setTotal(topicsData.total)
        }
    }, [topicsData])

    const topics = topicsData?.data || []

    const discoverMutation = useMutation({
        mutationFn: () => trendingApi.triggerDiscover(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trending'] })
        },
    })

    const crawlNowMutation = useMutation({
        mutationFn: ({ id }: { id: string }) => trendingApi.crawlTopic(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trending'] })
        },
    })

    const autoCrawlMutation = useMutation({
        mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
            trendingApi.toggleAutoCrawl(id, enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trending'] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => trendingApi.deleteTopic(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trending'] })
            queryClient.invalidateQueries({ queryKey: ['trending', 'stats'] })
        },
    })

    const filteredTopics = topics.filter(t =>
        t.keyword.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary uppercase mb-2">📈 Trending Topics</h1>
                    <p className="text-muted-foreground">
                        Khám phá keyword đang hot tự động từ Google Trends & News API
                    </p>
                </div>
                <Button
                    onClick={() => discoverMutation.mutate()}
                    disabled={discoverMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 shadow-md"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${discoverMutation.isPending ? 'animate-spin' : ''}`} />
                    {discoverMutation.isPending ? 'Đang khám phá...' : '🔄 Khám phá ngay'}
                </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className="shadow-sm">
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Tổng Keywords</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pt-0">
                            <p className="text-2xl font-bold">{stats.totalTopics}</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Đang hoạt động</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pt-0">
                            <p className="text-2xl font-bold text-green-600">{stats.activeTopics}</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Score TB</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pt-0">
                            <p className="text-2xl font-bold text-blue-600">{stats.avgScore}</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Hot nhất</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pt-0">
                            <p className="text-sm font-bold text-red-600 truncate" title={stats.topKeyword}>
                                {stats.topKeyword || '—'}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Hôm nay</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pt-0">
                            <p className="text-2xl font-bold text-purple-600">{stats.discoveredToday}</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Search */}
            <div className="flex items-center gap-3">
                <Input
                    type="text"
                    placeholder="Tìm kiếm keyword..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1"
                />
                <span className="text-sm text-muted-foreground">
                    {filteredTopics.length} / {total} keywords
                </span>
            </div>

            {/* Topics List */}
            <div className="space-y-3">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <Card key={i} className="shadow-sm">
                            <CardContent className="pt-4 space-y-2">
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-4 w-1/4" />
                            </CardContent>
                        </Card>
                    ))
                ) : filteredTopics.length === 0 ? (
                    <Card className="shadow-sm border-dashed">
                        <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-4">
                            <TrendingUp className="h-10 w-10 opacity-20" />
                            <p>Chưa có keyword nào. Nhấn &quot;Khám phá ngay&quot; để bắt đầu.</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredTopics.map(topic => (
                        <Card key={topic._id} className="shadow-sm hover:shadow transition-shadow">
                            <CardContent className="pt-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <h3 className="text-base font-semibold">{topic.keyword}</h3>
                                            <TrendScoreBadge score={topic.trendScore} />
                                            <SourceBadge source={topic.source} />
                                            {topic.autoCrawlEnabled && (
                                                <Badge className="bg-green-50 text-green-700 border-green-200 shadow-none gap-1 h-5 px-1.5">
                                                    🔄 Auto-crawl
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                            <span>Discovered: {formatTimeAgo(topic.discoveredAt)}</span>
                                            {topic.lastCheckedAt && (
                                                <span>Checked: {formatTimeAgo(topic.lastCheckedAt)}</span>
                                            )}
                                            {topic.lastCrawledAt && (
                                                <span>Crawled: {formatTimeAgo(topic.lastCrawledAt)}</span>
                                            )}
                                            <span className="flex items-center gap-0.5">
                                                <span>📦</span> {topic.urlCount} URLs
                                            </span>
                                            <span className="text-green-600">✅ {topic.successCount}</span>
                                            <span className="text-red-600">❌ {topic.failCount}</span>
                                        </div>

                                        {topic.scoreBreakdown && (
                                            <div className="flex gap-4 mt-2">
                                                {([
                                                    { label: 'Tần suất', value: topic.scoreBreakdown.frequency },
                                                    { label: 'Tăng trưởng', value: topic.scoreBreakdown.velocity },
                                                    { label: 'Mới', value: topic.scoreBreakdown.recency },
                                                ] as const).map(({ label, value }) => (
                                                    <div key={label} className="text-xs">
                                                        <span className="text-muted-foreground">{label}: </span>
                                                        <span className="font-medium">{Math.round(value)}pt</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button
                                            size="sm"
                                            variant="default"
                                            onClick={() => crawlNowMutation.mutate({ id: topic._id })}
                                            disabled={crawlNowMutation.isPending}
                                            className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                                        >
                                            ⚡ Crawl ngay
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={topic.autoCrawlEnabled ? 'destructive' : 'outline'}
                                            onClick={() => autoCrawlMutation.mutate({
                                                id: topic._id,
                                                enabled: !topic.autoCrawlEnabled,
                                            })}
                                            disabled={autoCrawlMutation.isPending}
                                            className="h-7 px-2 text-xs"
                                        >
                                            {topic.autoCrawlEnabled ? '⏸ Tắt Auto' : '🔄 Bật Auto'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                if (confirm(`Xóa keyword "${topic.keyword}"?`)) {
                                                    deleteMutation.mutate(topic._id)
                                                }
                                            }}
                                            disabled={deleteMutation.isPending}
                                            className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {total > 20 && (
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        ← Trước
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Trang {page} / {Math.ceil(total / 20)}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page * 20 >= total}
                    >
                        Sau →
                    </Button>
                </div>
            )}
        </div>
    )
}
