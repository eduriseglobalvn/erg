"use client"
import React from 'react';
import { MetricCard } from '@/components/admin/monitoring/metric-card';
import { QueueChart } from '@/components/admin/monitoring/queue-chart';
import { NotificationPanel } from '@/components/admin/monitoring/notification-panel';
import { Activity, Server, Database, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/admin/ui/button';

export default function MonitoringDashboard() {
    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Activity className="text-primary" /> System Monitoring
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Theo dõi sức khỏe hệ thống, hàng đợi xử lý AI và logs tự động theo thời gian thực.
                    </p>
                </div>
                <Button variant="outline" onClick={() => toast.success("Hệ thống hoạt động bình thường, không có lỗi mới.")}>
                    Kiểm tra Toast Alert
                </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="API Server"
                    value="99.9%"
                    icon={Server}
                    trend={{ value: 0.1, label: "uptime", isPositive: true }}
                    description="Uptime 30 ngày qua"
                />
                <MetricCard
                    title="Database Load"
                    value="42%"
                    icon={Database}
                    trend={{ value: 5, label: "tải", isPositive: false }}
                    description="Queries / giây: 124"
                />
                <MetricCard
                    title="AI Queue"
                    value="12"
                    icon={Bot}
                    description="Jobs pending tự động"
                />
                <MetricCard
                    title="Cảnh báo 24h"
                    value="3"
                    icon={Activity}
                    trend={{ value: 12, label: "tháng", isPositive: true }}
                    description="Timeout, Rate limit"
                />
            </div>

            {/* Charts & Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <QueueChart />
                <NotificationPanel />
            </div>
        </div>
    );
}
