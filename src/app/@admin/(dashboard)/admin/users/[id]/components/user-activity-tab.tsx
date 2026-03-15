"use client";

import { Badge } from "@/components/admin/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";

export function UserActivityTab({ userId }: { userId: string }) {
    // Mock data for user's activity
    const activities = [
        { id: 1, action: "LOGIN", device: "Chrome/Mac", ip: "192.168.1.1", target: "-", time: "2 giờ trước", type: "success" },
        { id: 2, action: "POST_CREATE", device: "Chrome/Mac", ip: "192.168.1.1", target: "Bài viết 1", time: "5 giờ trước", type: "info" },
        { id: 3, action: "PASSWORD_CHANGE", device: "Safari/iOS", ip: "10.0.0.1", target: "-", time: "1 ngày trước", type: "warning" },
    ];

    const getBadgeColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-600';
            case 'warning': return 'bg-amber-600';
            case 'danger': return 'bg-red-600';
            default: return 'bg-blue-600';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Nhật ký hoạt động</CardTitle>
                <CardDescription>Lịch sử tương tác của người dùng trên hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Hành động</TableHead>
                                <TableHead>Trình duyệt / Thiết bị</TableHead>
                                <TableHead className="w-[150px]">IP</TableHead>
                                <TableHead>Đối tượng tác động</TableHead>
                                <TableHead className="w-[150px]">Thời gian</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        Chưa ghi nhận hoạt động nào
                                    </TableCell>
                                </TableRow>
                            ) : (
                                activities.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            <Badge className={`${getBadgeColor(log.type)} text-[10px]`}>
                                                {log.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">{log.device}</TableCell>
                                        <TableCell className="text-sm font-mono text-muted-foreground">{log.ip}</TableCell>
                                        <TableCell className="text-sm">{log.target}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{log.time}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
