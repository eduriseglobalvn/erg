"use client";

import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";

export function UserSessionsTab({ userId }: { userId: string }) {
    // Mock data for user's sessions
    const sessions = [
        { id: "s1", device: "Chrome / Mac OS X", ip: "192.168.1.1", location: "Hồ Chí Minh, VN", status: "Active", lastAccess: "Vừa xong", isCurrent: true },
        { id: "s2", device: "Safari / iOS", ip: "10.0.0.1", location: "Hà Nội, VN", status: "Active", lastAccess: "2 giờ trước", isCurrent: false },
        { id: "s3", device: "Edge / Windows 11", ip: "172.16.0.5", location: "Đà Nẵng, VN", status: "Expired", lastAccess: "2 tuần trước", isCurrent: false },
    ];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Phiên đăng nhập</CardTitle>
                    <CardDescription>Quản lý các thiết bị đang đăng nhập tài khoản này</CardDescription>
                </div>
                <Button variant="destructive" size="sm">Thu hồi tất cả</Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Thiết bị / Trình duyệt</TableHead>
                                <TableHead>IP & Vị trí</TableHead>
                                <TableHead className="w-[120px]">Trạng thái</TableHead>
                                <TableHead className="w-[150px]">Truy cập cuối</TableHead>
                                <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        Không có phiên đăng nhập nào
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sessions.map((session) => (
                                    <TableRow key={session.id}>
                                        <TableCell>
                                            <div className="font-medium flex items-center gap-2">
                                                {session.device}
                                                {session.isCurrent && <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50 text-[10px]">Current</Badge>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-mono text-muted-foreground mb-1">{session.ip}</div>
                                            <div className="text-xs">{session.location}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={session.status === 'Active' ? 'default' : 'secondary'} className={session.status === 'Active' ? 'bg-blue-600' : ''}>
                                                {session.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{session.lastAccess}</TableCell>
                                        <TableCell className="text-right">
                                            {session.status === 'Active' && !session.isCurrent && (
                                                <Button variant="ghost" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs">
                                                    Đăng xuất
                                                </Button>
                                            )}
                                        </TableCell>
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
