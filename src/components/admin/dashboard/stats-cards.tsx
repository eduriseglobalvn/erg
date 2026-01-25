"use client"

import { TrendingUp, Users, FileText, Activity, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { analyticsApi } from "@/services/analytics.api"
import { useState, useEffect } from "react"

export function StatsCards() {
    const [stats, setStats] = useState({
        totalVisits: 0,
        activeUsers: 0,
        newUsers: 0,
        totalPosts: 0
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi API Analytics Overview
                const res: any = await analyticsApi.getOverview();
                const data = res?.data || res || {};

                setStats({
                    totalVisits: data.totalVisits || 0,
                    activeUsers: data.activeUsers || 0,
                    newUsers: data.newUsers || 0,
                    totalPosts: data.totalPosts || 0
                });

            } catch (e) {
                console.error("Failed to fetch dashboard overview", e)
            }
        }
        fetchData();
    }, [])

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Total Visits */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalVisits.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">Lượt truy cập tổng hợp</p>
                </CardContent>
            </Card>

            {/* Card 2: Active Users */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                    <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">Người dùng hoạt động</p>
                </CardContent>
            </Card>

            {/* Card 3: New Users */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">New Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.newUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">Đăng ký mới kỳ này</p>
                </CardContent>
            </Card>

            {/* Card 4: Posts Placeholder (Example) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">Good</div>
                    <p className="text-xs text-muted-foreground mt-1">Hệ thống ổn định</p>
                </CardContent>
            </Card>
        </div>
    )
}
