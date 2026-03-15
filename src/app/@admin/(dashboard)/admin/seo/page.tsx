"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Badge } from '@/components/admin/ui/badge';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Activity,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    Search,
    Edit
} from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';

// --- MOCK DATA FOR CHARTS THAT DON'T HAVE API YET ---



export default function SeoDashboardPage() {
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const { data: dashboardResponse, isLoading: isLoadingDashboard, refetch: refetchDashboard } = useQuery({
        queryKey: ['seoDashboard'],
        queryFn: () => seoApi.getDashboardData()
    });

    const { data: topPostsResponse, isLoading: isLoadingTopPosts, refetch: refetchTopPosts } = useQuery({
        queryKey: ['seoTopPosts'],
        queryFn: () => seoApi.getTopPosts(10, 30)
    });

    useEffect(() => {
        setLastUpdated(new Date().toLocaleTimeString('vi-VN'));
    }, [dashboardResponse]);

    const handleRefresh = () => {
        refetchDashboard();
        refetchTopPosts();
    };

    const dashboardData = dashboardResponse;
    const healthData = dashboardData?.health;
    const topPosts = topPostsResponse || [];
    const isLoading = isLoadingDashboard || isLoadingTopPosts;

    const trendData = dashboardData?.trends || [];

    const distributionData = [
        { name: 'Xuất sắc (90-100)', value: healthData?.postsAbove80 || 0, color: '#10b981' },
        { name: 'Tốt (70-89)', value: healthData?.totalPosts ? (healthData.totalPosts - (healthData.postsAbove80 || 0) - (healthData.needImprovement || 0)) : 0, color: '#3b82f6' },
        { name: 'Kém (0-49)', value: healthData?.needImprovement || 0, color: '#ef4444' },
    ];

    const bestPosts = topPosts.filter((p: { score?: number }) => (p.score || 0) >= 80).slice(0, 5) || [];
    const worstPosts = topPosts.filter((p: { score?: number }) => (p.score || 0) < 80).slice(0, 5) || [];

    const CustomPieTooltip = ({ active, payload }: { active?: boolean, payload?: Record<string, any>[] }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border shadow-sm rounded-md text-sm z-50">
                    <p className="font-semibold text-slate-700">{payload[0].name}</p>
                    <p className="text-indigo-600 font-bold">{payload[0].value} bài viết</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Activity className="text-indigo-600" />
                        SEO Dashboard
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Theo dõi tổng quan điểm số SEO và tình trạng website. Cập nhật lần cuối: {lastUpdated}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/seo/settings">
                        <Button variant="outline" className="bg-white text-slate-700 shadow-sm">
                            <Search className="w-4 h-4 mr-2" /> Kết nối GSC
                        </Button>
                    </Link>
                    <Button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Phân tích lại
                    </Button>
                </div>
            </div>

            {/* Metric Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-sm border-indigo-100">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Điểm TB</p>
                            <h3 className="text-3xl font-bold text-slate-800">{healthData?.score || 0}<span className="text-sm text-slate-400 font-normal">/100</span></h3>
                            <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
                                <TrendingUp className="w-3 h-3 mr-1" /> +3 pts (30d)
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-100/50">
                            <Activity className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Bài Tốt (≥80)</p>
                            <h3 className="text-3xl font-bold text-slate-800">
                                {healthData?.totalPosts ? Math.round(((healthData?.postsAbove80 || 0) / healthData.totalPosts) * 100) : 0}%
                            </h3>
                            <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
                                <TrendingUp className="w-3 h-3 mr-1" /> +5% (30d)
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Bài Kém ({"<50"})</p>
                            <h3 className="text-3xl font-bold text-slate-800">
                                {healthData?.totalPosts ? Math.round(((healthData?.needImprovement || 0) / healthData.totalPosts) * 100) : 0}%
                            </h3>
                            <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
                                <TrendingDown className="w-3 h-3 mr-1" /> -2% (30d)
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 border border-rose-100/50">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Tổng Lỗi Mở</p>
                            <h3 className="text-3xl font-bold text-slate-800">{healthData?.issuesCount || 0}</h3>
                            <p className="text-xs text-rose-600 mt-1 flex items-center font-medium">
                                <TrendingUp className="w-3 h-3 mr-1" /> +15 (30d)
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 border border-amber-100/50">
                            <Search className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trend Chart */}
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-slate-800">Xu hướng Điểm SEO Tổng Thể</CardTitle>
                        <CardDescription>Biến động điểm SEO trung bình 30 ngày qua</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                    <YAxis domain={['auto', 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#4f46e5"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#4f46e5' }}
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Distribution Pie Chart & Top Issues */}
                <div className="space-y-6">
                    <Card className="shadow-sm flex flex-col">
                        <CardHeader className="pb-0 shrink-0">
                            <CardTitle className="text-base font-semibold text-slate-800">Top SEO Issues</CardTitle>
                            <CardDescription>Các vấn đề cần ưu tiên xử lý</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            {dashboardData?.topIssues?.length ? (
                                dashboardData.topIssues.map((issue, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm group cursor-pointer hover:bg-slate-50 p-1.5 rounded-md transition-colors">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{issue.issue}</span>
                                            <span className="text-[10px] text-slate-400 capitalize">{issue.severity} priority</span>
                                        </div>
                                        <Badge variant="outline" className={`
                                            ${issue.severity === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                issue.severity === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'}
                                        `}>
                                            {issue.count} posts
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 italic text-xs">
                                    Không có vấn đề nào nghiêm trọng.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Lists Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                {/* Worst Posts Table */}
                <Card className="shadow-sm overflow-hidden flex flex-col border-rose-100">
                    <div className="bg-rose-50/80 p-4 border-b border-rose-100">
                        <CardTitle className="text-base font-semibold text-rose-900 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            Bài viết cần tối ưu gấp ({worstPosts.length})
                        </CardTitle>
                    </div>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-slate-600">Tiêu đề bài viết</th>
                                        <th className="text-center py-3 px-4 font-medium text-slate-600 w-16">Score</th>
                                        <th className="text-center py-3 px-4 font-medium text-slate-600 w-20">Lỗi</th>
                                        <th className="text-right py-3 px-4 font-medium text-slate-600 w-20">Xử lý</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {worstPosts.map((post: { id: string, title?: string, category?: any, score?: number, issues?: number }) => (
                                        <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="font-semibold text-slate-800 line-clamp-1">{post.title}</div>
                                                <div className="text-[11px] font-medium text-slate-500 mt-0.5">{post.category?.name || post.category || 'Chưa phân loại'}</div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-bold px-1.5 min-w-[32px] justify-center">
                                                    {post.score}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-center text-rose-600 font-bold">{post.issues || (100 - (post.score || 0))}</td>
                                            <td className="py-3 px-4 text-right">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50" asChild>
                                                    <Link href={`/admin/posts/${post.id}`}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {worstPosts.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-slate-500">Không có bài viết nào cần tối ưu.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Best Posts Table */}
                <Card className="shadow-sm overflow-hidden flex flex-col border-emerald-100">
                    <div className="bg-emerald-50/80 p-4 border-b border-emerald-100">
                        <CardTitle className="text-base font-semibold text-emerald-900 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Bài viết chuẩn SEO ({bestPosts.length})
                        </CardTitle>
                    </div>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-slate-600">Tiêu đề bài viết</th>
                                        <th className="text-center py-3 px-4 font-medium text-slate-600 w-16">Score</th>
                                        <th className="text-center py-3 px-4 font-medium text-slate-600 w-24">Traffic</th>
                                        <th className="text-right py-3 px-4 font-medium text-slate-600 w-20">Xem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {bestPosts.map((post: { id: string, title?: string, category?: any, score?: number, views?: number }) => (
                                        <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="font-semibold text-slate-800 line-clamp-1">{post.title}</div>
                                                <div className="text-[11px] font-medium text-slate-500 mt-0.5">{post.category?.name || post.category || 'Chưa phân loại'}</div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-1.5 min-w-[32px] justify-center">
                                                    {post.score}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-center font-medium text-slate-600">{post.views || 0}</td>
                                            <td className="py-3 px-4 text-right">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50" asChild>
                                                    <Link href={`/admin/posts/${post.id}`}>
                                                        <Search className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {bestPosts.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-slate-500">Chưa có bài viết nào chuẩn SEO.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
