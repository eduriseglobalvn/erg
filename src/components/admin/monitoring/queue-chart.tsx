"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function QueueChart() {
    // Mock queue data
    const data = [
        { time: '00:00', total: 12, processed: 10, failed: 2 },
        { time: '04:00', total: 20, processed: 18, failed: 2 },
        { time: '08:00', total: 45, processed: 40, failed: 5 },
        { time: '12:00', total: 60, processed: 58, failed: 2 },
        { time: '16:00', total: 35, processed: 30, failed: 5 },
        { time: '20:00', total: 15, processed: 15, failed: 0 },
        { time: '24:00', total: 25, processed: 23, failed: 2 },
    ];

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="w-4 h-4 text-blue-500" /> Biểu đồ Processing Queue (24h)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eee" />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="processed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProcessed)" />
                            <Area type="monotone" dataKey="failed" stroke="#ef4444" fillOpacity={1} fill="url(#colorFailed)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
