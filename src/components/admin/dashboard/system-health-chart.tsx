"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/admin/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/admin/ui/chart"

// Mock Data for System Health (24 hours or 24 points)
const healthData = [
    { time: "00:00", cpu: 12, memory: 24, latency: 45 },
    { time: "01:00", cpu: 15, memory: 25, latency: 42 },
    { time: "02:00", cpu: 10, memory: 22, latency: 38 },
    { time: "03:00", cpu: 8, memory: 20, latency: 35 },
    { time: "04:00", cpu: 12, memory: 21, latency: 40 },
    { time: "05:00", cpu: 18, memory: 24, latency: 45 },
    { time: "06:00", cpu: 25, memory: 28, latency: 55 },
    { time: "07:00", cpu: 35, memory: 35, latency: 65 },
    { time: "08:00", cpu: 45, memory: 42, latency: 85 },
    { time: "09:00", cpu: 55, memory: 48, latency: 120 }, // Peak hours start
    { time: "10:00", cpu: 62, memory: 55, latency: 145 },
    { time: "11:00", cpu: 58, memory: 52, latency: 130 },
    { time: "12:00", cpu: 45, memory: 45, latency: 95 },  // Lunch break
    { time: "13:00", cpu: 50, memory: 48, latency: 110 },
    { time: "14:00", cpu: 65, memory: 58, latency: 150 },
    { time: "15:00", cpu: 70, memory: 62, latency: 160 },
    { time: "16:00", cpu: 60, memory: 55, latency: 140 },
    { time: "17:00", cpu: 55, memory: 50, latency: 120 },
    { time: "18:00", cpu: 40, memory: 45, latency: 90 },
    { time: "19:00", cpu: 35, memory: 40, latency: 80 },
    { time: "20:00", cpu: 45, memory: 42, latency: 95 },
    { time: "21:00", cpu: 30, memory: 35, latency: 70 },
    { time: "22:00", cpu: 20, memory: 30, latency: 50 },
    { time: "23:00", cpu: 15, memory: 28, latency: 45 },
]

const chartConfig = {
    cpu: {
        label: "CPU Usage (%)",
        color: "#ef4444", // Red
    },
    memory: {
        label: "Memory Usage (%)",
        color: "#22c55e", // Green
    },
} satisfies ChartConfig

export function SystemHealthChart() {
    return (
        <Card className="flex flex-col border-none shadow-sm">
            <CardHeader>
                <CardTitle>System Health Status</CardTitle>
                <CardDescription>Server performance metrics (CPU & Memory) over the last 24h</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={healthData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                        {/* CPU Line */}
                        <Line
                            dataKey="cpu"
                            type="monotone"
                            stroke="var(--color-cpu)"
                            strokeWidth={2}
                            dot={false}
                        />

                        {/* Memory Line */}
                        <Line
                            dataKey="memory"
                            type="monotone"
                            stroke="var(--color-memory)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
