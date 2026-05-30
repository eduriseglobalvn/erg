"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { TrendingUp } from "lucide-react"
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/cms/ui/card"
import { ChartConfig, ChartContainer } from "@/components/cms/ui/chart"
import { userApi } from "@/services/users.api"

const chartConfig = {
    count: {
        label: "Người dùng",
    },
    users: {
        label: "Người dùng hoạt động",
        color: "#2563eb",
    },
} satisfies ChartConfig

export function AnalyticsRadialChart() {
    const { data: totalUsers = 0, isLoading } = useQuery({
        queryKey: ['analytics', 'users', 'count'],
        queryFn: async () => {
            const res: any = await userApi.getAllUsers(1, 1);
            const meta = res?.data?.meta || res?.meta;
            return meta?.total || 0;
        }
    })

    const chartData = [
        { browser: "users", count: totalUsers, fill: "#2563eb" },
    ]


    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Người dùng hệ thống</CardTitle>
                <CardDescription>Tổng số tài khoản đã đăng ký</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[280px] w-full"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={0}
                        endAngle={250}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="count" background cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-4xl font-bold"
                                                >
                                                    {isLoading ? "..." : totalUsers.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Tài khoản
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Tăng 12.5% so với tháng trước <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Người dùng hoạt động trong 30 ngày qua
                </div>
            </CardFooter>
        </Card>
    )
}
