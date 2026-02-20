"use client"

import { useSeoPerformance } from "@/hooks/use-seo"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/admin/ui/card"
import { Skeleton } from "@/components/admin/ui/skeleton"
import { ArrowUpRight, TrendingUp } from "lucide-react"
import Link from "next/link"

export function SeoTopPerformingPosts() {
    const { data: performance, isLoading, isError } = useSeoPerformance('month')

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <Skeleton className="h-6 w-[250px] mb-2" />
                    <Skeleton className="h-4 w-[180px]" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    if (isError || !performance) return null

    const topPerformingPosts = performance.topPerformingPosts || []

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Top Performing Posts</CardTitle>
                    <CardDescription>Các bài viết hút traffic nhiều nhất</CardDescription>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {topPerformingPosts.slice(0, 10).map((post, i) => (
                        <div key={post.id} className="flex items-center gap-4 group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-500">
                                {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/admin/posts/${post.id}/edit`}
                                    className="text-sm font-semibold truncate block hover:text-blue-500 transition-colors"
                                >
                                    {post.title}
                                </Link>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <ArrowUpRight className="w-3 h-3 text-blue-500" />
                                        {post.total_clicks} clicks
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        Avg. Pos: <span className="font-bold text-foreground">{post.avg_position.toFixed(1)}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {topPerformingPosts.length === 0 && (
                        <div className="text-center py-10 text-sm text-muted-foreground">
                            Chưa có dữ liệu hiệu suất bài viết.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
