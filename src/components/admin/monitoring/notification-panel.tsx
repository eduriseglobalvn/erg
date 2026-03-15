import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/card';
import { BellRing, CheckCircle2, AlertTriangle, Info } from 'lucide-react';


export function NotificationPanel() {
    // Mock general system notifications
    const notifications = [
        { id: 1, type: 'error', message: 'API Rate limit exceeded for Gemini', time: '10 phút trước' },
        { id: 2, type: 'success', message: 'Hoàn tất cào tin từ 3 nguồn RSS', time: '1 giờ trước' },
        { id: 3, type: 'info', message: 'Hệ thống đã tự động sao lưu CSDL', time: '3 giờ trước' },
        { id: 4, type: 'warning', message: 'Tài khoản UserA vừa login từ IP mới', time: '5 giờ trước' },
        { id: 5, type: 'success', message: 'Batch AI sinh 20 bài viết đã hoàn tất', time: 'Hôm qua' },
    ];

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 shadow-sm flex flex-col h-[350px]">
            <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2"><BellRing className="w-4 h-4 text-primary" /> Cảnh báo & Thông báo Gần Đây</span>
                </CardTitle>
                <CardDescription className="text-xs">Log hệ thống 24h qua</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden h-full">
                <div className="h-full overflow-y-auto p-4 custom-scrollbar">
                    <div className="space-y-4">
                        {notifications.map((n) => (
                            <div key={n.id} className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === 'error' ? 'bg-red-100 text-red-600' :
                                    n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                        n.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                            'bg-blue-100 text-blue-600'
                                    }`}>
                                    {n.type === 'error' ? <AlertTriangle className="w-4 h-4" /> :
                                        n.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                                            n.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                                                <Info className="w-4 h-4" />}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-tight text-slate-800">{n.message}</p>
                                    <p className="text-xs text-slate-500">{n.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
