"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/admin/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/admin/ui/chart"
import { postsApi } from "@/services/posts.api"

const chartConfig = {
    posts: {
        label: "Bài viết",
        color: "#2563eb",
    },
    views: {
        label: "Lượt xem (Est)",
        color: "#60a5fa",
    },
} satisfies ChartConfig

export function AnalyticsBarChart() {
    const [chartData, setChartData] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch max 100 posts
                const res: any = await postsApi.getAll(1, 100);
                const posts = res?.data?.data || res?.data || [];

                // Group by Month
                const monthMap = new Map<string, number>();
                // Initialize last 6 months
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const key = d.toLocaleString('default', { month: 'long' }); // "Tháng 1"
                    monthMap.set(key, 0);
                }

                posts.forEach((post: any) => {
                    if (post.createdAt) {
                        const d = new Date(post.createdAt);
                        const key = d.toLocaleString('default', { month: 'long' });
                        if (monthMap.has(key)) {
                            monthMap.set(key, (monthMap.get(key) || 0) + 1);
                        }
                    }
                });

                // Convert to array
                const data = Array.from(monthMap.entries()).map(([month, count]) => ({
                    month,
                    posts: count,
                    views: count * (Math.floor(Math.random() * 50) + 10) // Mock views
                }));

                setChartData(data);

            } catch (error) {
                console.error("Failed to fetch posts stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Thống kê bài viết</CardTitle>
                <CardDescription>Tháng 1 - Tháng 6 2026</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 7)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="posts" fill="var(--color-posts)" radius={4} />
                        <Bar dataKey="views" fill="var(--color-views)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Tăng 5.2% so với tháng trước <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Hiển thị tổng số bài viết và lượt xem trong 6 tháng gần nhất
                </div>
            </CardFooter>
        </Card>
    )
}
