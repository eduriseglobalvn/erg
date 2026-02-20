"use client"

import { useEffect, useState } from "react"
import { useSeoHealth, useGscAuthUrl } from "@/hooks/use-seo"
import { SeoHealthCard } from "@/components/admin/dashboard/seo-health-card"
import { Button } from "@/components/admin/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Separator } from "@/components/admin/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import { Loader2, ExternalLink, BarChart3, Globe, ShieldCheck, Search } from "lucide-react"

export default function SeoDashboardPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">SEO Command Center</h2>
                    <p className="text-muted-foreground">
                        Tổng quan hiệu suất tìm kiếm, sức khỏe trang web và kết nối Google.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <GscConnectButton />
                </div>
            </div>

            <Separator />

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SeoHealthCard />

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Keywords Tracked</CardTitle>
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Từ khóa đang theo dõi</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Index Status</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">URL đã được Google Index</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Link Health</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Good</div>
                        <p className="text-xs text-muted-foreground">Không có lỗi gãy link nghiêm trọng</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="performance">Hiệu suất (GSC)</TabsTrigger>
                    <TabsTrigger value="issues">Vấn đề & Cảnh báo</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>SEO Score Trend</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                                    Biểu đồ xu hướng điểm SEO (Đang cập nhật)
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Top Pages (SEO)</CardTitle>
                                <CardDescription>Các trang có điểm tối ưu cao nhất</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Chưa có dữ liệu</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                    <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/20">
                        <div className="text-center space-y-2">
                            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="text-lg font-medium">Kết nối Google Search Console</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Kết nối tài khoản GSC để xem dữ liệu Clicks, Impressions và CTR thực tế từ Google.
                            </p>
                            <GscConnectButton />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function GscConnectButton() {
    const { refetch: getAuthUrl, isFetching } = useGscAuthUrl()

    const handleConnect = async () => {
        const { data } = await getAuthUrl()
        if (data?.url) {
            window.location.href = data.url
        }
    }

    return (
        <Button onClick={handleConnect} disabled={isFetching} variant="outline" className="gap-2">
            {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />}
            Kết nối Search Console
        </Button>
    )
}
